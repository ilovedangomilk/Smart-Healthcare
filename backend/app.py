from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app, resources={
    r"/assistance": {"origins": "http://localhost:3000"},
    r"/acknowledge/*": {"origins": "http://localhost:3000"}
})

socketio = SocketIO(app, 
    cors_allowed_origins="http://localhost:3000",
    logger=True,
    engineio_logger=True
)

active_requests = {}

@app.route("/assistance", methods=["POST", "OPTIONS"])
def assistance():
    if request.method == "OPTIONS":
        print("Received OPTIONS request")
        return jsonify({"status": "success"}), 200
    
    try:
        print("\n=== New Assistance Request ===")
        print("Headers:", request.headers)
        print("Raw data:", request.data)
        
        data = request.get_json()
        print("Parsed JSON:", data)
        
        if not data:
            print("No data received")
            return jsonify({"error": "No data received"}), 400
            
        patient_name = data.get("pname")
        room_number = data.get("room")
        print(f"Patient: {patient_name}, Room: {room_number}")
        
        if not patient_name or not room_number:
            print("Missing data")
            return jsonify({"error": "Missing patient name or room number"}), 400
        
        # Store the request
        active_requests[room_number] = {
            "pname": patient_name,
            "timestamp": time.time()
        }
        
        print(f"Emitting new_request for room {room_number}")
        socketio.emit("new_request", {
    "room": room_number,
    "pname": patient_name,
    "timestamp": active_requests[room_number]["timestamp"]
}, namespace='/')
        
        print("Request processed successfully")
        return jsonify({
            "status": "success",
            "message": "Assistance requested",
            "room": room_number
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "error": str(e),
            "type": "server_error"
        }), 500

@app.route("/acknowledge/<room_number>", methods=["POST", "OPTIONS"])
def acknowledge(room_number):
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200
        
    try:
        if room_number in active_requests:
            # Notify all clients
            socketio.emit("request_acknowledged", {
                "room": room_number
            }, namespace='/')
            
            del active_requests[room_number]
            return jsonify({"status": "success"})
            
        return jsonify({"error": "Room not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)