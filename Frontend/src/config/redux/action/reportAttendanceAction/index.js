import axios from "axios";

export const FETCH_LAPORAN_ABSENSI_SUCCESS = "FETCH_LAPORAN_ABSENSI_SUCCESS";
export const FETCH_LAPORAN_ABSENSI_FAILURE = "FETCH_LAPORAN_ABSENSI_FAILURE";
export const CLEAR_LAPORAN_ABSENSI = "CLEAR_LAPORAN_ABSENSI";

export const fetchReportAttendanceSuccess = (data) => ({
    type: FETCH_LAPORAN_ABSENSI_SUCCESS,
    payload: data,
});

export const fetchReportAttendanceFailure = (error) => ({
    type: FETCH_LAPORAN_ABSENSI_FAILURE,
    payload: error,
});

export const clearReportAttendance = () => ({
    type: CLEAR_LAPORAN_ABSENSI,
});

export const fetchReportAttendanceByYear = (selectedYear, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/report/attendance/year/${selectedYear}`
        );
        const data = response.data;
        dispatch(fetchReportAttendanceSuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchReportAttendanceFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};

export const fetchReportAttendanceByMonth = (selectedMonth, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/report/attendance/month/${selectedMonth}`
        );
        const data = response.data;
        dispatch(fetchReportAttendanceSuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchReportAttendanceFailure("Terjadi kesalahan saat memuat data."));
        }
    }
};
