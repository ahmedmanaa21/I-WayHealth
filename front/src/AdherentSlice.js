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

export const { addAdherent, deleteAdherent, initializeAdheretns } = adherantSlice.actions;
export const store = configureStore({
    reducer: {
        adherent: adherantSlice.reducer
    },

})