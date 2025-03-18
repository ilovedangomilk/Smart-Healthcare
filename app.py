from flask import Flask, render_template, request, send_from_directory, url_for
from flask_socketio import SocketIO
from werkzeug.utils import secure_filename
import os


app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
socketio = SocketIO(app)

@app.route("/patient")
def patient():
    return render_template("patient_screen.html")


@app.route("/assistance", methods=["POST"])
def assistance():
    patient_name = request.form.get("pname")
    room_number = request.form.get("room")
    treatment = request.form.get("treatment")
    session_number = request.form.get("session")
    assistance_message = f"Patient {patient_name} in Room {room_number} undergoing their {session_number} {treatment} treatment is requesting for assistance."
    socketio.emit("request_assistance", {"message":assistance_message})
    return render_template("acknowledgement.html")


@app.route("/staff")
def staff():
    return render_template("staff_screen.html")

@app.route("/file_upload", methods=["GET","POST"])
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
    socketio.run(app)
