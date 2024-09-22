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
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateAttributePage = () => {
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate()
    const [attribute, setAttribute] = useState({
        attribute_type: '',
        attribute_value: '',
        variant_id: '',
        status: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [variants, setVariants] = useState([])
    const notify = () => toast.success('Attribute created successfully!', {
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
        setAttribute({ ...attribute, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on typing
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

    const validateForm = () => {
        const validationErrors = {};
        if (!attribute.attribute_type.trim()) validationErrors.attribute_type = 'Type is required';
        if (!attribute.attribute_value.trim()) validationErrors.attribute_value = 'Value is required';
        if (!attribute.variant_id) validationErrors.variant_id = 'Please select a variant';
        if (!attribute.status) validationErrors.status = 'Status is required';
        return validationErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        setErrors(formErrors);
        setIsSubmitted(true);

        if (Object.keys(formErrors).length === 0) {
            const formData = new FormData();
            formData.append('attribute_type', attribute.attribute_type);
            formData.append('attribute_value', attribute.attribute_value);
            formData.append('variant_id', attribute.variant_id);
            formData.append('status', attribute.status);
            axios.post(`${BASE_URL}/api/attributes`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(result => {
                    console.log(result);
                    setAttribute({
                        attribute_type: '',
                        attribute_value: '',
                        variant_id: '',
                        status: ''
                    });
                    notify();
                    navigate('/attributes')
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <CRow className="min-vh-100 mt-0rem">
            <div className="w-100 h-100 d-flex justify-content-center">
                <CCard style={{ width: '100%' }}>
                    <CCardHeader>
                        <h4>Create Attribute</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="w-100" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="variant" style={{ fontWeight: '700' }}>Choose Variant</CFormLabel>
                                <CFormSelect
                                    id="variant"
                                    name="variant_id"
                                    value={attribute.variant_id}
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


                            {/* <div className="mb-3">
                                <CFormLabel htmlFor="attributeType" style={{ fontWeight: '700' }}>Types</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="attributeType"
                                    name="attribute_type"
                                    placeholder="Enter attribute type"
                                    value={attribute.attribute_type}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.attribute_type && <p className="text-danger">{errors.attribute_type}</p>}
                            </div> */}

                            <div className="mb-3">
                                <CFormLabel htmlFor="attribute_type" style={{ fontWeight: '700' }}>Choose Type</CFormLabel>

                                <CFormSelect
                                    id="attribute_type"
                                    name='attribute_type'
                                    value={attribute.attribute_type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">select type</option> {/* Placeholder option */}
                                    <option value="fuel_types">Fuel_Type</option>
                                    <option value="Color">Colors</option>
                                    <option value="Transmission">Transmission</option>
                                </CFormSelect>
                                {isSubmitted && errors.attribute_type && (
                                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {errors.attribute_type}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="attributeValue" style={{ fontWeight: '700' }}>Value</CFormLabel>
                                <CFormInput
                                    type='text'
                                    id="attributeValue"
                                    name="attribute_value"
                                    rows="4"
                                    placeholder="Enter attribute value"
                                    value={attribute.attribute_value}
                                    onChange={handleInputChange}

                                />
                                {isSubmitted && errors.attribute_value && <p className="text-danger">{errors.attribute_value}</p>}
                            </div>


                            <div className="mb-3">
                                <CFormLabel htmlFor="status" style={{ fontWeight: '700' }}>Choose Status</CFormLabel>

                                <CFormSelect
                                    id="status"
                                    name='status'
                                    value={attribute.status}
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

export default CreateAttributePage;
