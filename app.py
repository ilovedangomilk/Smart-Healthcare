from flask import Flask, render_template, request, send_from_directory, url_for
from flask_socketio import SocketIO
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

@app.route("/patient")
def patient():
    return render_template("patient_screen.html")

@app.route("/assistance", methods=["POST"])
def assistance():
    data = request.json
    patient_name = data.get("pname")
    room_number = data.get("room")
    print(patient_name, room_number)
   
    assistance_message = f"Patient {patient_name} in Room {room_number} is requesting assistance."

    # Emit both message and room number
    socketio.emit("request_assistance", {
        "message": assistance_message,
        "room": room_number  # Add this line to send the room number
    })

    return render_template("acknowledgement.html")

@app.route("/staff")
def staff():
    return render_template("staff_screen.html")

@app.route("/file_upload", methods=["GET", "POST"])
def file_upload():
    if request.method == "GET":
        return render_template("upload_documents.html")
    else:
        file = request.files["file"]
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)
            url = url_for("file_handling", filename=filename)
            return render_template("view_documents.html", url=url)

@app.route("/file_handling/<filename>")
def file_handling(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    socketio.run(app, debug=True, use_reloader=False)
