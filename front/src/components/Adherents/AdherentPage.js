import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AdherentDetails from './AdherentsInformation'; // Assurez-vous d'importer correctement votre composant AdherentDetails

const AdherentDetaisPage = () => {
    const { AdherentID } = useParams(); // Récupère le paramètre AdherentID de la route



    return (
        <div>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            </style>
            <h1 style={{ color: 'black', fontFamily: 'Bebas Neue, sans-serif' }}>Détails de l'Adhérent</h1>
            <AdherentDetails AdherentID={AdherentID} />
        </div>
    );
};

export default AdherentDetaisPage;
