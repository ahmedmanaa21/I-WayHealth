const mongoose = require("mongoose");
const Consultation = require("./Consultation");
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
    medicaments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicament',
    }],
    duree: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);

const Ordonnance = mongoose.model("Ordonnance", ordonnanceSchema);
module.exports = Ordonnance;
