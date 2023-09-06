import { useParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from "../../AdherentSlice";
import { EditAdherent } from '../Forms/EditAdherent';


const UpdateAdherentPage = () => {
    const { AdherentID } = useParams(); // Récupère le paramètre AdherentID de la route



    return (
        <Provider store={store} >

            <div>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                </style>
                <h1 style={{ color: 'black', fontFamily: 'Bebas Neue, sans-serif' }}>Détails de l'Adhérent</h1>
                <EditAdherent AdherentID={AdherentID} />
            </div>
        </Provider>
    );
};

export default UpdateAdherentPage;
