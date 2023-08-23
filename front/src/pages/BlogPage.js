import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button, Grid, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import Iconify from '../components/iconify';
import img from "../utils/medicaments.jpg";

export default function MedicamentsPage() {
  const [medicaments, setMedicaments] = useState([]);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const medicationFormsTranslation = {
    Comprime: "Tablet",
    Gelule: "Capsule",
    Sirop: "Syrup",
    Pommade: "Ointment",
    Goutte: "Drop",
    Suppositoire: "Suppository",
    Spray: "Spray",
    Patch: "Patch",
    Autre: "Other",
  };

  const handleNewMedicament = async () => {
    Swal.fire({
      title: 'New Medicament',
      html: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; align-items: center;">
          <label for="nom" style="margin-right: 10px; width: 100px;">Name:</label>
          <input type="text" id="nom" class="swal2-input" />
        </div>
        <div style="display: flex; align-items: center;">
          <label for="description" style="margin-right: 10px; width: 100px;">Description:</label>
          <input type="text" id="description" class="swal2-input" />
        </div>
        <div style="display: flex; align-items: center;">
          <label for="prix" style="margin-right: 10px; width: 100px;">Price:</label>
          <input type="number" id="prix" class="swal2-input" />
        </div>
        <div style="display: flex; align-items: center;">
          <label for="forme" style="margin-right: 10px; width: 100px;">Form:</label>
          <select id="forme" class="swal2-select">
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Ointment">Ointment</option>
            <option value="Drop">Drop</option>
            <option value="Suppository">Suppository</option>
            <option value="Spray">Spray</option>
            <option value="Patch">Patch</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    `,


      showCancelButton: true,
      confirmButtonText: 'Submit',
      focusConfirm: false,
      customClass: {
        container: 'my-swal-container',
      },
      preConfirm: () => {
        return {
          nom: document.querySelector('#nom').value,
          description: document.querySelector('#description').value,
          prix: parseFloat(document.querySelector('#prix').value),
          forme: document.querySelector('#forme').value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newMedicament = { ...result.value };
        try {
          const response = await axios.post('http://localhost:3000/api/medicaments', newMedicament, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.data) {
            setMedicaments([...medicaments, response.data]);
            Swal.fire({
              title: 'Success',
              text: 'New medicament has been added',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to add new medicament',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while adding the medicament',
            icon: 'error',
          });
        }
      }
    });
  };

  const handleUpdateMedicament = (medicament) => {
    setSelectedMedicament(medicament);
    Swal.fire({
      title: 'Update Medicament',
      html: `
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; align-items: center;">
      <label for="nom" style="margin-right: 10px; width: 100px;">Name:</label>
      <input type="text" id="nom" class="swal2-input" value="${medicament.nom}" />
    </div>
    <div style="display: flex; align-items: center;">
      <label for="description" style="margin-right: 10px; width: 100px;">Description:</label>
      <input type="text" id="description" class="swal2-input" value="${medicament.description}" />
    </div>
    <div style="display: flex; align-items: center;">
      <label for="prix" style="margin-right: 10px; width: 100px;">Price:</label>
      <input type="number" id="prix" class="swal2-input" value="${medicament.prix}" />
    </div>
    <div style="display: flex; align-items: center;">
      <label for="forme" style="margin-right: 10px; width: 100px;">Form:</label>
      <select id="forme" class="swal2-select">
        ${Object.keys(medicationFormsTranslation).map((form) => `
          <option key="${form}" value="${form}" ${form === medicament.forme ? 'selected' : ''}>
            ${medicationFormsTranslation[form]}
          </option>
        `)}
      </select>
    </div>
  </div>
`,
      showCancelButton: true,
      confirmButtonText: 'Update',
      focusConfirm: false,
      customClass: {
        popup: 'my-swal-popup',
      },
      preConfirm: () => {
        return {
          nom: document.querySelector('#nom').value,
          description: document.querySelector('#description').value,
          prix: parseFloat(document.querySelector('#prix').value),
          forme: document.querySelector('#forme').value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedMedicament = { ...result.value };
        try {
          const response = await axios.put(`http://localhost:3000/api/medicaments/${medicament._id}`, updatedMedicament, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.data) {
            const updatedMedicaments = medicaments.map((m) => (m._id === medicament._id ? response.data : m));
            setMedicaments(updatedMedicaments);
            Swal.fire({
              title: 'Success',
              text: 'Medicament has been updated',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to update medicament',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while updating the medicament',
            icon: 'error',
          });
        }
      }
      setSelectedMedicament(null);
    });
  };


  const handleDeleteMedicament = async (id) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this medicament?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3000/api/medicaments/${id}`);
          if (response.data) {
            setMedicaments(medicaments.filter(medicament => medicament._id !== id));
            Swal.fire({
              title: 'Success',
              text: 'Medicament has been deleted',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete medicament',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while deleting the medicament',
            icon: 'error',
          });
        }
      }
    });
  };

  useEffect(() => {
    async function fetchMedicaments() {
      try {
        const response = await axios.get('http://localhost:3000/api/medicaments'); // Adjust the endpoint
        if (response.data) {
          setMedicaments(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMedicaments();
  }, []); // The empty dependency array ensures the effect runs only once

  return (
    <>
      <Helmet>
        <title> Dashboard: Medicaments | Minimal UI </title>

      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Medicaments
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewMedicament}>
            New Medicament
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {medicaments.map((medicament) => (
            <Grid item xs={12} sm={6} md={4} key={medicament._id}>
              <div style={{ border: '1px solid #ccc', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={img}
                  alt="Medicament"
                  style={{ maxWidth: '50%', height: 'auto' }}
                />
                <Typography variant="h6">{medicament.nom}</Typography>
                <Typography variant="body2">{medicament.description}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Prix: {medicament.prix}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Forme: {medicament.forme}
                </Typography>
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="contained" onClick={() => handleDeleteMedicament(medicament._id)}>Delete</Button>
                  <Button variant="contained" onClick={() => handleUpdateMedicament(medicament)}>Update</Button>
                </Stack>
              </div>
            </Grid>
          ))}
        </Grid>




      </Container>
    </>
  );
}

