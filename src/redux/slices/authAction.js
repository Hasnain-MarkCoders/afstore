import API from '../../api/api';
import {addUser, clearUser, handleRefresh} from './authSlice';

export const loginHandle = (email , password , remember=true) => async dispatch =>{
    try {
        const response = await API.post(`/login`, {
            email,
            password,
            remember
          })
        dispatch(addUser(response.data.user))
          localStorage.setItem('token' , response.data.user.token)
        return {data:response.data.user}
    } catch (error) {
        return { error}
    }
} 


export const logoutAction=()=>dispatch=>{
    dispatch(clearUser())
}

export const refreshToken = () => async dispatch =>{
        dispatch(handleRefresh())
  
}