const mongoose = require("mongoose");
const User = require("./User");
const Adherants = require("./Adherants");
const Beneficaires = require("./Beneficaires");

const ConsultationSchema = new mongoose.Schema({
    _id: Number,
    medecin: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Adherants', 
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    adherant: {
        type: mongoose.Schema.Types.ObjectId, // Assuming Adherants is referenced by ObjectId
        ref: 'Adherants', // This should match the model name of Adherants
        required: true,
    },
    beneficiaire: {
        type: mongoose.Schema.Types.ObjectId, // Assuming Adherants is referenced by ObjectId
        ref: 'Beneficaires', // This should match the model name of Adherants
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
module.exports = Consultation ;

