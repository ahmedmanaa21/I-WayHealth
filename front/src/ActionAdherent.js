import axios from 'axios';
import { addAdherent, deleteAdherent, initializeAdheretns, SetAdherent } from './AdherentSlice';



export const fetchAdherents = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:3000/api/adherants'); // Remplacez l'URL par votre endpoint GET
            dispatch(initializeAdheretns(response.data)); // Mettez à jour l'état initial avec les données de la requête GET
        } catch (error) {
            console.error(error);
        }
    };
};

export const AddAdherent = (Data) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('http://localhost:3000/api/adherants', Data); // Remplacez 'URL_DE_VOTRE_API' par l'URL appropriée
            dispatch(addAdherent(Data)); // Mettez à jour l'état initial avec les données de la requête GET

        } catch (error) {
            console.error(error);
        }
    };
};

export const removeAdherent = (adherentId) => {
    return async (dispatch) => {
        try {
            // Effectuer la requête DELETE vers votre API avec l'ID de l'adhérent à supprimer
            await axios.delete(`http://localhost:3000/api/adherants/${adherentId}`);
            // Si la requête réussit, dispatchez l'action pour supprimer l'adhérent de l'état
            dispatch(deleteAdherent(adherentId));
        } catch (error) {
            console.error(error);
        }
    };
};


export const setOneAdherent = (adherentId) => {
    return async (dispatch) => {
        axios.get(`http://localhost:3000/api/adherants/${adherentId}`)
            .then((response) => {
                dispatch(SetAdherent(response.data));
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des données de l\'adhérent : ', error);
            });
    };
};