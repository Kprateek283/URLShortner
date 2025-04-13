// src/actions/signupActions.ts
import { Dispatch } from 'redux';
import axios from 'axios';
import { setError, setLoading, setSuccess, setToken } from '../slices/signupSlice';

export const registerUser = (
  userName: string,
  email: string,
  password: string
) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoading(true)); // Set loading state to true

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        userName,
        email,
        password,
      });

      // If successful, dispatch token and success state
      dispatch(setSuccess(true));
      dispatch(setToken(response.data.token));
    } catch (err) {
      dispatch(setError('Registration failed. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};
