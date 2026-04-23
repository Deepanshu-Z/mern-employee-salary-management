import axios from 'axios';
import {
    GET_DATA_JABATAN_SUCCESS,
    GET_DATA_JABATAN_FAILURE,
    CREATE_DATA_JABATAN_SUCCESS,
    CREATE_DATA_JABATAN_FAILURE,
    UPDATE_DATA_JABATAN_SUCCESS,
    UPDATE_DATA_JABATAN_FAILURE,
    DELETE_DATA_JABATAN_SUCCESS,
    DELETE_DATA_JABATAN_FAILURE
} from './dataPositionActionTypes';

const API_URL = 'http://localhost:5000';

export const getPositionData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/position_data`);
            dispatch({
                type: GET_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_JABATAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createPositionData = (formData, navigate) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${API_URL}/position_data`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            dispatch({
                type: CREATE_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
            navigate("/data-position");
            return response.data;
        } catch (error) {
            dispatch({
                type: CREATE_DATA_JABATAN_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };
};

export const updatePositionData = (id, data) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`${API_URL}/position_data/${id}`, data);
            dispatch({
                type: UPDATE_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_JABATAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deletePositionData = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/position_data/${id}`);
            dispatch({
                type: DELETE_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_JABATAN_FAILURE,
                payload: error.message
            });
        }
    };
};
