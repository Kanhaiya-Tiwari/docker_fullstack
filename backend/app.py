from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage (for demonstration)
users_db = []

@app.route('/')
def home():
    return jsonify({
        'message': 'Flask Backend API',
        'status': 'running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullname', 'email', 'phone', 'age', 'gender', 'country']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Validate age
        age = int(data['age'])
        if age < 18 or age > 100:
            return jsonify({
                'success': False,
                'message': 'Age must be between 18 and 100'
            }), 400
        
        # Create user object
        user = {
            'id': len(users_db) + 1,
            'fullname': data['fullname'],
            'email': data['email'],
            'phone': data['phone'],
            'age': age,
            'gender': data['gender'],
            'country': data['country'],
            'registered_at': datetime.now().isoformat()
        }
        
        # Check if email already exists
        if any(u['email'] == user['email'] for u in users_db):
            return jsonify({
                'success': False,
                'message': 'Email already registered'
            }), 400
        
        # Add user to database
        users_db.append(user)
        
        logger.info(f'New user registered: {user["email"]}')
        
        return jsonify({
            'success': True,
            'message': f'Welcome {user["fullname"]}! Registration successful.',
            'user': user
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': 'Invalid data format'
        }), 400
    except Exception as e:
        logger.error(f'Error during registration: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify({
        'success': True,
        'count': len(users_db),
        'users': users_db
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)