import axios from 'axios';
import {
    GET_DATA_KEHADIRAN_SUCCESS,
    GET_DATA_KEHADIRAN_FAILURE,
    CREATE_DATA_KEHADIRAN_SUCCESS,
    CREATE_DATA_KEHADIRAN_FAILURE,
    UPDATE_DATA_KEHADIRAN_SUCCESS,
    UPDATE_DATA_KEHADIRAN_FAILURE,
    DELETE_DATA_KEHADIRAN_SUCCESS,
    DELETE_DATA_KEHADIRAN_FAILURE
} from './dataAttendanceActionTypes';

export const getAttendanceData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:5000/attendance_data');
            const dataAttendance = response.data;
            dispatch({
                type: GET_DATA_KEHADIRAN_SUCCESS,
                payload: dataAttendance
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_KEHADIRAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createAttendanceData = (dataEmployee, dataAttendance, navigate) => async (dispatch) => {
    try {
        for (let i = 0; i < dataEmployee.length; i++) {
            const isNameAda = dataAttendance.some(
                (attendance) => attendance.employee_name === dataEmployee[i].employee_name
            );

            if (!isNameAda) {
                const response = await axios.post("http://localhost:5000/attendance_data", {
                    national_id: dataEmployee[i].national_id,
                    employee_name: dataEmployee[i].employee_name,
                    position_name: dataEmployee[i].position,
                    gender: dataEmployee[i].gender,
                    present: present[i] || 0,
                    sick: sick[i] || 0,
                    absent: absent[i] || 0,
                });

                dispatch({
                    type: CREATE_DATA_KEHADIRAN_SUCCESS,
                    payload: response.data,
                });

                navigate("/data-attendance");
                return response.data;
            }
        }
    } catch (error) {
        dispatch({
            type: CREATE_DATA_KEHADIRAN_FAILURE,
            payload: error.message,
        });
        throw error;
    }
};

export const updateAttendanceData = (id, dataAttendance) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`http://localhost:5000/attendance_data/${id}`, dataAttendance);
            if (response.status === 200) {
                dispatch({
                    type: UPDATE_DATA_KEHADIRAN_SUCCESS,
                    payload: 'Data attendance berhasil diupdate'
                });
                dispatch(getAttendanceData());
            } else {
                dispatch({
                    type: UPDATE_DATA_KEHADIRAN_FAILURE,
                    payload: response.data.message
                });
            }
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_KEHADIRAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteAttendanceData = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`http://localhost:5000/attendance_data/${id}`);
            if (response.status === 200) {
                dispatch({
                    type: DELETE_DATA_KEHADIRAN_SUCCESS,
                    payload: 'Delete data berhasil'
                });
                dispatch(getAttendanceData());
            } else {
                dispatch({
                    type: DELETE_DATA_KEHADIRAN_FAILURE,
                    payload: response.data.message
                });
            }
        } catch (error) {
            dispatch({
                type: DELETE_DATA_KEHADIRAN_FAILURE,
                payload: error.message
            });
        }
    };
};
