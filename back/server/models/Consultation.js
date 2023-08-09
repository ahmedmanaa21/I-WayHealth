const mongoose = require("mongoose");
const User = require("./User");
const Adherants = require("./Adherants");

const ConsultationSchema = new mongoose.Schema({
    _id: Number,
    medecin: {
        type: User.Schema,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    adherant: {
        type: Adherants.Schema,
        required: true,
    },
    beneficiaire: {
        type: beneficiaire.Schema,
        required: true,
    },
    diagnostic: {
        type: String,
        required: true,
    },
    ordonnance: {
        type: String,
        required: true,
    },
    },
    { timestamps: true }
);


const Consultation = mongoose.model("Consultation", ConsultationSchema);
module.exports = Dossier ;

