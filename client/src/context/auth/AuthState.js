import React,{useReducer } from 'react';
import AuthContext from './authContext';
import axios from 'axios';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'

const AuthState = props => {
    
    const initalState = {
       token: localStorage.getItem('token'),
       isAuthenticated:null,
       loading: null,
       user: null,
       error: null,

    };
    const [state,dispatch] = useReducer(authReducer, initalState);
    // Actions that we will have

    // Load User 
    const loadUser = async () => {
        if(localStorage.token){
            setAuthToken(localStorage.token)
        }
        try {
            const res = axios.get('/api/auth');
            dispatch({type:USER_LOADED,payload:res.data});
            
        } catch (error) {
            dispatch({type:AUTH_ERROR})
        }
    }

    // Register User
    const register =  async formData => {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        };
        try {
            console.log("before");
            const res = await axios.post('/api/users',formData,config);
            console.log(res.data)
            dispatch({type: REGISTER_SUCCESS,payload: res.data});
            loadUser();
        } catch (error) {
            dispatch({type: REGISTER_FAIL,payload: error.response.data.msg});
        }
    }

    // Login User 
    const login =  async formData => {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        };
        try {
            const res = await axios.post('/api/auth',formData,config);
            console.log(res.data)
            dispatch({type: LOGIN_SUCCESS,payload: res.data});
            loadUser();
        } catch (error) {
            dispatch({type: LOGIN_FAIL,payload: error.response.data.msg});
        }
    }

    // Logout
    const logout = () => dispatch({type:LOGOUT})

    // Clear Errors

    return (
        <AuthContext.Provider value={{
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            error: state.error,
            user:state.user,
            token: state.token,
            register,
            loadUser,
            login,
            logout


        }}>
           {props.children}
           
        </AuthContext.Provider>

    );
}
export default AuthState;

