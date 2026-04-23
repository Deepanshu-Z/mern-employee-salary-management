import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { BiSearch } from 'react-icons/bi';
import { getMe } from '../../../../../config/redux/action';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

const ITEMS_PER_PAGE = 4;

const FormAddAttendanceData = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataEmployee, setEmployeeData] = useState([]);
    const [dataAttendance, setAttendanceData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { isError, user } = useSelector((state) => state.auth);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const totalPages = Math.ceil(dataEmployee.length / ITEMS_PER_PAGE);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const filteredEmployeeData = dataEmployee.filter((employee) =>
        employee.employee_name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const getEmployeeData = async () => {
        const response = await axios.get("http://localhost:5000/employee_data");
        setEmployeeData(response.data);
    };

    const getAttendanceData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/attendance_data");
            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const [present, setHadir] = useState([]);
    const [sick, setSakit] = useState([]);
    const [absent, setAlpha] = useState([]);

    const handleHadir = (index, value) => {
        const updateHadir = [...present];
        updateHadir[index] = value;
        setHadir(updateHadir);
    };

    const handleSakit = (index, value) => {
        const updateSakit = [...sick];
        updateSakit[index] = value;
        setSakit(updateSakit);
    };

    const handleAlpha = (index, value) => {
        const updateAlpha = [...absent];
        updateAlpha[index] = value;
        setAlpha(updateAlpha);
    };

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const saveAttendanceData = async (e) => {
        e.preventDefault();

        try {
            for (let i = 0; i < dataEmployee.length; i++) {
                const isNameAda = dataAttendance.some(
                    (attendance) => attendance.employee_name === dataEmployee[i].employee_name
                );

                if (!isNameAda) {
                    await axios.post("http://localhost:5000/attendance_data", {
                        national_id: dataEmployee[i].national_id,
                        employee_name: dataEmployee[i].employee_name,
                        position_name: dataEmployee[i].position,
                        gender: dataEmployee[i].gender,
                        present: present[i] || 0,
                        sick: sick[i] || 0,
                        absent: absent[i] || 0,
                    });
                    navigate("/data-attendance");
                    Swal.fire({
                        icon: 'success',
                        title: "Berhasil",
                        text: "Data Berhasil di Simpan",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        } catch (error) {
            if (error.response) {
                Swal.fire({
                    title: "Error",
                    text: error.response.data.msg,
                    icon: "error",
                });
            }
        }
    };

    const paginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`py-2 px-4 border border-gray-2 text-black font-semibold dark:text-white dark:border-strokedark ${currentPage === page ? 'bg-primary text-white hover:bg-primary dark:bg-primary dark:hover:bg-primary' : 'hover:bg-gray-2 dark:hover:bg-stroke'
                        } rounded-lg`}
                >
                    {page}
                </button>
            );
        }

        if (startPage > 2) {
            items.unshift(
                <p
                    key="start-ellipsis"
                    className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                >
                    ...
                </p>
            );
        }

        if (endPage < totalPages - 1) {
            items.push(
                <p
                    key="end-ellipsis"
                    className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                >
                    ...
                </p>
            );
        }

        return items;
    };

    useEffect(() => {
        getEmployeeData();
        getAttendanceData();
    }, []);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
        if (user && user.access_role !== 'admin') {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    return (
        <Layout>
            <Breadcrumb pageName="Form Data Attendance Employee" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                <form onSubmit={saveAttendanceData}>
                    <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                        <div className="relative flex-2 mb-4 md:mb-0">
                            <input
                                type="text"
                                placeholder="Cari Name Employee..."
                                value={searchKeyword}
                                onChange={handleSearch}
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0"
                            />
                            <span className="absolute left-2 py-3 text-xl">
                                <BiSearch />
                            </span>
                        </div>
                    </div>
                    <div className="max-w-full overflow-x-auto py-4">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        No
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        NATIONAL_ID
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Name Employee
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Position
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Jenis Kelamin
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Hadir
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Sakit
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Alpha
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployeeData.slice(startIndex, endIndex).map((data, index) => {
                                    const isNameAda = dataAttendance.some(
                                        (attendance) => attendance.employee_name === data.employee_name
                                    );

                                    if (isNameAda) {
                                        return <tr
                                            key={data.id}
                                            className="border-b border-[#eee] dark:border-strokedark"
                                        >
                                            <td className="py-5 px-4">
                                                <p className="text-center text-black dark:text-white">{startIndex + index + 1}</p>
                                            </td>
                                            <td className="py-5 px-4"
                                                colSpan="8">
                                                <p className="text-center text-black dark:text-white">Data Attendance Employee Sudah di Simpan. Input Kembali Ketika Sudah Ganti Periode !</p>
                                            </td>
                                        </tr>;
                                    }

                                    return (
                                        <tr
                                            key={data.id}
                                            className="border-b border-[#eee] dark:border-strokedark"
                                        >
                                            <td className="py-5 px-4">
                                                <p className="text-center text-black dark:text-white">{startIndex + index + 1}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.national_id}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.employee_name}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.position}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.gender}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={present[index] || ""}
                                                    onChange={(e) => handleHadir(index, e.target.value)}
                                                    className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                                    min="0"
                                                    required
                                                />
                                            </td>
                                            <td className="py-5 px-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={sick[index] || ""}
                                                    onChange={(e) => handleSakit(index, e.target.value)}
                                                    className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                                    min="0"
                                                    required
                                                />
                                            </td>
                                            <td className="py-5 px-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={absent[index] || ""}
                                                    onChange={(e) => handleAlpha(index, e.target.value)}
                                                    className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                                    min="0"
                                                    required
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployeeData.length)} of {filteredEmployeeData.length} Data Attendance Employee
                            </span>

                        </div>
                        <div className="flex space-x-2 py-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={goToPrevPage}
                                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                < MdKeyboardDoubleArrowLeft />
                            </button>
                            {paginationItems()}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={goToNextPage}
                                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                < MdKeyboardDoubleArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row w-full gap-3 text-center py-4">
                        <div>
                            <ButtonOne type="submit">
                                <span>Simpan</span>
                            </ButtonOne>
                        </div>
                        <Link to="/data-attendance">
                            <ButtonTwo>
                                <span>Kembali</span>
                            </ButtonTwo>
                        </Link>
                    </div>
                </form>
            </div>
        </Layout >
    );
};


export default FormAddAttendanceData;
