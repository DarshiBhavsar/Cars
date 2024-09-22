import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
} from '@coreui/react'
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';

const CreateCarsPage = () => {
    const token = useSelector((state) => state.user.token);
    const [cars, setCars] = useState({
        name: '',
        description: '',
        brand_id: '',
        category_id: '',
        image: [],
        status: ''
    })
    const fileInputRef = useRef(null);  // Create a ref for the file input
    const [error, setError] = useState({});
    const [Brand, setBrand] = useState([]);
    const [Category, setCategory] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = () => {
        const validationError = {};
        if (!cars.name.trim()) validationError.name = "Name is required";
        if (!cars.brand_id.trim()) validationError.brand_id = "Please choose brand";
        if (!cars.image.length) validationError.image = "At least one image is required";
        if (!cars.description.trim()) validationError.description = "Description is required";
        if (!cars.category_id.trim()) validationError.category_id = "Please choose category";
        if (!cars.status.trim()) validationError.status = 'Status is required';
        return validationError;
    };

    const notify = () => toast.success('Create successful!', {
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
        axios.get(`${BASE_URL}/api/brands`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                const filteredBrands = result.data.filter(brand => brand.status === 'Active');
                setBrand(filteredBrands);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                const filteredCategory = result.data.filter(category => category.status === 'Active');
                setCategory(filteredCategory);
            })
            .catch(err => console.log(err));
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const errors = validateForm();
        setError(errors);

        const formData = new FormData();
        formData.append('name', cars.name);
        cars.image.forEach((image) => formData.append('image', image)); // Append multiple images
        formData.append('brand_id', cars.brand_id);
        formData.append('description', cars.description);
        formData.append('category_id', cars.category_id);
        formData.append('status', cars.status);


        if (Object.keys(errors).length === 0) {
            axios.post(`${BASE_URL}/api/cars`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(result => {
                    console.log(result);
                    setCars({
                        name: '',
                        description: '',
                        brand_id: '',
                        category_id: '',
                        status: '',
                        image: []
                    });
                    setImagePreview([]);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';  // Reset the file input
                    }
                    notify();
                    navigate('/cars')
                })
                .catch(err => console.log(err));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const selectedFiles = Array.from(files);
            setCars({ ...cars, [name]: selectedFiles });
            setImagePreview(selectedFiles.map(file => URL.createObjectURL(file))); // Preview multiple image
            setError(prevError => ({ ...prevError, image: '' }));
        } else {
            setCars(prevTags => ({ ...prevTags, [name]: value }));
            setError(prevError => ({ ...prevError, [name]: '' }));
        }

    };

    return (
        <CRow className="min-vh-100 mt-0rem">
            <div className="w-100 h-100 d-flex justify-content-center">
                <CCard style={{ width: '100%' }}>
                    <CCardHeader>
                        <h4>Create Cars</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm id="brandForm" className="w-100" onSubmit={submit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="name" style={{ fontWeight: '700' }}>Car Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="name"
                                    name='name'
                                    placeholder="Enter car name"
                                    value={cars.name}
                                    onChange={handleChange}

                                />
                                {isSubmitted && error.name && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {error.name}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="brandImage" style={{ fontWeight: '700' }}>Cars Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="brandImage"
                                    name="image"
                                    accept="image/*"
                                    multiple
                                    onChange={handleChange}
                                    ref={fileInputRef}  // Attach the ref to the file input
                                />
                                {imagePreview.length > 0 && (
                                    <div className="mt-2">
                                        {imagePreview.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index}`}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginRight: '10px'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                {isSubmitted && error.image && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {error.image}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="brand_id" style={{ fontWeight: '700' }}>Choose Brand</CFormLabel>
                                <CFormSelect
                                    id="brand_id"
                                    name='brand_id'
                                    value={cars.brand_id}
                                    onChange={handleChange}

                                >
                                    <option value="">Open this select menu</option>
                                    {Brand.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {isSubmitted && error.brand_id && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {error.brand_id}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="category_id" style={{ fontWeight: '700' }}>Choose Category</CFormLabel>
                                <CFormSelect
                                    id="category_id"
                                    name='category_id'
                                    value={cars.category_id}
                                    onChange={handleChange}

                                >
                                    <option value="">Open this select menu</option>
                                    {Category.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {isSubmitted && error.category_id && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {error.category_id}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="description" style={{ fontWeight: '700' }}>Description</CFormLabel>
                                <CFormTextarea
                                    id="description"
                                    name='description'
                                    rows="4"
                                    placeholder="Enter car description"
                                    value={cars.description}
                                    onChange={handleChange}

                                />
                                {isSubmitted && error.description && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {error.description}
                                    </div>
                                )}
                            </div>



                            <div className="mb-3">
                                <CFormLabel htmlFor="status" style={{ fontWeight: '700' }}>Choose Status</CFormLabel>

                                <CFormSelect
                                    id="status"
                                    name='status'
                                    value={cars.status}
                                    onChange={handleChange}

                                >
                                    <option value="">Open this select menu</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Draft">Draft</option>
                                </CFormSelect>
                                {isSubmitted && error.status && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {error.status}
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
    )
}

export default CreateCarsPage
