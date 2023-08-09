const mongoose = require("mongoose");
const Consultation = require("./consultation");
const Medicament = require("./Medicaments");

const ordonnanceSchema = new mongoose.Schema({
    _id: Number,
    consultation: {
        type: Consultation.Schema,
        required: true,
    },
    commentaire: {
        type: String,
        required: true, 
    },
    medicaments: {
        type: [Medicament.Schema],
        required: true,
    },
    duree : {
        type: Number,
        required: true,
    },
    },
    { timestamps: true }
);

const Ordonnance = mongoose.model("Ordonnance", ordonnanceSchema);
module.exports = Ordonnance;
