const mongoose = require("mongoose");

const forme = {
    Tablet: "Tablet",
    Capsule: "Capsule",
    Syrup: "Syrup",
    Ointment: "Ointment",
    Drop: "Drop",
    Suppository: "Suppository",
    Spray: "Spray",
    Patch: "Patch",
    Other: "Other",
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