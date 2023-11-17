import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Importez les styles si nécessaire
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { useParams } from 'react-router-dom';


import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Button,
    Box,
} from '@mui/material';
import { updateAdherent } from '../../AdherentSlice';
import { setOneAdherent } from '../../ActionAdherent';

import Label from '../label/Label';


export const EditAdherent = ({ AdherentID }) => {
    // Récupère le paramètre AdherentID de la route


    useEffect(() => {
        dispatch(setOneAdherent(AdherentID));
    }, []);






    const dispatch = useDispatch();
    const adherent = useSelector((state) => state.OneAdherant)


    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const updatedAdherent = {
            ...adherent,
            [name]: type === 'checkbox' ? checked : value,
        };

        dispatch(updateAdherent(updatedAdherent));
    };

    const handleBeneficiaireChange = (index, field, value) => {
        const Update = JSON.parse(JSON.stringify(adherent));
        const updatedBeneficiaires = JSON.parse(JSON.stringify(adherent.Benefciaire));
        updatedBeneficiaires[index][field] = value;
        Update.Benefciaire = updatedBeneficiaires
        dispatch(updateAdherent(Update));

    };

    const handleAddBeneficiaire = () => {
        const Update = JSON.parse(JSON.stringify(adherent));
        Update.Benefciaire.push({ nom: '', prenom: '', sexe: '', situation_familiale: '' });
        dispatch(updateAdherent(Update));

    };

    const handleRemoveBeneficiaire = (index) => {
        const Update = JSON.parse(JSON.stringify(adherent));
        const updatedBeneficiaires = JSON.parse(JSON.stringify(adherent.Benefciaire));
        const list = updatedBeneficiaires.filter((_, i) => i !== index);
        Update.Benefciaire = list
        dispatch(updateAdherent(Update));
    };


    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont 0-indexés, donc +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const updateData = async (id, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/adherants/${id}`, updatedData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            dispatch(updateAdherent(response.data));
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données :', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        Swal.fire({
            title: 'Voulez-vous ajouter cet adherent ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, Ajouter',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                updateData(adherent._id, adherent)
                Swal.fire('Adherent Ajouté !', '', 'success');
            }
        });

    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        const updatedAdherent = {
            ...adherent,
            image: file
        };
        console.log(adherent)
        dispatch(updateAdherent(updatedAdherent));

    };

    return (

        <form onSubmit={handleSubmit}>
            <TextField label="Nom" name="nom" value={adherent.nom} onChange={handleInputChange} required fullWidth margin="normal" />
            <TextField label="Prénom" name="prenom" value={adherent.prenom} onChange={handleInputChange} required fullWidth margin="normal" />
            <TextField label="Email" name="email" type="email" value={adherent.email} onChange={handleInputChange} required fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
                <InputLabel>Situation Familiale</InputLabel>
                <Select name="situation_familiale" value={adherent.situation_familiale} onChange={handleInputChange} required>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Sivorced">Divorced</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
            </FormControl>
            <br /><Label style={{ marginTop: '20px' }}> Date de naissance</Label>

            <TextField
                name="date_naissance"
                type="date"
                value={formatDate(new Date(adherent.date_naissance))}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
            />
            <FormControlLabel label="vip" control={<Checkbox name="vip" checked={adherent.vip} onChange={handleInputChange} />} />
            <br /><Label style={{ marginTop: '20px' }}> Adherent Image</Label>
            <TextField
                name="image"
                type="file"
                onChange={handleImageChange}
                fullWidth
                margin="normal"
            />


            <br /><Label style={{ marginTop: '20px' }}> Date D'adhesion</Label>
            <TextField
                name="date_adhesion"
                type="date"
                value={formatDate(new Date(adherent.date_adhesion))}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />

            <FormControlLabel label="Couple" control={<Checkbox name="couple" checked={adherent.couple} onChange={handleInputChange} />} />
            <FormControlLabel label="APCI" control={<Checkbox name="apci" checked={adherent.apci} onChange={handleInputChange} />} />
            <FormControl fullWidth margin="normal">
                <InputLabel>Situation d'Adhésion</InputLabel>
                <Select name="situation_adhesion" value={adherent.situation_adhesion} onChange={handleInputChange} required>
                    <MenuItem value="Waiting">Waiting</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Refused">Refused</MenuItem>
                </Select>
            </FormControl>
            {adherent.Benefciaire.map((beneficiaire, index) => (
                <Box key={index} border="1px solid #ccc" p={2} mt={2}>
                    <Label style={{ marginTop: '10px', marginBottom: '10px' }}>Ajout d'un bénéficiaire</Label>
                    <TextField
                        label="Nom du bénéficiaire"
                        value={beneficiaire.nom}
                        onChange={(e) => handleBeneficiaireChange(index, 'nom', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Prénom du bénéficiaire"
                        value={beneficiaire.prenom}
                        onChange={(e) => handleBeneficiaireChange(index, 'prenom', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="date_naissance"
                        type="date"
                        value={formatDate(new Date(beneficiaire.date_naissance))}
                        onChange={(e) => handleBeneficiaireChange(index, 'date_naissance', e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Sexe</InputLabel>
                        <Select
                            value={beneficiaire.sexe}
                            onChange={(e) => handleBeneficiaireChange(index, 'sexe', e.target.value)}
                            required
                        >
                            <MenuItem value="Masculin">Masculin</MenuItem>
                            <MenuItem value="Feminine">Féminin</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Situation Familiale</InputLabel>
                        <Select
                            value={beneficiaire.situation_familiale}
                            onChange={(e) => handleBeneficiaireChange(index, 'situation_familiale', e.target.value)}
                            required
                        >
                            <MenuItem value="Wife">Wife</MenuItem>
                            <MenuItem value="Child">Child</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemoveBeneficiaire(index)}
                        style={{ marginTop: '20px' }}
                    >
                        Supprimer
                    </Button>
                </Box>
            ))}
            <Button type="button" variant="contained" color="primary" onClick={handleAddBeneficiaire} style={{ marginTop: '30px', marginRight: '20px' }}>
                Ajouter un bénéficiaire
            </Button>
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '30px' }}>
                Soumettre
            </Button>
        </form>
    );
};

