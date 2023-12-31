import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { BiLogoGmail } from 'react-icons/bi';
import { MdFamilyRestroom } from 'react-icons/md';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { RiVipFill } from 'react-icons/ri';
import { AiFillContainer } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import { GiLovers } from 'react-icons/gi';
import { SiMoneygram } from 'react-icons/si';
import { Link } from 'react-router-dom';

import '../../style/style.css';

import { useSelector } from 'react-redux/es/hooks/useSelector';




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AdherentDetails = ({ AdherentID }) => {


    const Adherents = useSelector((state) => state.adherent)

    const AdherentsData = Adherents.find((adherent) => adherent._id === AdherentID);

    console.log(AdherentsData)



    const images = require.context('../../utils/AdherentPictures/', true, /\.(png|jpe?g|gif|svg)$/);


    console.log(AdherentsData.image)

    return (
        <>
            <Grid container style={{ backgroundColor: 'white' }}>
                <Grid item xs={9} sm={4} style={{ display: 'flex', justifyContent: 'left', marginBottom: '20px' }}>
                    <Card sx={{ maxWidth: 345 }} style={{ border: '1px solid #ccc' }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="300"
                                image={images(`./${AdherentsData.image}`)}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h3" component="div" style={{ display: 'flex', justifyContent: 'center' }}>
                                    {AdherentsData.nom} {AdherentsData.prenom}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                </Grid>
                <Grid item xs={12} sm={6} >

                    <Item style={{ border: '1px solid #ccc', display: 'flex' }}>

                        {/* Première colonne */}
                        <div style={{ flex: '1', padding: '10px' }}>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><AiFillContainer /> Situation d'Adhésion: </p><p style={{ textAlign: 'left' }}>  {AdherentsData.situation_adhesion}</p>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><BsCalendarDate /> Date d'Adhésion:</p><p style={{ textAlign: 'left' }}>  {AdherentsData.date_adhesion}</p>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><SiMoneygram /> APCI: </p><p style={{ textAlign: 'left' }}> {AdherentsData.apci ? 'Oui' : 'Non'}</p>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><GiLovers /> Couple: </p><p style={{ textAlign: 'left' }}> {AdherentsData.couple ? 'Oui' : 'Non'} </p>
                        </div>

                        {/* Deuxième colonne */}
                        <div style={{ flex: '1', padding: '10px' }}>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><BiLogoGmail /> Email:</p><p style={{ textAlign: 'left' }}>  {AdherentsData.email}</p>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><MdFamilyRestroom /> Situation Familiale: </p><p style={{ textAlign: 'left' }}>  {AdherentsData.situation_familiale} </p>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><LiaBirthdayCakeSolid /> Date de Naissance: </p><p style={{ textAlign: 'left' }}>  {AdherentsData.date_naissance}</p>
                            <p style={{ fontSize: '15px', color: 'black', textAlign: 'left' }}><RiVipFill /> VIP:</p><p style={{ textAlign: 'left' }}> {AdherentsData.vip ? 'Oui' : 'Non'} </p>
                        </div>

                    </Item>
                    <Item>
                        <Link to={`/dashboard/Adherents/Update/${AdherentID}`}>
                            <a className="button-anchor">Update Adherent</a>
                        </Link>
                    </Item>
                </Grid>
            </Grid >

            <div >
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                </style>
                <h1 style={{ color: 'black', fontFamily: 'Bebas Neue, sans-serif', textAlign: 'left' }}>Liste des béneficiares</h1>
            </div>
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
                            AdherentsData.Benefciaire.map((Benefciaire) => (
                                <TableRow >

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


        </>
    );
};

export default AdherentDetails;
