import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import BASE_URL from '../../config/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateVariantPage = () => {
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate();
    const [variant, setVariant] = useState({
        name: '',
        description: '',
        car_id: '',
        status: '',
    });
    const [errors, setErrors] = useState({});
    const [cars, setCars] = useState([])
    const [isSubmitted, setIsSubmitted] = useState(false);

    const notify = () => toast.success('Variant created successfully!', {
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
        setVariant({ ...variant, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on typing
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!variant.name.trim()) validationErrors.name = 'Variant name is required';
        if (!variant.description.trim()) validationErrors.description = 'Description is required';
        if (!variant.status.trim()) validationErrors.status = 'Status is required';
        if (!variant.car_id) validationErrors.car_id = 'Please select a car';
        return validationErrors;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/api/cars`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                const filteredCar = result.data.filter(car => car.status === 'Active');
                setCars(filteredCar);
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
            formData.append('name', variant.name);
            formData.append('description', variant.description);
            formData.append('car_id', variant.car_id);
            formData.append('status', variant.status);
            axios.post(`${BASE_URL}/api/variants`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(result => {
                    console.log(result);
                    setVariant({
                        name: '',
                        description: '',
                        car_id: '',
                        status: ''
                    });
                    notify();
                    navigate('/variant')
                })
                .catch(err => console.log(err));
        }

    };

    return (
        <CRow className="min-vh-100 mt-0rem">
            <div className="w-100 h-100 d-flex justify-content-center">
                <CCard style={{ width: '100%' }}>
                    <CCardHeader>
                        <h4>Create Variants</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="w-100" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="variantName" style={{ fontWeight: '700' }}>Variant Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="variantName"
                                    name="name"
                                    placeholder="Enter variant name"
                                    value={variant.name}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.name && <p className="text-danger">{errors.name}</p>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="car" style={{ fontWeight: '700' }}>Choose Car</CFormLabel>
                                <CFormSelect
                                    id="car"
                                    name="car_id"
                                    aria-label="Select a car"
                                    value={variant.car_id}
                                    onChange={handleInputChange}

                                >
                                    <option value="">Open this select menu</option>
                                    {cars.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {isSubmitted && errors.car_id && <p className="text-danger">{errors.car_id}</p>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="variantDescription" style={{ fontWeight: '700' }}>Description</CFormLabel>
                                <CFormTextarea
                                    id="variantDescription"
                                    name="description"
                                    rows="4"
                                    placeholder="Enter description"
                                    value={variant.description}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.description && <p className="text-danger">{errors.description}</p>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="status" style={{ fontWeight: '700' }}>Choose Status</CFormLabel>

                                <CFormSelect
                                    id="status"
                                    name='status'
                                    value={variant.status}
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

                            <CButton type="submit" color="primary" className="w-100 mt-3" style={{ fontSize: '20px', background: 'linear-gradient(135deg, #212631, #2c3e50)', color: 'white' }}>
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

export default CreateVariantPage;
