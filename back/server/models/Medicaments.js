const mongoose = require("mongoose");

const forme = {
    Comprime: "Comprime",
    Gelule: "Gelule",
    Sirop: "Sirop",
    Pommade: "Pommade",
    Goutte: "Goutte",
    Suppositoire: "Suppositoire",
    Spray: "Spray",
    Patch: "Patch",
    Autre: "Autre",
    };

const MedicamentSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    forme: {
        type: String,
        enum: Object.values(forme),
        required: true,
    },
    prix: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    }
    },
    { timestamps: true }
);

const Medicament = mongoose.model("Medicament", MedicamentSchema);
module.exports = Medicament;