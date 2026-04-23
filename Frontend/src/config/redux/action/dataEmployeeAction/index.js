import axios from 'axios';
import {
    GET_DATA_PEGAWAI_SUCCESS,
    GET_DATA_PEGAWAI_FAILURE,
    PEGAWAI_IMAGE_SUCCESS,
    PEGAWAI_IMAGE_FAILURE,
    GET_DATA_PEGAWAI_BY_ID_SUCCESS,
    GET_DATA_PEGAWAI_BY_ID_FAILURE,
    GET_DATA_PEGAWAI_BY_NATIONAL_ID_SUCCESS,
    GET_DATA_PEGAWAI_BY_NATIONAL_ID_FAILURE,
    GET_DATA_PEGAWAI_BY_NAME_SUCCESS,
    GET_DATA_PEGAWAI_BY_NAME_FAILURE,
    CREATE_DATA_PEGAWAI_REQUEST,
    CREATE_DATA_PEGAWAI_SUCCESS,
    CREATE_DATA_PEGAWAI_FAILURE,
    UPDATE_DATA_PEGAWAI_SUCCESS,
    UPDATE_DATA_PEGAWAI_FAILURE,
    DELETE_DATA_PEGAWAI_SUCCESS,
    DELETE_DATA_PEGAWAI_FAILURE
} from './dataEmployeeActionTypes';

const API_URL = 'http://localhost:5000';

export const getEmployeeData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employee_data`);
            dispatch({
                type: GET_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
        }
    };
};

export const employeeImage = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/images`);
            dispatch({
                type: PEGAWAI_IMAGE_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: PEGAWAI_IMAGE_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getEmployeeDataById = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employee_data/id/${id}`);
            dispatch({
                type: GET_DATA_PEGAWAI_BY_ID_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_BY_ID_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getEmployeeDataByNik = (national_id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employee_data/national_id/${national_id}`);
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NATIONAL_ID_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NATIONAL_ID_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getEmployeeDataByName = (employee_name) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employee_data/name/${employee_name}`);
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NAME_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NAME_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createEmployeeData = (formData, navigate) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_DATA_PEGAWAI_REQUEST });

        try {
            const response = await axios.post(`${API_URL}/employee_data`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            dispatch({
                type: CREATE_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
            navigate("/data-employee");
            return response.data;
        } catch (error) {
            dispatch({
                type: CREATE_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };
};

export const updateEmployeeData = (id, data) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`${API_URL}/employee_data/${id}`, data);
            dispatch({
                type: UPDATE_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteEmployeeData = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/employee_data/${id}`);
            dispatch({
                type: DELETE_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
        }
    };
};
