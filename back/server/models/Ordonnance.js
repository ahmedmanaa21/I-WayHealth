const mongoose = require("mongoose");
const Consultation = require("./consultation");
const Medicament = require("./Medicaments");

const ordonnanceSchema = new mongoose.Schema({
    consultation: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Consultation', 
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
