const mongoose = require("mongoose");
const Consultation = require("./consultation");
 
const pathologie = {
    Cancer: "Cancer",
    HeartDisease: "HeartDisease",
    ChronicDisease: "ChronicDisease",
    RespiratoryDisease: "RespiratoryDisease",
    };

const DossierSchema = new mongoose.Schema({
    stats: {
        type: String,
        required: true,
    },
    numPoloice : {
        type: Number,
        required: true,
    },
    pathologie : {
        type: String,
        enum: Object.values(pathologie),
    },
    consultation: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Consultation', 
        required: true,
    },

},
    { timestamps: true }
);

const Dossier = mongoose.model("Dossier", DossierSchema);
module.exports = Dossier;

    
    