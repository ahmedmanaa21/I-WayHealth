import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button, Grid , TextField } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import Iconify from '../components/iconify';
import img from "../utils/dossier.png";

export default function DossierPage() {
  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');



  const handleNewDossier = async () => {
    Swal.fire({
      title: 'New Dossier',
      html: `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; align-items: center;">
        <label for="stats" style="margin-right: 10px; width: 100px;">Stats:</label>
        <input type="text" id="stats" class="swal2-input" />
      </div>
      <div style="display: flex; align-items: center;">
        <label for="numPoloice" style="margin-right: 10px; width: 100px;">Num Police:</label>
        <input type="number" id="numPoloice" class="swal2-input" />
      </div>
      <div style="display: flex; align-items: center;">
        <label for="pathologie" style="margin-right: 10px; width: 100px;">Pathologie:</label>
        <select id="pathologie" class="swal2-select">
          <option value="Cancer">Cancer</option>
          <option value="HeartDisease">Heart Disease</option>
          <option value="ChronicDisease">Chronic Disease</option>
          <option value="RespiratoryDisease">Respiratory Disease</option>
        </select>
      </div>
      <select id="consultation" class="swal2-select">
      ${consultations.map((consultation) => {
        const formattedDate = new Date(consultation.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return `
          <option key="${consultation._id}" value="${consultation._id}">
           Consultation: ${consultation.medecin.firstname} ${consultation.medecin.lastname} - ${formattedDate}
          </option>
        `;
      }).join('')}
    </select>
  </div>
  `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      focusConfirm: false,
      preConfirm: () => {
        return {
          stats: document.querySelector('#stats').value,
          numPoloice: parseInt(document.querySelector('#numPoloice').value, 10),
          pathologie: document.querySelector('#pathologie').value,
          consultation: document.querySelector('#consultation').value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newDossierData = { ...result.value };
        try {
          const response = await axios.post('http://localhost:3000/api/dossier', newDossierData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.data) {
            setDossiers([...dossiers, response.data]);
            Swal.fire({
              title: 'Success',
              text: 'New dossier has been added',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to add new dossier',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while adding the dossier',
            icon: 'error',
          });
        }
      }
    });
  };

  const handleUpdateDossier = (dossier) => {
    setSelectedDossier(dossier);
    Swal.fire({
      title: 'Update Dossier',
      html: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; align-items: center;">
        <label for="stats" style="margin-right: 10px; width: 100px;">Stats:</label>
        <input type="text" id="stats" class="swal2-input" value="${dossier.stats}" />
      </div>
      <div style="display: flex; align-items: center;">
        <label for="numPoloice" style="margin-right: 10px; width: 100px;">Num Police:</label>
        <input type="number" id="numPoloice" class="swal2-input" value="${dossier.numPoloice}" />
      </div>
      <div style="display: flex; align-items: center;">
        <label for="pathologie" style="margin-right: 10px; width: 100px;">Pathologie:</label>
        <select id="pathologie" class="swal2-select">
          <option value="Cancer" ${dossier.pathologie === 'Cancer' ? 'selected' : ''}>Cancer</option>
          <option value="HeartDisease" ${dossier.pathologie === 'HeartDisease' ? 'selected' : ''}>Heart Disease</option>
          <option value="ChronicDisease" ${dossier.pathologie === 'ChronicDisease' ? 'selected' : ''}>Chronic Disease</option>
          <option value="RespiratoryDisease" ${dossier.pathologie === 'RespiratoryDisease' ? 'selected' : ''}>Respiratory Disease</option>
        </select>
      </div>
    </div>    
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      focusConfirm: false,
      preConfirm: () => {
        return {
          stats: document.querySelector('#stats').value,
          numPoloice: parseInt(document.querySelector('#numPoloice').value, 10),
          pathologie: document.querySelector('#pathologie').value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedDossierData = { ...result.value };
        try {
          const response = await axios.put(`http://localhost:3000/api/dossier/${dossier._id}`, updatedDossierData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.data) {
            const updatedDossiers = dossiers.map((d) => (d._id === dossier._id ? response.data : d));
            setDossiers(updatedDossiers);
            Swal.fire({
              title: 'Success',
              text: 'Dossier has been updated',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to update dossier',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while updating the dossier',
            icon: 'error',
          });
        }
      }
      setSelectedDossier(null);
    });
  };

  const handleDeleteDossier = async (id) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this dossier?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3000/api/dossier/${id}`);
          if (response.status === 200) {
            setDossiers(dossiers.filter((dossier) => dossier._id !== id));
            Swal.fire({
              title: 'Success',
              text: 'Dossier has been deleted',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete dossier',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while deleting the dossier',
            icon: 'error',
          });
        }
      }
    });
  };
  

  useEffect(() => {
    async function fetchDossiers() {
      try {
        const response = await axios.get('http://localhost:3000/api/dossier');
        if (response.data) {
          setDossiers(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchDossiers();
  }, []);

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const response = await axios.get('http://localhost:3000/api/consultation'); // Adjust the endpoint
        if (response.data) {
          setConsultations(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchConsultations();
  }, []);


  const filteredDossiers = dossiers.filter((dossier) => {
    const numMatch = dossier.numPoloice.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const pathologieMatch = dossier.pathologie.toLowerCase().includes(searchQuery.toLowerCase());
    return numMatch || pathologieMatch;
  });

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Dossiers | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reimbursment Files
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewDossier}>
            New Dossier
          </Button>
        </Stack>

        <Stack  alignItems="center" mb={5} sx={{ px: 5 }}>
          <TextField
            label="Search by Police N°"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </Stack>

        <Grid container spacing={3}>
          {filteredDossiers.map((dossier) => (
            <Grid item xs={12} sm={6} md={4} key={dossier._id}>
              <div style={{ border: '1px solid #ccc', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={img}
                  alt="Dossier"
                  style={{ maxWidth: '50%', height: 'auto' }}
                />
                <Typography variant="h6">File Information</Typography>
                <Typography variant="body2">Stats: {dossier.stats}</Typography>
                <Typography variant="body2">Num Police: {dossier.numPoloice}</Typography>
                <Typography variant="body2">Pathology: {dossier.pathologie}</Typography>
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="contained" onClick={() => handleDeleteDossier(dossier._id)}>Delete</Button>
                  <Button variant="contained" onClick={() => handleUpdateDossier(dossier)}>Update</Button>
                </Stack>
              </div>
            </Grid>
          ))}
        </Grid>


      </Container>
    </>
  );
}
