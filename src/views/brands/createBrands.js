import React, { useState, useRef } from 'react';
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
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateBrandPage = () => {
    const navigate = useNavigate()
    const token = useSelector((state) => state.user.token);
    console.log(token, 'token....')
    const [brand, setBrand] = useState({
        name: '',
        description: '',
        image: null,
        status: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fileInputRef = useRef(null);  // Create a ref for the file input


    const notify = () => toast.success('Brand created successfully!', {
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
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setBrand({ ...brand, image: file });
                setImagePreview(URL.createObjectURL(file));
                setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
            }
        } else {
            setBrand({ ...brand, [name]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!brand.name.trim()) validationErrors.name = 'Brand name is required';
        if (!brand.description.trim()) validationErrors.description = 'Description is required';
        if (!brand.status.trim()) validationErrors.status = 'Status is required';
        if (!brand.image) validationErrors.image = 'Brand image is required';
        return validationErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        setErrors(formErrors);
        setIsSubmitted(true);

        if (Object.keys(formErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', brand.name);
            formData.append('description', brand.description);
            formData.append('image', brand.image);
            formData.append('status', brand.status);
            axios.post(`${BASE_URL}/api/brands`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(result => {
                    console.log(result);

                    // Reset form fields after successful submission
                    setBrand({
                        name: '',
                        description: '',
                        image: null,
                        status: ''
                    });
                    setImagePreview(null);  // Clear image preview

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';  // Reset the file input field
                    }

                    notify();  // Show success notification
                    navigate('/brands')
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <CRow className="min-vh-100 mt-0rem">
            <div className="w-100 h-100 d-flex justify-content-center">
                <CCard style={{ width: '100%' }}>
                    <CCardHeader>
                        <h4>Create Brand</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm encType="multipart/form-data" className="w-100" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="brandName" style={{ fontWeight: '700' }}>Brand Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="brandName"
                                    name="name"
                                    placeholder="Enter brand name"
                                    value={brand.name}
                                    onChange={handleInputChange}
                                />
                                {isSubmitted && errors.name && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="brandDescription" style={{ fontWeight: '700' }}>Description</CFormLabel>
                                <CFormTextarea
                                    id="brandDescription"
                                    name="description"
                                    rows="4"
                                    placeholder="Enter brand description"
                                    value={brand.description}
                                    onChange={handleInputChange}
                                />
                                {isSubmitted && errors.description && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="brandImage" style={{ fontWeight: '700' }}>Brand Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="brandImage"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    ref={fileInputRef}  // Attach the ref to the file input
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                )}
                                {isSubmitted && errors.image && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {errors.image}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="status" style={{ fontWeight: '700' }}>Choose Status</CFormLabel>

                                <CFormSelect
                                    id="status"
                                    name='status'
                                    value={brand.status}
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

export default CreateBrandPage;
