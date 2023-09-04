const User = require("../models/User");
const Adherants = require("../models/Adherants");
const Beneficaires = require("../models/Beneficaires");
const Consultation = require("../models/consultation");
const Dossier = require("../models/Dossier");
const Ordonnance = require("../models/ordonnance");
const Medicament = require("../models/Medicaments");
const { Router } = require("express");
const router = Router();

// Routes for Adherants
// GET all adherants
router.get('/adherants', async (req, res) => {
    try {
        const adherants = await Adherants.find();
        res.json(adherants);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET a specific adherant by ID
router.get('/adherants/:id', async (req, res) => {
    try {
        const adherant = await Adherants.findById(req.params.id);
        if (!adherant) {
            return res.status(404).json({ error: 'Adherant not found' });
        }
        res.json(adherant);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// CREATE a new adherant with assigining his beneficaires to it and save them to beneficaires collection
router.post('/adherants', async (req, res) => {
    try {
    //     const adherantData = req.body;
    //     const adherant = new Adherants({
    //         nom: adherantData.nom,
    //         prenom: adherantData.prenom,
    //         date_naissance: adherantData.date_naissance,
    //         sexe: adherantData.sexe,
    //         date_adhesion: adherantData.date_adhesion,
    //         adresse: adherantData.adresse,
    //         vip: adherantData.vip,
    //         telephone: adherantData.telephone,
    //         email: adherantData.email,
    //         situation_familiale: adherantData.situation_familiale,
    //         situation_adhesion: adherantData.situation_adhesion,
    //         Benefciaire: [],
    //     });
        
    //     for (const beneficaireData of adherantData.Benefciaire) {
    //         const beneficaire = new Beneficaires(beneficaireData);
    //         beneficaire.Adherant = adherant; 
    //         await beneficaire.save();
    //         adherant.Benefciaire.push(beneficaire);
    //     }
    //     await adherant.save();


    //     const adherantResponse = {
    //         _id: adherant._id,
    //         nom: adherant.nom,
    //         prenom: adherant.prenom,            
    //         Benefciaire: adherant.Benefciaire.map(beneficaire => ({
    //             _id: beneficaire._id,
    //             nom: beneficaire.nom,
    //             prenom: beneficaire.prenom,

    //         })),
    //     };
    //     res.json(adherantResponse);
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ error: 'Internal server error' });
        const { email: email,
            nom: nom,
            prenom: prenom,
            situation_familiale: situation_familiale,
            date_naissance: date_naissance,
            vip: vip,
            situation_adhesion: situation_adhesion,
            date_adhesion: date_adhesion,
            apci: apci,
            couple: couple,
            photo: photo,
            Benefciaire: Benefciaire

        } = req.body;
        const Adherant = new Adherants({
            email: email,
            nom: nom,
            prenom: prenom,
            situation_familiale: situation_familiale,
            date_naissance: date_naissance,
            vip: vip,
            situation_adhesion: situation_adhesion,
            date_adhesion: date_adhesion,
            apci: apci,
            couple: couple,
            photo: photo,
            Benefciaire: []
        });


        if (Benefciaire && Benefciaire.length > 0) {
            for (const beneficaireData of Benefciaire) {
                const beneficaire = new Beneficaires({

                    nom: beneficaireData.nom,
                    prenom: beneficaireData.prenom,
                    date_naissance: beneficaireData.date_naissance,
                    sexe: beneficaireData.sexe,
                    situation_familiale: beneficaireData.situation_familiale,
                    Adherant: Adherant
                });
                await beneficaire.save();
                Adherant.Benefciaire.push(beneficaire);
            }
        }

        await Adherant.save();


        res.status(201).json(Benefciaire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de l'adherent." });
    }
});



// UPDATE an existing adherant by ID 
router.put('/adherants/:id', async (req, res) => {
    try {
        const updatedAdherant = await Adherants.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated adherant
        );
        if (!updatedAdherant) {
            
            return res.status(404).json({ error: 'Adherant not found' });
        }
        res.json(updatedAdherant);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// DELETE an adherant by ID
router.delete('/adherants/:id', async (req, res) => {
    try {
        const deletedAdherant = await Adherants.findByIdAndDelete(req.params.id);
        if (!deletedAdherant) {
            return res.status(404).json({ error: 'Adherant not found' });
        }
        res.json({ message: 'Adherant deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Routes for Beneficaires
// GET all beneficaires
router.get('/beneficaires', async (req, res) => {
    try {
        const beneficaires = await Beneficaires.find();
        res.json(beneficaires);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// GET a specific beneficaires by ID
router.get('/beneficaires/:id', async (req, res) => {
    try {
        const beneficaire = await Beneficaires.findById(req.params.id);
        if (!beneficaire) {
            return res.status(404).json({ error: 'Beneficaire not found' });
        }
        res.json(beneficaire);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// CREATE a new beneficaires
router.post('/beneficaires', async (req, res) => {
    try {
        const beneficaire = await Beneficaires.create(req.body);
        const adherant = await Adherants.findById(beneficaire.Adherant);
        adherant.Benefciaire.push(beneficaire);
        await adherant.save();
        res.json(beneficaire);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE an existing beneficaires by ID
router.put('/beneficaires/:id', async (req, res) => {
    try {
        const updatedBeneficaire = await Beneficaires.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        if (!updatedBeneficaire) {
            return res.status(404).json({ error: 'Beneficaire not found' });
        }
        res.json(updatedBeneficaire);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// DELETE an beneficaires by ID
router.delete('/beneficaires/:id', async (req, res) => {
    try {
        const deletedBeneficaire = await Beneficaires.findByIdAndDelete(req.params.id);
        if (!deletedBeneficaire) {
            return res.status(404).json({ error: 'Beneficaire not found' });
        }
        res.json({ message: 'Beneficaire deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//get all beneficaires of an adherant
router.get('/beneficaires/adherant/:id', async (req, res) => {
    try {
        const beneficaires = await Beneficaires.find({ adherant: req.params.id });
        res.json(beneficaires);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Routes for Consultation
// GET all Consultation
router.get('/consultation', async (req, res) => {
    try {
        const consultation = await Consultation.find();
        res.json(consultation);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// GET a specific Consultation of medecin
router.get('/consultation', async (req, res) => {
    try {
      const { medecin } = req.query;
      const consultations = await Consultation.find({ 'medecin._id': medecin }); // Assuming 'medecin' field stores the entire doctor object
  
      res.json(consultations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// get all consultations of a medecin by his id 
router.get('/consultation/doctor/:doctorId', async (req, res) => {
    try {
      const doctorId = req.params.doctorId;
      
      // Fetch consultations for the specified doctor ID
      const consultations = await Consultation.find({ 'medecin._id': doctorId });
  
      res.status(200).json(consultations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching consultations.' });
    }
  });

// GET a specific Consultation by ID
router.get('/consultation/:id', async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        res.json(consultation);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// CREATE a new consultation
router.post('/consultations', async (req, res) => {
    try {
        const consultation = req.body;
        const dbConsultation = new Consultation({
            medecin: await User.findById(consultation.medecin),
            date: consultation.date,
            adherant: await Adherants.findById(consultation.adherant),
            beneficiaire: await Beneficaires.findById(consultation.beneficiaire),
            diagnostic: consultation.diagnostic,
        });
        if (dbConsultation.medecin === null) {
            return res.status(404).json({ error: 'Medecin not found' });
        }
        if (dbConsultation.adherant === null) {
            return res.status(404).json({ error: 'Adherant not found' });
        }
        if (dbConsultation.beneficiaire === null) {
            return res.status(404).json({ error: 'Beneficiaire not found' });
        }
        const savedConsultation = await dbConsultation.save();
        res.json(savedConsultation);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE an existing Consultation by ID
router.put('/consultation/:id', async (req, res) => {
    try {
        const { medecin,adherant,beneficaire, ...updatedData } = req.body;

        const updatedConsultation = await Consultation.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true } 
        );

        if (!updatedConsultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        res.json(updatedConsultation);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// DELETE an Consultation by ID
router.delete('/consultation/:id', async (req, res) => {
    try {
        const deletedConsultation = await Consultation.findByIdAndDelete(req.params.id);
        if (!deletedConsultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        res.json({ message: 'Consultation deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//get all consultations of an adherant
router.get('/consultation/adherant/:id', async (req, res) => {
    try {
        const consultation = await Consultation.find({ adherant: req.params.id });
        res.json(consultation);
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//get all consultations of a beneficiaire
router.get('/consultation/beneficiaire/:id', async (req, res) => {
    try {
        const consultation = await Consultation.find({ beneficiaire: req.params.id });
        res.json(consultation);
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// get all consultations of a medecin
router.get('/consultation/medecin/:id', async (req, res) => {
    try {
        const consultation = await Consultation.find({ medecin: req.params.id });
        res.json(consultation);
    } catch (err) {
        console.log(err);
    }
}
);

//get all consultations by date
router.get('/consultation/date/:date', async (req, res) => {
    try {
        const consultation = await Consultation.find({ date: req.params.date });
        res.json(consultation);
    } catch (err) {
        console.log(err);
    }
}
);


//Routes for Medicaments
// GET all Medicaments
router.get('/medicaments', async (req, res) => {
    try {
        const medicaments = await Medicament.find();
        res.json(medicaments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// GET a specific Medicaments by ID
router.get('/medicaments/:id', async (req, res) => {
    try {
        const medicaments = await Medicament.findById(req.params.id);
        if (!medicaments) {
            return res.status(404).json({ error: 'Medicaments not found' });
        }
        res.json(medicaments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// CREATE a new Medicaments
router.post('/medicaments', async (req, res) => {
    try {
        const medicaments = await Medicament.create(req.body);
        res.json(medicaments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// UPDATE an existing Medicaments by ID
router.put('/medicaments/:id', async (req, res) => {
    try {
        const updatedMedicaments = await Medicament.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated medicaments
        );
        if (!updatedMedicaments) {
            return res.status(404).json({ error: 'Medicaments not found' });
        }
        res.json(updatedMedicaments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// DELETE an Medicaments by ID
router.delete('/medicaments/:id', async (req, res) => {
    try {
        const deletedMedicaments = await Medicament.findByIdAndDelete(req.params.id);
        if (!deletedMedicaments) {
            return res.status(404).json({ error: 'Medicaments not found' });
        }
        res.json({ message: 'Medicaments deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//find medicament by nom
router.get('/medicaments/nom/:nom', async (req, res) => {
    try {
        const medicaments = await Medicament.find({ nom: req.params.nom });
        res.json(medicaments);
    } catch (err) {
        console.log(err);
    }
}
);

//find medicament by forme
router.get('/medicaments/forme/:forme', async (req, res) => {
    try {
        const medicaments = await Medicament.find({ forme: req.params.forme });
        res.json(medicaments);
    } catch (err) {
        console.log(err);
    }
}
);


//Routes for Ordonnance
// GET all Ordonnance
router.get('/ordonnance', async (req, res) => {
    try {
        const ordonnance = await Ordonnance.find();
        res.json(ordonnance);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// GET a specific Ordonnance by ID
router.get('/ordonnance/:id', async (req, res) => {
    try {
        const ordonnance = await Ordonnance.findById(req.params.id);
        if (!ordonnance) {
            return res.status(404).json({ error: 'Ordonnance not found' });
        }
        res.json(ordonnance);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);
// CREATE a new Ordonnance with assigning the consultation to it
router.post('/ordonnance', async (req, res) => {
    try {
        const ordonnanceData = req.body;
        const ordonnance = new Ordonnance({
            consultation: ordonnanceData.consultation,
            commentaire: ordonnanceData.commentaire,
            duree: ordonnanceData.duree,
        });
        for (const medicamentData of ordonnanceData.medicaments) {
            const medicament = new Medicament(medicamentData);
            await medicament.save();
            ordonnance.medicaments.push(medicament);
        }
        await ordonnance.save();
        res.json(ordonnance);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// UPDATE an existing Ordonnance by ID
// Update an existing Ordonnance
router.put('/ordonnance/:id', async (req, res) => {
    try {
      const ordonnanceId = req.params.id;
      const updatedOrdonnanceData = req.body;
  
      const existingOrdonnance = await Ordonnance.findById(ordonnanceId);
  
      if (!existingOrdonnance) {
        return res.status(404).json({ error: 'Ordonnance not found' });
      }
  
      // Update fields of the existing ordonnance
      existingOrdonnance.consultation = updatedOrdonnanceData.consultation;
      existingOrdonnance.commentaire = updatedOrdonnanceData.commentaire;
      existingOrdonnance.duree = updatedOrdonnanceData.duree;

      for (const medicamentData of updatedOrdonnanceData.medicaments) {
        if (medicamentData._id) {
          // Update existing medicament
          const existingMedicament = await Medicament.findById(medicamentData._id);
          if (existingMedicament) {
            existingMedicament.name = medicamentData.name;
            existingMedicament.description = medicamentData.description;
            existingMedicament.prix = medicamentData.prix;
            existingMedicament.forme = medicamentData.forme;
            await existingMedicament.save();
            existingOrdonnance.medicaments.push(existingMedicament);
          }
        } else {
          // Create new medicament
          const newMedicament = new Medicament(medicamentData);
          await newMedicament.save();
          existingOrdonnance.medicaments.push(newMedicament);
        }
      }
  
      await existingOrdonnance.save();
  
      res.json(existingOrdonnance);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// DELETE an Ordonnance by ID
router.delete('/ordonnance/:id', async (req, res) => {
    try {
        const deletedOrdonnance = await Ordonnance.findByIdAndDelete(req.params.id);
        if (!deletedOrdonnance) {
            return res.status(404).json({ error: 'Ordonnance not found' });
        }
        res.json({ message: 'Ordonnance deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//find ordonnance by adherant of its consultation
router.get('/ordonnance/adherant/:id', async (req, res) => {
    try {
        const adherantId = req.params.id;

        // Find consultations for the given adherant
        const consultations = await Consultation.find({ adherant: adherantId });

        if (consultations.length === 0) {
            return res.status(404).json({ error: 'No consultations found for the provided adherant' });
        }

        // Extract ordonnance from consultations
        const ordonnances = consultations.map(consultation => consultation.ordonnance);

        // If ordonnances were found, send them in the response
        res.json(ordonnances);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//find ordonnence by beneficiare of its consultation
// Find ordonnance by beneficiare of its consultation
router.get('/ordonnance/beneficiare/:id', async (req, res) => {
    try {
        const beneficiareId = req.params.id;

        // Find consultations for the given beneficiare
        const consultations = await Consultation.find({ beneficiare: beneficiareId });

        if (consultations.length === 0) {
            return res.status(404).json({ error: 'No consultations found for the provided beneficiare' });
        }

        // Extract ordonnance from consultations
        const ordonnances = consultations.map(consultation => consultation.ordonnance);

        // If ordonnances were found, send them in the response
        res.json(ordonnances);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get medicaments of an ordonnance

router.get('/ordonnance/medicaments/:id', async (req, res) => {
    try {
        const ordonnance = await Ordonnance.findById(req.params.id);
        if (!ordonnance) {
            return res.status(404).json({ error: 'Ordonnance not found' });
        }
        res.json(ordonnance.medicaments);
    } catch (err) {
        console.log(err);
    }
}
);


//Routes for Dossier
// GET all Dossier
router.get('/dossier', async (req, res) => {
    try {
        const dossier = await Dossier.find();
        res.json(dossier);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// GET a specific Dossier by ID
router.get('/dossier/:id', async (req, res) => {
    try {
        const dossier = await Dossier.findById(req.params.id);
        if (!dossier) {
            return res.status(404).json({ error: 'Dossier not found' });
        }
        res.json(dossier);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);
// CREATE a new Dossier with assigning the consultation to it
router.post('/dossier', async (req, res) => {
    try {
        const dossier = req.body;
        const dbDossier = new Dossier({
            stats: dossier.stats,
            numPoloice: dossier.numPoloice,
            pathologie: dossier.pathologie,
            consultation: dossier.consultation,
        });

        const savedDossier = await dbDossier.save();
        res.json(savedDossier);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);


// UPDATE an existing Dossier by ID
router.put('/dossier/:id', async (req, res) => {
    try {
        // Remove the consultation field from req.body
        const { consultation, ...updatedDossierData } = req.body;

        const updatedDossier = await Dossier.findByIdAndUpdate(
            req.params.id,
            updatedDossierData, // Pass the updatedDossierData without the consultation field
            { new: true } // Return the updated dossier
        );
        
        if (!updatedDossier) {
            return res.status(404).json({ error: 'Dossier not found' });
        }
        
        res.json(updatedDossier);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE an Dossier by ID
router.delete('/dossier/:id', async (req, res) => {
    try {
        const deletedDossier = await Dossier.findByIdAndDelete(req.params.id);
        if (!deletedDossier) {
            return res.status(404).json({ error: 'Dossier not found' });
        }
        res.json({ message: 'Dossier deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);


module.exports = router;
