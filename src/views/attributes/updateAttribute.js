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


const updateAttribute = () => {
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    const { id } = location.state || {};
    const [attribute_type, setAttribute_Type] = useState('');
    const [variant, setVariant] = useState([]);
    const [variant_id, setVariant_id] = useState('');
    const [attribute_value, setAttribute_Value] = useState('');
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
        axios.get(`${BASE_URL}/api/variants`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => setVariant(result.data))
            .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get(`${BASE_URL}/api/attributes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },

        })
            .then(result => {
                setAttribute_Type(result.data.attribute_type);
                setAttribute_Value(result.data.attribute_value);
                setStatus(result.data.status);
                setVariant_id(result.data.variant_id._id)
            })
            .catch(err => console.log(err));
    }, [id]);

    const update = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('attribute_type', attribute_type);
        formData.append('attribute_value', attribute_value);
        formData.append('status', status);
        formData.append('variant_id', variant_id);

        axios.put(`${BASE_URL}/api/attributes/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => {
                console.log(result);
                notify()
                navigate('/attributes');
            })
            .catch(err => console.log(err));
    };
    return (
        <div>
            <CRow className="min-vh-100 mt-0rem">
                <div className="w-100 h-100 d-flex justify-content-center">
                    <CCard style={{ width: '100%' }}>
                        <CCardHeader>
                            <h4>Update Attribute</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm encType="multipart/form-data" className="w-100" onSubmit={update}>
                                {/* <div className="mb-3">
                                    <CFormLabel htmlFor="vehicleType" style={{ fontWeight: '700' }}> Type</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="vehicleType"
                                        name="attribute_type"
                                        placeholder="Enter Type "
                                        value={attribute_type}
                                        onChange={(e) => setAttribute_Type(e.target.value)}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <CFormLabel htmlFor="attribute_type" style={{ fontWeight: '700' }}>Choose Type</CFormLabel>

                                    <CFormSelect
                                        id="attribute_type"
                                        name='attribute_type'
                                        value={attribute_type}
                                        onChange={(e) => setAttribute_Type(e.target.value)}
                                    >
                                        <option value="">select type</option> {/* Placeholder option */}
                                        <option value="fuel_types">Fuel_Type</option>
                                        <option value="Color">Colors</option>
                                        <option value="Transmission">Transmission</option>
                                    </CFormSelect>
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="variant_id" style={{ fontWeight: '700' }}>Choose Variant</CFormLabel>
                                    <CFormSelect
                                        id="variant_id"
                                        name='variant_id'
                                        value={variant_id}
                                        onChange={(e) => setVariant_id(e.target.value)}

                                    >
                                        <option value="">Open this select menu</option>
                                        {variant.map((option, index) => (
                                            <option key={index} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="vehicleValue" style={{ fontWeight: '700' }}>Value</CFormLabel>
                                    <CFormInput
                                        id="vehicleValue"
                                        name="attribute_value"
                                        rows="4"
                                        placeholder="Enter value"
                                        value={attribute_value}
                                        onChange={(e) => setAttribute_Value(e.target.value)}
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

export default updateAttribute
