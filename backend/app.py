from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD') or '',
    'database': os.getenv('DB_NAME', 'trip_planner')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (data['name'], data['email'], hashed)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'User created successfully'}), 201
    except mysql.connector.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 400
    except Exception as e:
        print(f"Register error: {e}")  # Debug
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
            token = jwt.encode(
                {'user_id': user['id'], 'exp': datetime.utcnow() + timedelta(days=7)},
                os.getenv('JWT_SECRET_KEY'),
                algorithm='HS256'
            )
            return jsonify({
                'token': token,
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email']
                }
            })
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {e}")  # Debug
        return jsonify({'error': str(e)}), 500

@app.route('/api/spots', methods=['GET'])
def get_spots():
    try:
        state_filter = request.args.get('state', 'all')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if state_filter == 'all':
            cursor.execute("""
                SELECT s.*, u.name as state_name 
                FROM spots s 
                LEFT JOIN states u ON s.state_id = u.id 
                ORDER BY s.popularity DESC
            """)
        else:
            cursor.execute("""
                SELECT s.*, u.name as state_name 
                FROM spots s 
                JOIN states u ON s.state_id = u.id 
                WHERE u.name = %s 
                ORDER BY s.popularity DESC
            """, (state_filter,))
            
        spots = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(spots)
    except Exception as e:
        print(f"Spots error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/states', methods=['GET'])
def get_states():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, name, 
                   (SELECT COUNT(*) FROM spots WHERE state_id = states.id) as spot_count
            FROM states 
            ORDER BY name
        """)
        states = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(states)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips', methods=['GET', 'POST'])
def trips():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        user_id = payload['user_id']
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if request.method == 'GET':
            cursor.execute(
                "SELECT * FROM trips WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            trips_list = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify(trips_list)
        
        elif request.method == 'POST':
            data = request.json
            cursor.execute("""
                INSERT INTO trips 
                (user_id, title, destinations, start_date, members, days, per_day_cost, total_cost, start_datetime)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                user_id, 
                data['title'], 
                json.dumps(data['destinations']),
                data['start_date'],
                data.get('members', 1),
                data.get('days', 1),
                data.get('per_day_cost', 0),
                data.get('total_cost', 0),
                data.get('start_datetime')
            ))
            conn.commit()
            new_trip_id = cursor.lastrowid
            cursor.close()
            conn.close()
            return jsonify({'id': new_trip_id, **data}), 201
            
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Trips error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/trips/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        user_id = payload['user_id']
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM trips WHERE id = %s AND user_id = %s",
            (trip_id, user_id)
        )
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Trip not found'}), 404
        
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Trip deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/spots/top-rated', methods=['GET'])
def get_top_rated_spots():
    try:
        limit = request.args.get('limit', 12, type=int)
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT s.*, u.name as state_name 
            FROM spots s 
            JOIN states u ON s.state_id = u.id 
            WHERE s.rating >= 4.5
            ORDER BY s.rating DESC, s.popularity DESC
            LIMIT %s
        """, (limit,))
        spots = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(spots)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Flask Backend Starting...")
    app.run(debug=True, port=5000)
