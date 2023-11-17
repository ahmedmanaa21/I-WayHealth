import React, { useState } from 'react';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Importez les styles si nécessaire

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
import { AddAdherent } from '../../ActionAdherent';


import Label from '../label/Label';


export const Form3 = () => {

    const dispatch = useDispatch();
    const Adherents = useSelector((state) => state.adherent)

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        situation_familiale: '',
        date_naissance: '',
        vip: false,
        date_adhesion: '',
        couple: false,
        apci: false,
        situation_adhesion: '',
        Benefciaire: [],
    });

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    };

    const handleBeneficiaireChange = (index, field, value) => {
        const updatedBeneficiaires = [...formData.Benefciaire];
        updatedBeneficiaires[index][field] = value;
        setFormData((prevData) => ({ ...prevData, Benefciaire: updatedBeneficiaires }));
    };

    const handleAddBeneficiaire = () => {
        setFormData((prevData) => ({
            ...prevData,
            Benefciaire: [...prevData.Benefciaire, { nom: '', prenom: '', sexe: '', situation_familiale: '' }],
        }));
    };

    const handleRemoveBeneficiaire = (index) => {
        const updatedBeneficiaires = formData.Benefciaire.filter((_, i) => i !== index);
        setFormData((prevData) => ({ ...prevData, Benefciaire: updatedBeneficiaires }));
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
                console.log(formData)
                dispatch(AddAdherent(formData))

                setFormData({
                    nom: '',
                    image: '',
                    prenom: '',
                    email: '',
                    situation_familiale: '',
                    date_naissance: '',
                    vip: false,
                    date_adhesion: '',
                    couple: false,
                    apci: false,
                    situation_adhesion: '',
                    Benefciaire: [],
                });
                Swal.fire('Adherent Ajouté !', '', 'success');
            }
        });






    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFormData((prevData) => ({ ...prevData, image: file }));
        console.log(formData)
    };
    return (
        <form onSubmit={handleSubmit}>
            <TextField label="Nom" name="nom" value={formData.nom} onChange={handleInputChange} required fullWidth margin="normal" />
            <TextField label="Prénom" name="prenom" value={formData.prenom} onChange={handleInputChange} required fullWidth margin="normal" />
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
                <InputLabel>Situation Familiale</InputLabel>
                <Select name="situation_familiale" value={formData.situation_familiale} onChange={handleInputChange} required>
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
                value={formData.date_naissance}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
            />
            <br /><Label style={{ marginTop: '20px' }}> Date D'adhesion</Label>
            <TextField
                name="date_adhesion"
                type="date"
                value={formData.date_adhesion}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />


            <FormControlLabel label="vip" control={<Checkbox name="vip" checked={formData.vip} onChange={handleInputChange} />} />
            <br /><Label style={{ marginTop: '20px' }}> Adherent Image</Label>
            <TextField
                name="image"
                type="file"
                onChange={handleImageChange}
                fullWidth
                margin="normal"
            />

            <FormControlLabel label="Couple" control={<Checkbox name="couple" checked={formData.couple} onChange={handleInputChange} />} />
            <FormControlLabel label="APCI" control={<Checkbox name="apci" checked={formData.apci} onChange={handleInputChange} />} />
            <FormControl fullWidth margin="normal">
                <InputLabel>Situation d'Adhésion</InputLabel>
                <Select name="situation_adhesion" value={formData.situation_adhesion} onChange={handleInputChange} required>
                    <MenuItem value="Waiting">Waiting</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Refused">Refused</MenuItem>
                </Select>
            </FormControl>
            {formData.Benefciaire.map((beneficiaire, index) => (
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
                        value={beneficiaire.date_naissance}
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

