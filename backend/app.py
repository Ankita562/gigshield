from flask import Flask, request, jsonify
from flask_cors import CORS # Critical for "Failed to fetch"

app = Flask(__name__)
CORS(app) # This allows your frontend at :5173 to talk to this backend

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    # Logic to save user to your database
    return jsonify({
        "message": "User registered successfully",
        "user": {"id": "123", "name": data.get('name')},
        "policy": {"status": "pending"}
    }), 201

if __name__ == '__main__':
    app.run(port=5000, debug=True)