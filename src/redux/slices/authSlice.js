import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    initialState : {user:null, refresh:true},
    reducers : {
        addUser(state , action){
            state.user= action.payload
        },
        handleRefresh(state, action){
            // state.refresh= state.refresh ? false : true
            state.refresh= !state.refresh 

            
        },
        clearUser(state){
            state.user=null
        }
    }
})

export default authSlice.reducer;
export const { addUser,clearUser ,handleRefresh} = authSlice.actions;