import { initializeConnect } from "react-redux/es/components/connect";
import axios from 'axios';


const { createSlice, configureStore } = require("@reduxjs/toolkit");



const adherantSlice = createSlice({
    name: "Adherent",
    initialState: [],
    reducers: {

        addAdherent: (state, action) => {
            state.push(action.payload)
        },
        deleteAdherent: (state, action) => {
            return state.filter(a => a._id !== action.payload)
        }
        ,
        initializeAdheretns: (state, action) => {
            return action.payload
        }

    }
})


const OneAdherantSlice = createSlice({
    name: "OneAdherent",
    initialState: {
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
    },
    reducers: {

        SetAdherent: (state, action) => {
            return action.payload
        },
        updateAdherent: (state, action) => {
            return { ...state, ...action.payload };
        },

    }
})

export const { addAdherent, deleteAdherent, initializeAdheretns } = adherantSlice.actions;
export const { SetAdherent, updateAdherent } = OneAdherantSlice.actions;

export const store = configureStore({
    reducer: {
        adherent: adherantSlice.reducer,
        OneAdherant: OneAdherantSlice.reducer
    },

})