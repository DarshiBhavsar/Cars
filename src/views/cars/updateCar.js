import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RxCross2 } from 'react-icons/rx';
import '../brands/brand.css'
import '../cars/car.css'
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
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const updateCars = () => {
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    const { id } = location.state || {};
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [Brand, setBrand] = useState([]);
    const [Category, setCategory] = useState([]);
    const [description, setDescription] = useState('');
    const [brand_id, setBrand_id] = useState('');
    const [category_id, setCategory_id] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState([]);

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
        axios.get(`${BASE_URL}/api/cars/${id}`)
            .then(result => {
                setName(result.data.name);
                setImage(result.data.image);
                setBrand_id(result.data.brand_id._id)
                setCategory_id(result.data.category_id._id)
                setDescription(result.data.description);
                setStatus(result.data.status);
                setImagePreview(result.data.image || []);
            })
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/brands`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(result => {
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImage(files);
        setImagePreview(files.map((file) => URL.createObjectURL(file)));
    };

    const handleRemoveImage = (imageUrl) => {
        const filename = imageUrl.split('/').pop(); // Extract filename from URL

        axios.delete(`${BASE_URL}/api/cars/deleteImage`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { filename }, // Pass the filename as a query parameter
        })
            .then(response => {
                console.log('Image deleted successfully:', response.data);

                // Remove the deleted image from both preview and image state
                setImagePreview(prev => prev.filter(preview => preview !== imageUrl));
                setImage(prev => prev.filter(file => file.name !== filename));
            })
            .catch(error => {
                console.error('Error deleting image:', error);
            });
    };

    const update = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        image.forEach((image) => {
            formData.append('image', image);
        });
        formData.append('brand_id', brand_id);
        formData.append('category_id', category_id);

        axios.put(`${BASE_URL}/api/cars/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => {
                console.log(result);
                notify()
                navigate('/cars');
            })
            .catch(err => console.log(err));
    };
    return (
        <div>
            <CRow className="min-vh-100 mt-0rem">
                <div className="w-100 h-100 d-flex justify-content-center">
                    <CCard style={{ width: '100%' }}>
                        <CCardHeader>
                            <h4>Update Brand</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm encType="multipart/form-data" className="w-100" onSubmit={update}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="brandName" style={{ fontWeight: '700' }}>Brand Name</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="brandName"
                                        name="name"
                                        placeholder="Enter brand name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="brand_id" style={{ fontWeight: '700' }}>Choose Brand</CFormLabel>
                                    <CFormSelect
                                        id="brand_id"
                                        name='brand_id'
                                        value={brand_id}
                                        onChange={(e) => setBrand_id(e.target.value)}

                                    >
                                        <option value="">Open this select menu</option>
                                        {Brand.map((option, index) => (
                                            <option key={index} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </div>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="category_id" style={{ fontWeight: '700' }}>Choose Category</CFormLabel>
                                    <CFormSelect
                                        id="category_id"
                                        name='category_id'
                                        value={category_id}
                                        onChange={(e) => setCategory_id(e.target.value)}

                                    >
                                        <option value="">Open this select menu</option>
                                        {Category.map((option, index) => (
                                            <option key={index} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </CFormSelect>

                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="brandDescription" style={{ fontWeight: '700' }}>Description</CFormLabel>
                                    <CFormTextarea
                                        id="brandDescription"
                                        name="description"
                                        rows="4"
                                        placeholder="Enter brand description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="brandImage" style={{ fontWeight: '700' }}>Brand Image</CFormLabel>
                                    <CFormInput
                                        type="file"
                                        id="brandImage"
                                        name="image"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        style={{ display: 'block', }}
                                    />
                                    <div className="image-preview-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {imagePreview.length > 0 ? (
                                            imagePreview.map((preview, index) => (
                                                <div key={index} className="image-preview-wrapper" style={{ position: 'relative', margin: '5px' }}>
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index}`}
                                                        className="image-preview"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                    <div
                                                        className="image-edit-icon"
                                                        onClick={() => handleRemoveImage(preview)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0',
                                                            right: '0',
                                                            backgroundColor: 'white',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer',
                                                            padding: '5px',
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
                                                        }}
                                                    >
                                                        <RxCross2 size={16} />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div>No images to display</div>
                                        )}
                                    </div>

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
            </CRow>
        </div>
    )
}

export default updateCars
