const mongoose = require("mongoose");
const Beneficaires = require("./Beneficaires");

const Situation_familiale = {
    Single: "Single",
    Married: "Married",
    Divorced: "Divorced",
    Widowed: "Widowed",
};

const Situation_adhesion = {
    Waiting: "Waiting",
    Accepted: "Accepted",
    Refused: "Refused",
};


const AdherantsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    situation_familiale: {
        type: String,
        enum: Object.values(Situation_familiale),
        default: Situation_familiale.Single,
    },
    date_naissance: {
        type: Date,
        required: true,
    },
    vip: {
        type: Boolean,
        default: false,
    },
    situation_adhesion: {
        type: String,
        enum: Object.values(Situation_adhesion),
        default: Situation_adhesion.Waiting,
    },
    date_adhesion: {
        type: Date,
        required: true,
    },
    apci: {
        type: Boolean,
        default: false,
    },
    couple: {
        type: Boolean,
        default: false,
    },
    photo: {
        type: String,
        required: false,
    },
    Benefciaire: {
        type: [Beneficaires.schema],
        required: false,
    },
},
    { timestamps: true }
);




const Adherants = mongoose.model("Adherants", AdherantsSchema);
module.exports = Adherants;



