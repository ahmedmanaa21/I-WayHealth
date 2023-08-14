const mongoose = require("mongoose");
const Adherants = require("./Adherants");

const Situation_familiale = {
    Wife: "Wife",
    Child: "Child",
};

const Sexe = {
    Masculin: "Masculin",
    Feminine: "Feminine",
};

const BeneficairesSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    date_naissance: {
        type: Date,
        required: true,
    },
    sexe: {
        type: String,
        required: true,
    },
    situation_familiale: {
        type: String,
        enum: Object.values(Situation_familiale),
    },
    Adherant: {
        type: mongoose.Schema.Types.ObjectId, // Assuming Adherants is referenced by ObjectId
        ref: 'Adherants', // This should match the model name of Adherants
        required: true,
    },
},
    { timestamps: true }
);

const Beneficaires = mongoose.model("Beneficaires", BeneficairesSchema);
module.exports = Beneficaires;



