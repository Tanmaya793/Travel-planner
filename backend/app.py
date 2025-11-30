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


if __name__ == '__main__':
    print("🚀 Flask Backend Starting...")
    app.run(debug=True, port=5000)
