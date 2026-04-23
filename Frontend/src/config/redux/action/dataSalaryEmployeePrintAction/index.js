import axios from "axios";
import {
    GET_DATA_GAJI_SINGLE_PEGAWAI_SUCCESS,
    GET_DATA_GAJI_SINGLE_PEGAWAI_FAILURE,
} from "./dataSalaryEmployeePrintActionTypes";

export const viewSalaryDataSingleEmployeeSuccess = (data) => ({
    type: GET_DATA_GAJI_SINGLE_PEGAWAI_SUCCESS,
    payload: data,
});

export const viewSalaryDataSingleEmployeeFailure = (error) => ({
    type: GET_DATA_GAJI_SINGLE_PEGAWAI_FAILURE,
    payload: error,
});

export const viewSalarySingleEmployeeByYear = (dataYear) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/salary_data/month/${dataYear}`
        );
        const data = response.data;
        dispatch(viewSalaryDataSingleEmployeeSuccess(data));
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(viewSalaryDataSingleEmployeeFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};

export const viewSalarySingleEmployeeByMonth = (dataMonth) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/salary_data/month/${dataMonth}`
        );
        const data = response.data;
        dispatch(viewSalaryDataSingleEmployeeSuccess(data));
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(viewSalaryDataSingleEmployeeFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};

export const viewSalarySingleEmployeeByName = (employee_name) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/salary_data/name/${employee_name}`
        );
        const data = response.data;
        dispatch(viewSalaryDataSingleEmployeeSuccess(data));
    } catch (error) {
        console.log(error);
        if (employee_name) {
            dispatch(viewSalaryDataSingleEmployeeFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};
