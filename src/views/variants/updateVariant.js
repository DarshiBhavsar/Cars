import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../brands/brand.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CRow
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';

const updateVariant = () => {
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    const { id } = location.state || {};
    const [name, setName] = useState('');
    const [car, setCar] = useState([]);
    const [car_id, setCar_id] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();


    const notify = () => toast.success('Update successful!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    useEffect(() => {
        axios.get(`${BASE_URL}/api/cars`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => setCar(result.data))
            .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get(`${BASE_URL}/api/variants/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },

        })
            .then(result => {
                setName(result.data.name);
                setDescription(result.data.description);
                setStatus(result.data.status);
                setCar_id(result.data.car_id._id)
            })
            .catch(err => console.log(err));
    }, [id]);

    const update = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('car_id', car_id);

        axios.put(`${BASE_URL}/api/variants/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => {
                console.log(result);
                notify()
                navigate('/variant');
            })
            .catch(err => console.log(err));
    };
    return (
        <div>
            <CRow className="min-vh-100 mt-0rem">
                <div className="w-100 h-100 d-flex justify-content-center">
                    <CCard style={{ width: '100%' }}>
                        <CCardHeader>
                            <h4>Update Variant</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm encType="multipart/form-data" className="w-100" onSubmit={update}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="variantName" style={{ fontWeight: '700' }}>Variant Name</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="variantName"
                                        name="name"
                                        placeholder="Enter variant name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="car_id" style={{ fontWeight: '700' }}>Choose Car</CFormLabel>
                                    <CFormSelect
                                        id="car_id"
                                        name='car_id'
                                        value={car_id}
                                        onChange={(e) => setCar_id(e.target.value)}

                                    >
                                        <option value="">Open this select menu</option>
                                        {car.map((option, index) => (
                                            <option key={index} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </div>


                                <div className="mb-3">
                                    <CFormLabel htmlFor="variantDescription" style={{ fontWeight: '700' }}>Description</CFormLabel>
                                    <CFormTextarea
                                        id="variantDescription"
                                        name="description"
                                        rows="4"
                                        placeholder="Enter variant description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>


                                <div className="mb-3">
                                    <CFormLabel htmlFor="status" style={{ fontWeight: '700' }}>Choose Status</CFormLabel>

                                    <CFormSelect
                                        id="status"
                                        name='status'
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}

                                    >
                                        <option value="">Open this select menu</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Draft">Draft</option>
                                    </CFormSelect>
                                </div>


                                <CButton type="submit" color="primary" className="w-100 mt-3" style={{ fontSize: '20px', background: 'linear-gradient(135deg, #212631, #2c3e50)', color: 'white' }}>
                                    Submit
                                </CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </div>
                {/* <ToastContainer /> */}
            </CRow>
        </div>
    )
}

export default updateVariant
