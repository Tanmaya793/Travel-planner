from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
import os
from datetime import datetime
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'trip_planner')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (data['name'], data['email'], hashed)
        )
        conn.commit()
        new_user_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'User created successfully'}), 201
    except mysql.connector.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
            token = jwt.encode(
                {'user_id': user['id'], 'exp': datetime.utcnow().timestamp() + 7*24*60*60},
                app.config['JWT_SECRET_KEY'],
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
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips', methods=['GET', 'POST'])
def trips():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
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
                INSERT INTO trips (user_id, title, destinations, start_date, end_date, budget)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                user_id, data['title'], json.dumps(data['destinations']),
                data['start_date'], data['end_date'], data['budget']
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
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
