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
    CFormTextarea,
    CRow,
    CFormSelect
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateCategoriesPage = () => {
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        name: '',
        description: '',
        status: '',
        image: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);  // Create a ref for the file input
    const notify = () => toast.success('Category created successfully!', {
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
                setCategory({ ...category, image: file });
                setImagePreview(URL.createObjectURL(file));
                setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
            }
        } else {
            setCategory({ ...category, [name]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!category.name.trim()) validationErrors.name = 'Category name is required';
        if (!category.description.trim()) validationErrors.description = 'Description is required';
        if (!category.status.trim()) validationErrors.status = 'Status is required';
        if (!category.image) validationErrors.image = 'Image is required';
        return validationErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', category.name);
            formData.append('description', category.description);
            formData.append('status', category.status);
            formData.append('image', category.image);

            axios.post(`${BASE_URL}/api/categories`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(result => {
                    console.log(result);
                    // Reset form fields after successful submission
                    setCategory({
                        name: '',
                        description: '',
                        status: '',
                        image: null
                    });
                    setImagePreview(null);  // Clear image preview

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';  // Reset the file input field
                    }

                    notify();  // Show success notification
                    navigate('/category')
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <CRow className="min-vh-100 mt-0rem">
            <div className="w-100 h-100 d-flex justify-content-center">
                <CCard style={{ width: '100%' }}>
                    <CCardHeader>
                        <h4>Create Categories</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="w-100" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="categoryName" style={{ fontWeight: '700' }}>Category Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="categoryName"
                                    name="name"
                                    placeholder="Enter category name"
                                    value={category.name}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.name && <p className="text-danger">{errors.name}</p>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="categoryDescription" style={{ fontWeight: '700' }}>Description</CFormLabel>
                                <CFormTextarea
                                    id="categoryDescription"
                                    name="description"
                                    rows="4"
                                    placeholder="Enter category description"
                                    value={category.description}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.description && <p className="text-danger">{errors.description}</p>}
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="categoryImage" style={{ fontWeight: '700' }}>Category Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="categoryImage"
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
                                    value={category.status}
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
        </CRow>
    );
};

export default CreateCategoriesPage;
