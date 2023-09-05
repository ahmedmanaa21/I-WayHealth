import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { parse } from 'date-fns';
import { Card, CardContent, Container, Stack, Typography, Button, Grid, Box, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import Iconify from '../components/iconify';
import img from "../utils/consultation.jpg";
import { useAuthStore } from "../utils/zustand";

export default function ConsultationPage() {
  const [consultations, setConsultations] = useState([]);
  const token = localStorage.getItem("token");
  const userr = JSON.parse(localStorage.getItem("user"));
  const user = useAuthStore((state) => state.user);
  const currentDate = new Date().toISOString().substr(0, 10);
  const [search, setSearch] = useState("");
  const [adherantResponse, setAdherantResponse] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctorConsultations, setDoctorConsultations] = useState([]);
  const [showDoctorConsultations, setShowDoctorConsultations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDoctor, setSearchQueryDoctor] = useState('');


  const images = require.context('../utils/profilePictures/', true, /\.(png|jpe?g|gif|svg)$/);
  const cardStyles = {
    marginBottom: '16px',
    marginTop: '16px',
  };

  const handleNewConsultation = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user/find/role/medecin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const medecins = response.data;

      const responseAdherants = await axios.get('http://localhost:3000/api/adherants')
      const adherants = responseAdherants.data;

      let medecinSelect = '';
      if (userr.role === 'medecin') {
        // If the user is a medecin, display their ID
        medecinSelect = `
        <label for="medecin" style="margin-right: 10px; width: 100px;">${userr.firstname} ${userr.lastname}</label>
          <input
            type="text"
            id="medecin"
            class="swal2-input"
            value="${userr._id}"
            disabled

            hidden
          />
        `;
      } else {
        // If the user is not a medecin, show the dropdown
        medecinSelect = `
          <select id="medecin" class="swal2-select">
            ${medecins.map((medecin) => `
              <option value="${medecin._id}">${medecin.firstname} ${medecin.lastname}</option>
            `).join('')}
          </select>
        `;
      }

      Swal.fire({
        title: 'New Consultation',
        html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center;">
            <label for="medecin" style="margin-right: 10px; width: 100px;">Medecin:</label>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${medecinSelect}
            </div>
          </div>
          <div style="display: flex; align-items: center;">
          <label for="date" style="margin-right: 10px; width: 100px;">Date:</label>
          <input type="date" id="date" class="swal2-input" value="${currentDate}" />
        </div>
          <div style="display: flex; align-items: center;">
            <label for="adherant" style="margin-right: 10px; width: 100px;">Adherant:</label>
            <select id="adherant" class="swal2-select">
              ${adherants.map((adherant) => `
                <option value="${adherant._id}">${adherant.nom} ${adherant.prenom}</option>
              `).join('')}
            </select>
          </div>
          <div style="display: flex; align-items: center;">
            <label for="beneficiaire" style="margin-right: 10px; width: 100px;">Beneficiaire:</label>
            <select id="beneficiaire" class="swal2-select">
            </select>
          </div>
          <div style="display: flex; align-items: center;">
            <label for="diagnostic" style="margin-right: 10px; width: 100px;">Diagnostic:</label>
            <input type="text" id="diagnostic" class="swal2-input" />
          </div>
        </div>
      `,
        didOpen: () => {
          const adherantSelect = document.querySelector('#adherant');
          const beneficiaireSelect = document.querySelector('#beneficiaire');

          adherantSelect.addEventListener('change', () => {
            const selectedAdherantId = adherantSelect.value;
            const selectedAdherant = adherants.find(adherant => adherant._id === selectedAdherantId);
            beneficiaireSelect.innerHTML = selectedAdherant.Benefciaire.map(beneficiaire => `
            <option value="${beneficiaire._id}">${beneficiaire.nom} ${beneficiaire.prenom}</option>
          `).join('');
          });
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        focusConfirm: false,
        preConfirm: () => {
          return {
            medecin: parseInt(document.querySelector('#medecin').value, 10),
            date: document.querySelector('#date').value,
            adherant: document.querySelector('#adherant').value,
            beneficiaire: document.querySelector('#beneficiaire').value,
            diagnostic: document.querySelector('#diagnostic').value,
          };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const newConsultationData = { ...result.value };
          try {
            const response = await axios.post('http://localhost:3000/api/consultations', newConsultationData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.data) {
              setConsultations([...consultations, response.data]);
              Swal.fire({
                title: 'Success',
                text: 'New consultation has been added',
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Failed to add new consultation',
                icon: 'error',
              });
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: 'Error',
              text: 'Consultation already exists',
              icon: 'error',
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while fetching medecins',
        icon: 'error',
      });
    }
  };



  const handleUpdateConsultation = async (consultation) => {
    try {
      const response = await axios.get('http://localhost:3000/user/find/role/medecin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const medecins = response.data;

      let medecinSelect = '';
      if (userr.role === 'medecin') {
        // If the user is a medecin, display their ID
        medecinSelect = `
        <label for="medecin" style="margin-right: 10px; width: 100px;">${userr.firstname} ${userr.lastname}</label>
          <input
            type="text"
            id="medecin"
            class="swal2-input"
            value="${userr._id}"
            disabled

            hidden
          />
          
        `;
      } else {
        // If the user is not a medecin, show the dropdown
        medecinSelect = `
          <select id="medecin" class="swal2-select">
            ${medecins.map((medecin) => `
              <option value="${medecin._id}" ${medecin._id === consultation.medecin._id ? 'selected' : ''}>
                ${medecin.firstname} ${medecin.lastname}
              </option>
            `).join('')}
          </select>
        `;
      }
      const isoDateString = consultation.date;
      const dateObject = new Date(isoDateString);
      const formattedDate = dateObject.toISOString().split('T')[0];
      Swal.fire({
        title: 'Update Consultation',
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center;">
              <label for="medecin" style="margin-right: 10px; width: 100px;">Medecin:</label>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${medecinSelect}
              </div>
            </div>
            <div style="display: flex; align-items: center;">
              <label for="date" style="margin-right: 10px; width: 100px;">Date:</label>
              <input type="date" id="date" class="swal2-input" value="${formattedDate}" />
            </div>
            
            <div style="display: flex; align-items: center;">
              <label for="diagnostic" style="margin-right: 10px; width: 100px;">Diagnostic:</label>
              <input type="text" id="diagnostic" class="swal2-input" value="${consultation.diagnostic}" />
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        focusConfirm: false,
        preConfirm: () => {
          return {
            medecin: parseInt(document.querySelector('#medecin').value, 10),
            date: document.querySelector('#date').value,
            diagnostic: document.querySelector('#diagnostic').value,
          };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updatedConsultationData = { ...result.value };
          try {
            const response = await axios.put(
              `http://localhost:3000/api/consultation/${consultation._id}`,
              updatedConsultationData,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.data) {
              const updatedConsultationList = consultations.map((c) =>
                c._id === consultation._id ? response.data : c
              );
              setConsultations(updatedConsultationList);
              Swal.fire({
                title: 'Success',
                text: 'Consultation has been updated',
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Failed to update consultation',
                icon: 'error',
              });
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: 'Error',
              text: 'An error occurred while updating the consultation',
              icon: 'error',
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while fetching medecins',
        icon: 'error',
      });
    }
  };


  const handleDeleteConsultation = async (id) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this consultation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3000/api/consultation/${id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setConsultations(consultations.filter((c) => c._id !== id));
            Swal.fire({
              title: 'Success',
              text: 'Consultation has been deleted',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete consultation',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while deleting the consultation',
            icon: 'error',
          });
        }
      }
    });
  };

  const fetchConsultations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/consultation');
      if (response.data) {
        setConsultations(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMedecins = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user/find/role/medecin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedecins(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConsultations();
    fetchMedecins();
  }, []);


  const handleDoctorSelection = async (doctorId) => {
    if (showDoctorConsultations) {
      setShowDoctorConsultations(false);
      setSelectedDoctorId(null);
      setDoctorConsultations([]);
    } else {
      setSelectedDoctorId(doctorId);
      try {
        const response = await axios.get(`http://localhost:3000/api/consultation/doctor/${doctorId}`);
        if (response.data) {
          setDoctorConsultations(response.data);
          setShowDoctorConsultations(true);
          console.log();
        } else {
          console.log();
        }
      } catch (error) {
        console.error('Error fetching doctor consultations:', error);
      }
    }
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const fullName = `${consultation.adherant.nom} ${consultation.adherant.prenom}`;
    const adherantName = fullName.toLowerCase().includes(searchQuery.toLowerCase());
  
    const beneficiaireFullName = `${consultation.beneficiaire.nom} ${consultation.beneficiaire.prenom}`;
    const beneficiaireName = beneficiaireFullName.toLowerCase().includes(searchQuery.toLowerCase());
  
    const doctorFullName = `${consultation.medecin.firstname} ${consultation.medecin.lastname}`;
    const doctorName = doctorFullName.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Return true if any of the conditions match
    return adherantName || beneficiaireName || doctorName;
  });
  
  const filteredMedecins = medecins.filter((medecin) => {
    const fullName = `${medecin.firstname} ${medecin.lastname}`;
    const doctorFullName = fullName.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Return true if the condition matches
    return doctorFullName;
  });
  

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };



  return (
    <>
      <Helmet>
        <title> Dashboard: Consultations | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

          {showDoctorConsultations ? (
            doctorConsultations.length > 0 ? (
              // Display the title with doctor's name when there are consultations
              <Typography variant="h4" gutterBottom>
                Consultations of {doctorConsultations[0].medecin.firstname} {doctorConsultations[0].medecin.lastname}
              </Typography>
            ) : (
              // Display the title "Consultations" when there are no consultations
              <Typography variant="h4" gutterBottom>
                Consultations
              </Typography>
            )
          ) : (
            // Display the title "Consultations" when there are no consultations
            <Typography variant="h4" gutterBottom>
              Consultations
            </Typography>
          )}

          {showDoctorConsultations ? (
            <Button variant="contained" onClick={handleDoctorSelection}>Back to doctors list</Button>
          ) : (
            null
          )}

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewConsultation}>
            New Consultation
          </Button>
        </Stack>



        {showDoctorConsultations ? (
          <Stack alignItems="center" mb={5} sx={{ px: 5 }}>
            <TextField
              label="Search by Names"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </Stack>
        ) : (
          <Stack alignItems="center" mb={5} sx={{ px: 5 }}>
            <TextField
              label="Search by Names"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </Stack>
        )}


        <Grid container spacing={3}>
          {showDoctorConsultations ? (
            doctorConsultations.length > 0 ? (
              doctorConsultations.map((consultation) => (
                <Grid item xs={12} sm={6} md={4} key={consultation._id}>
                  <Card variant="outlined" style={cardStyles}>
                    <CardContent>
                      {consultation.medecin ? (
                        <>

                          <img src={img} alt="Dossier" style={{ maxWidth: '50%', height: 'auto' }} />
                          <Typography variant="h6">
                            Medecin: {consultation.medecin.firstname} {consultation.medecin.lastname}
                          </Typography>
                          <Typography variant="body2">
                            Date: {new Date(consultation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                          <Typography variant="body2">Diagnostic: {consultation.diagnostic}</Typography>
                          <Typography variant="body2">Adherant: {consultation.adherant.nom} {consultation.adherant.prenom}</Typography>
                          <Typography variant="body2">Beneficiaire: {consultation.beneficiaire.nom} {consultation.beneficiaire.prenom}</Typography>
                        </>
                      ) : (
                        <Typography variant="body2">This consultation is missing doctor information.</Typography>
                      )}
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button variant="contained" onClick={() => handleDeleteConsultation(consultation._id)}>Delete</Button>
                        <Button variant="contained" onClick={() => handleUpdateConsultation(consultation)}>Update</Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2">This doctor has no consultations.</Typography>
              </Grid>
            )
          ) : (
            userr.role === 'Pharmacist' ? (
              filteredMedecins.map((medecin) => (
                <Grid item xs={12} sm={6} md={4} key={medecin._id}>
                  <div
                    style={{
                      border: '1px solid #ccc',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={images(`./${medecin.image}`)}
                      alt={`Doctor ${medecin.firstname} ${medecin.lastname}`}
                      style={{ width: '150px', height: '150px', margin: 'auto' }}
                    />
                    <Typography variant="h6">
                      Doctor: {medecin.firstname} {medecin.lastname}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleDoctorSelection(medecin._id)}
                    >
                      View Consultations
                    </Button>
                  </div>
                </Grid>
              ))
            ) : (
              // If the user's role is "Medecin," render their consultations only

              filteredConsultations
                .filter((consultation) => consultation.medecin._id === userr._id)
                .map((consultation) => (
                  <Grid item xs={12} sm={6} md={4} key={consultation._id}>
                    <div
                      style={{
                        border: '1px solid #ccc',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <img src={img} alt="Dossier" style={{ maxWidth: '50%', height: 'auto' }} />
                      <Typography variant="h6">
                        Medecin: {consultation.medecin.firstname} {consultation.medecin.lastname}
                      </Typography>
                      <Typography variant="body2">
                        Date: {new Date(consultation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                      <Typography variant="body2">Diagnostic: {consultation.diagnostic}</Typography>
                      <Typography variant="body2">
                        Adherant: {consultation.adherant.nom} {consultation.adherant.prenom}
                      </Typography>
                      <Typography variant="body2">
                        Beneficiaire: {consultation.beneficiaire.nom} {consultation.beneficiaire.prenom}
                      </Typography>
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button variant="contained" onClick={() => handleDeleteConsultation(consultation._id)}>
                          Delete
                        </Button>
                        <Button variant="contained" onClick={() => handleUpdateConsultation(consultation)}>
                          Update
                        </Button>
                      </Stack>
                    </div>
                  </Grid>
                ))
            )
          )}
        </Grid>
      </Container>
    </>
  );
}
