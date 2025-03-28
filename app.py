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


patient_db = {
    "Bob":{
        "Appointments": {
            "Past":[
                {"Date":"2024-03-01","Time":"5pm","Type":"Surgery","Room":1},
                {"Date":"2023-12-11","Time":"2pm","Type":"Consultation","Room":2}
            ],
            "Missed":[
                {"Date":"2024-03-17","Time":"4pm","Type":"Surgery Follow-up","Room":3}
            ],
            "Upcoming":[
                {"Date":"2024-03-17","Time":"4pm","Type":"Surgery Follow-up","Room":4}
            ]
        },
        "Invoices":[
            {"Date":"2024-03-01","Time":"5pm","Amount":1000},
            {"Date":"2023-12-11","Time":"2pm","Amount":95}
        ],
        "Medication":{ # Dict to iterate through the dates for the filter
            "2024-03-01":[
                {"Medicine":"Paracetamol","Dosage":"500mg","Quantity":10},
                {"Medicine":"Amoxicillin","Dosage":"500mg","Quantity":20}
            ],
            "2023-12-11":[
                {"Medicine":"Ibuprofen","Dosage":"400mg","Quantity":10}
            ]
        }
    }
}


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

@app.route("/<patientname>/appointments")
def appointments(patientname):
    past_appointments = patient_db[patientname]["Appointments"]["Past"] # List of dictionaries
    missed_appointments = patient_db[patientname]["Appointments"]["Missed"]
    # Assume in this case that upcoming appointment refers to the appointment that the 
    # patient is in the clinic for. The room number can be derived from here rather than manual entering
    upcoming_appointments = patient_db[patientname]["Appointments"]["Upcoming"]
    return render_template("", 
                           past_appointments=past_appointments,
                           missed_appointments=missed_appointments,
                           upcoming_appointments=upcoming_appointments
                           )

@app.route("/<patientname>/medication")
def medications(patientname):
    medication_records = patient_db[patientname]["Medication"]
    return render_template("", medication_records=medication_records) # placeholder page

@app.route("/<patientname>/invoices")
def invoices(patientname):
    invoice_records = patient_db[patientname]["Invoices"]
    return render_template("", invoice_records=invoice_records) 

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
