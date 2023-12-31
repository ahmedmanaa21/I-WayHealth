const mongoose = require("mongoose");
const User = require("./User");
const Adherants = require("./Adherants");
const Beneficaires = require("./Beneficaires");
const Ordonnance = require("./ordonnance");

const ConsultationSchema = new mongoose.Schema({
    medecin: {
        type: User.schema,
    },
    date: {
        type: Date,
        required: true,
    },
    adherant: {
        type: Adherants.schema,
    },
    beneficiaire: {
        type: Beneficaires.schema,
        required: false,
    },
    diagnostic: {
        type: String,
        required: true,
    },
    ordonnance: {
        type: Ordonnance.schema,
    },
},
    { timestamps: true }
);


const Consultation = mongoose.model("Consultation", ConsultationSchema);
module.exports = Consultation;

