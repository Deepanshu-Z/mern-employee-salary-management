import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo, ButtonThree } from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';

const FormEditAttendanceData = () => {
    const [national_id, setNik] = useState('');
    const [nameEmployee, setNameEmployee] = useState('');
    const [namePosition, setNamePosition] = useState('');
    const [present, setHadir] = useState('');
    const [sick, setSakit] = useState('');
    const [absent, setAlpha] = useState('');
    const [msg, setMsg] = useState('');
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/attendance_data/${id}`);
                setNameEmployee(response.data.employee_name);
                setNik(response.data.national_id);
                setNamePosition(response.data.position_name);
                setHadir(response.data.present);
                setSakit(response.data.sick);
                setAlpha(response.data.absent);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
        getUserById();
    }, [id]);

    const updateAttendanceData = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('employee_name', nameEmployee);
            formData.append('national_id', national_id);
            formData.append('position_name', namePosition);
            formData.append('present', present);
            formData.append('sick', sick);
            formData.append('absent', absent);

            const response = await axios.patch(`http://localhost:5000/attendance_data/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg(response.data.msg);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                timer: 1500,
                text: response.data.msg
            });
            navigate('/data-attendance');
        } catch (error) {
            setMsg(error.response.data.msg);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error.response.data.msg
            });
        }
    };

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
            <Breadcrumb pageName='Form Edit Data Attendance Employee' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Form Edit Data Attendance Employee
                            </h3>
                        </div>
                        <form onSubmit={updateAttendanceData}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Name Employee <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='nameEmployee'
                                            name='nameEmployee'
                                            value={nameEmployee}
                                            onChange={(e) => setNameEmployee(e.target.value)}
                                            disabled
                                            placeholder='Masukkan Name'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            NATIONAL_ID <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='national_id'
                                            name='national_id'
                                            value={national_id}
                                            onChange={(e) => setNik(e.target.value)}
                                            required
                                            disabled
                                            placeholder='Masukkan NATIONAL_ID'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Position <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='namePosition'
                                            name='namePosition'
                                            value={namePosition}
                                            onChange={(e) => setNamePosition(e.target.value)}
                                            required={true}
                                            disabled
                                            placeholder='Masukkan position'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Hadir <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='present'
                                            name='present'
                                            value={present}
                                            onChange={(e) => setHadir(e.target.value)}
                                            required
                                            placeholder='Masukkan present'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Sakit <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='sick'
                                            name='sick'
                                            value={sick}
                                            onChange={(e) => setSakit(e.target.value)}
                                            required
                                            placeholder='Masukkan sick'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Alpha <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='absent'
                                            name='absent'
                                            value={absent}
                                            onChange={(e) => setAlpha(e.target.value)}
                                            required
                                            placeholder='Masukkan absent'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne  >
                                            <span>Perbarui</span>
                                        </ButtonOne>
                                    </div>
                                    <Link to="/data-attendance" >
                                        <ButtonTwo  >
                                            <span>Kembali</span>
                                        </ButtonTwo>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default FormEditAttendanceData;
