import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo} from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';

const FormEditPositionData = () => {
    const [namePosition, setNamePosition] = useState('');
    const [salaryPokok, setSalaryPokok] = useState('');
    const [tjTransport, setTjTransport] = useState('');
    const [uangMakan, setUangMakan] = useState('');
    const [msg,setMsg] = useState('');
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/position_data/${id}`);
                setNamePosition(response.data.position_name);
                setSalaryPokok(response.data.base_salary);
                setTjTransport(response.data.transport_allowance);
                setUangMakan(response.data.meal_allowance);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
        getUserById();
    }, [id]);

    const updatePositionData = async (e) => {
        e.preventDefault();
        const numericValues = [
            { value: Number(salaryPokok), label: "Base salary" },
            { value: Number(tjTransport), label: "Transport allowance" },
            { value: Number(uangMakan), label: "Meal allowance" },
        ];

        const invalidInput = numericValues.find(({ value }) => !Number.isFinite(value) || value <= 0);
        if (invalidInput) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: `${invalidInput.label} must be a positive number.`,
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('position_name', namePosition);
            formData.append('base_salary', salaryPokok);
            formData.append('transport_allowance', tjTransport);
            formData.append('meal_allowance', uangMakan);

            const response = await axios.patch(`http://localhost:5000/position_data/${id}`, formData, {
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
            navigate('/data-position');
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
            <Breadcrumb pageName='Form Edit Position' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Form Edit Data Position
                            </h3>
                        </div>
                        <form onSubmit={updatePositionData}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
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
                                            placeholder='Masukkan position'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Salary Pokok <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='salaryPokok'
                                            name='salaryPokok'
                                            min='1'
                                            value={salaryPokok}
                                            onChange={(e) => setSalaryPokok(e.target.value)}
                                            required
                                            placeholder='Masukkan salary pokok'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Tunjangan Transport <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='tjTransport'
                                            name='tjTransport'
                                            min='1'
                                            value={tjTransport}
                                            onChange={(e) => setTjTransport(e.target.value)}
                                            required
                                            placeholder='Masukkan tunjangan transport'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Uang Makan <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='uangMakan'
                                            name='uangMakan'
                                            min='1'
                                            value={uangMakan}
                                            onChange={(e) => setUangMakan(e.target.value)}
                                            required
                                            placeholder='Masukkan uang makan'
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
                                    <Link to="/data-position" >
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

export default FormEditPositionData;
