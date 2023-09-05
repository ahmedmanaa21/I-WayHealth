import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { BsPersonAdd } from 'react-icons/bs';
import { PiUserListDuotone } from 'react-icons/pi';
import { Provider } from 'react-redux';
import { store } from "../AdherentSlice";



import { Form3 } from '../components/Forms/form3';
import { CollapsibleTable } from '../components/List/List'


export default function AdherentsPage() {

    const [content, setContent] = useState(<CollapsibleTable />);

    const handleButtonClick = (newContent) => {
        setContent(newContent);
    };
    return (
        <Provider store={store} >
            <div style={{ backgroundColor: 'white' }} >
                <Helmet>
                    <title> Adherents</title>
                </Helmet>
                <ButtonGroup
                    disableElevation
                    variant="contained"
                    aria-label="Disabled elevation buttons"
                    style={{ marginLeft: '30px', marginBottom: '30px' }}>
                    <Button variant="contained" endIcon={<PiUserListDuotone />} onClick={() => handleButtonClick(<CollapsibleTable />)}>All Adherents</Button>
                    <Button variant="contained" endIcon={<BsPersonAdd />} onClick={() => handleButtonClick(<Form3 />)}>Add Adherent</Button>
                </ButtonGroup>
                <Container>

                    {content}
                </Container>
            </div>
        </Provider>
    );
}
