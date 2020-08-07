import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import SetToken from '../security/SetToken';

export const login = (LoginRequest) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/login', LoginRequest);
    let { accessToken, loginResponse } = res.data;
    accessToken = 'Bearer ' + accessToken;
    localStorage.setItem('roles', loginResponse.authorities[0]);
    localStorage.setItem('jwtToken', accessToken);
    SetToken(accessToken);
    const decoded = jwt_decode(accessToken);
    dispatch({
      type: SET_CURRENT_USER,
      payload: decoded,
      roles: loginResponse.authorities[0],
    });
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data.validationErrors || error.response.data,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('roles');
  SetToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};