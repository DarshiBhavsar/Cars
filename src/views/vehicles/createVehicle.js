import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config/config';
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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateVehiclePage = () => {
    const navigate = useNavigate()
    const token = useSelector((state) => state.user.token);
    const [vehicle, setVehicle] = useState({
        name: '',
        price: '',
        variant_id: '',
        status: '',
    });
    const [errors, setErrors] = useState({});
    const [variants, setVariants] = useState([])
    const [isSubmitted, setIsSubmitted] = useState(false);

    const notify = () => toast.success('Vehicle created successfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on typing
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!vehicle.name.trim()) validationErrors.name = 'Vehicle name is required';
        if (!vehicle.price.trim()) validationErrors.price = 'Price is required';
        if (!vehicle.status.trim()) validationErrors.status = 'Status is required';
        if (!vehicle.variant_id) validationErrors.variant_id = 'Please select a variant';
        return validationErrors;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/api/variants`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                const filteredVariant = result.data.filter(variant => variant.status === 'Active');
                setVariants(filteredVariant);
            })
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const formErrors = validateForm();
        setErrors(formErrors);



        if (Object.keys(formErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', vehicle.name);
            formData.append('price', vehicle.price);
            formData.append('variant_id', vehicle.variant_id);
            formData.append('status', vehicle.status);
            axios.post(`${BASE_URL}/api/vehicles`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(result => {
                    console.log(result);
                    setVehicle({
                        name: '',
                        price: '',
                        variant_id: '',
                        status: '',
                    });
                    notify();
                    navigate('/vehicles')
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <CRow className="min-vh-100 mt-0rem">
            <div className="w-100 h-100 d-flex justify-content-center">
                <CCard style={{ width: '100%' }}>
                    <CCardHeader>
                        <h4>Create Vehicle</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm id="vehicleForm" className="w-100" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="vehicleName" style={{ fontWeight: '700' }}>Vehicle Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="vehicleName"
                                    name="name"
                                    placeholder="Enter vehicle name"
                                    value={vehicle.name}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.name && <p className="text-danger">{errors.name}</p>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="variant" style={{ fontWeight: '700' }}>Choose Variant</CFormLabel>
                                <CFormSelect
                                    id="variant"
                                    name="variant_id"
                                    aria-label="Select a variant"
                                    value={vehicle.variant_id}
                                    onChange={handleInputChange}

                                >
                                    <option value="">Open this select menu</option>
                                    {variants.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {isSubmitted && errors.variant_id && <p className="text-danger">{errors.variant_id}</p>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="vehiclePrice" style={{ fontWeight: '700' }}>Price</CFormLabel>
                                <CFormInput
                                    type='number'
                                    id="vehiclePrice"
                                    name="price"
                                    rows="4"
                                    placeholder="Enter vehicle price"
                                    value={vehicle.price}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.price && <p className="text-danger">{errors.price}</p>}
                            </div>


                            <div className="mb-3">
                                <CFormLabel htmlFor="status" style={{ fontWeight: '700' }}>Choose Status</CFormLabel>

                                <CFormSelect
                                    id="status"
                                    name='status'
                                    value={vehicle.status}
                                    onChange={handleInputChange}

                                >
                                    <option value="">Open this select menu</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Draft">Draft</option>
                                </CFormSelect>
                                {isSubmitted && errors.status && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {errors.status}
                                    </div>
                                )}
                            </div>
                            <CButton type="submit" className="w-100 mt-3" style={{ fontSize: '20px', background: 'linear-gradient(135deg, #212631, #2c3e50)', color: 'white' }}>
                                Submit
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </div>
            {/* <ToastContainer /> */}
        </CRow>
    );
};

export default CreateVehiclePage;
