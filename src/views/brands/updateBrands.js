import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdModeEdit } from "react-icons/md";
import '../brands/brand.css'
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

const updateBrands = () => {
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    const { id } = location.state || {};
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };
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
        axios.get(`${BASE_URL}/api/brands/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                setName(result.data.name);
                setImage(result.data.image);
                setDescription(result.data.description);
                setStatus(result.data.status);
                setImagePreview(result.data.image ? result.data.image : null);
            })
            .catch(err => console.log(err));
    }, [id]);

    const update = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('image', image);

        axios.put(`${BASE_URL}/api/brands/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                console.log(result);
                notify()
                navigate('/brands');
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

                                <div className="mb-3" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <CFormLabel htmlFor="brandImage" style={{ fontWeight: '700' }}>Brand Image</CFormLabel>
                                    <div className="image-preview-container">
                                        {imagePreview && (
                                            <div className="image-preview-wrapper">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="image-preview"
                                                />
                                                <div className="image-edit-icon" onClick={() => document.getElementById('brandImage').click()}>
                                                    <MdModeEdit size={16} />
                                                </div>
                                            </div>
                                        )}
                                        <CFormInput
                                            type="file"
                                            id="brandImage"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
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
                {/* <ToastContainer /> */}
            </CRow>
        </div>
    )
}

export default updateBrands
