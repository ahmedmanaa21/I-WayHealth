const mongoose = require("mongoose");
const User = require("./User");
const Adherants = require("./Adherants");
const Beneficaires = require("./Beneficaires");
const Ordonnance = require("./ordonnance");

const ConsultationSchema = new mongoose.Schema({
    medecin: {
        type: mongoose.Schema.Types.Number, 
        ref: 'User', 
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    adherant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adherants',
        required: true,
    },
    beneficiaire: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Beneficaires',
        required: true,
    },
    diagnostic: {
        type: String,
        required: true,
    },
    },
    { timestamps: true }
);


const Consultation = mongoose.model("Consultation", ConsultationSchema);
module.exports = Consultation ;

