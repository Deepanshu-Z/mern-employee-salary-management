import axios from "axios";

export const FETCH_SLIP_GAJI_SUCCESS = "FETCH_SLIP_GAJI_SUCCESS";
export const FETCH_SLIP_GAJI_FAILURE = "FETCH_SLIP_GAJI_FAILURE";
export const CLEAR_SLIP_GAJI = "CLEAR_SLIP_GAJI";

export const fetchSlipSalarySuccess = (data) => ({
    type: FETCH_SLIP_GAJI_SUCCESS,
    payload: data,
});

export const fetchSlipSalaryFailure = (error) => ({
    type: FETCH_SLIP_GAJI_FAILURE,
    payload: error,
});

export const clearSlipSalary = () => ({
    type: CLEAR_SLIP_GAJI,
});

export const fetchSlipSalaryByYear = (selectedYear, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/report/salary_slip/year/${selectedYear}`
        );
        const data = response.data;
        dispatch(fetchSlipSalarySuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchSlipSalaryFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};

export const fetchSlipSalaryByMonth = (selectedMonth, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/report/salary_slip/month/${selectedMonth}`
        );
        const data = response.data;
        dispatch(fetchSlipSalarySuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchSlipSalaryFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};

export const fetchSlipSalaryByName = (selectedName, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/report/salary_slip/name/${selectedName}`
        );
        const data = response.data;
        dispatch(fetchSlipSalarySuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchSlipSalaryFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};
