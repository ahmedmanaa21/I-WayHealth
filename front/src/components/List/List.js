import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Importez les styles si nécessaire

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { removeAdherent, fetchAdherents } from '../../ActionAdherent';



function Row({ row, handleDelete }) {
  ;
  const [open, setOpen] = React.useState(false);

  const images = require.context('../../utils/AdherentPictures/', true, /\.(png|jpe?g|gif|svg)$/);


  return (

    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>


        <TableCell align="left">
          <Link to={`/dashboard/Adherents/${row._id}`}><img
            src={images(`./${row.image}`)}
            alt='user'
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '30%',
            }}

          /></Link>
        </TableCell>

        <TableCell align="left" style={{ width: '70px', fontSize: '12px', fontWeight: 'bold' }}>{row.nom}</TableCell>
        <TableCell align="left" style={{ width: '70px', fontSize: '12px', fontWeight: 'bold' }}>{row.prenom}</TableCell>
        <TableCell align="left" style={{ width: '70px', fontSize: '12px', fontWeight: 'bold' }}>{row.email}</TableCell>
        <TableCell align="left" style={{ width: '70px', fontSize: '12px', fontWeight: 'bold' }}>{row.situation_familiale}</TableCell>
        <TableCell align="left" style={{ width: '70px', fontSize: '12px', fontWeight: 'bold' }}>{
          new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',

          }).format(new Date(row.date_naissance))}

        </TableCell>
        <TableCell align="left" style={{ width: '70px', fontSize: '12px', fontWeight: 'bold' }}>{row.situation_adhesion}</TableCell>


        <TableCell style={{ width: '20px', fontSize: '12px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="left" style={{ width: '100px', fontSize: '10px', fontWeight: 'bold' }}>
          <button style={{
            border: 'none',          // Élimine la bordure
            backgroundColor: 'none', // Élimine la couleur de fond
            padding: 0,              // Élimine l'espace intérieur
            cursor: 'pointer',       // Ajoute un curseur pour indiquer un élément cliquable
          }} onClick={() => handleDelete(row._id)}><AiFillDelete /></button>

        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Benficiares
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>nom</TableCell>
                    <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>prenom</TableCell>
                    <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>sexe</TableCell>
                    <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>date naissance</TableCell>
                    <TableCell align="left" style={{ width: '100px', fontSize: '10px', fontWeight: 'bold' }}>situation familiale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    row.Benefciaire.map((Benefciaire) => (
                      <TableRow key={Benefciaire._id} >

                        <TableCell align="left" component="th" scope="row" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }} >
                          {Benefciaire.nom}
                        </TableCell>

                        <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>
                          {Benefciaire.prenom}
                        </TableCell>

                        <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>
                          {Benefciaire.sexe}
                        </TableCell>

                        <TableCell align="left" style={{ width: '70px', fontSize: '10px', fontWeight: 'bold' }}>{
                          new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }).format(new Date(Benefciaire.date_naissance))}
                        </TableCell>

                        <TableCell align="left" style={{ width: '100px', fontSize: '10px', fontWeight: 'bold' }}>
                          {Benefciaire.situation_familiale}
                        </TableCell>


                      </TableRow>
                    ))

                  }


                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>

  );
}


export const CollapsibleTable = () => {

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchAdherents());
  }, []);


  const Adherents = useSelector((state) => state.adherent)


  const handleDelete = async (itemId) => {

    // Utilisez Swal pour afficher une boîte de dialogue de confirmation
    Swal.fire({
      title: 'Êtes-vous sûr(e) de vouloir supprimer cet objet ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {

        dispatch(removeAdherent(itemId));

        Swal.fire('Objet supprimé !', '', 'success');
      }
    });
  };



  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>

            <TableCell style={{ width: '80px', fontSize: '12px' }}>Image</TableCell>
            <TableCell align="left" style={{ width: '50px', fontSize: '12px' }}>Nom</TableCell>
            <TableCell align="left" style={{ width: '50px', fontSize: '12px' }}>Prenom</TableCell>
            <TableCell align="left" style={{ width: '50px', fontSize: '12px' }}>email</TableCell>
            <TableCell align="left" style={{ width: '70px', fontSize: '12px' }}>situation Familiale</TableCell>
            <TableCell align="left" style={{ width: '70px', fontSize: '12px' }}>Date_naissance</TableCell>
            <TableCell align="left" style={{ width: '70px', fontSize: '12px' }}>Situation D'adhesion</TableCell>
            <TableCell style={{ width: '20px', fontSize: '12px' }} />
            <TableCell style={{ width: '20px', fontSize: '12px' }} />

          </TableRow>
        </TableHead>
        <TableBody>
          {Adherents.map((row) => (
            <Row key={row._id} row={row} handleDelete={handleDelete} />
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}
