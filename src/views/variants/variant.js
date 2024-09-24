import React, { useState, useEffect } from 'react'
import '../brands/brand.css'
import {
    CButton,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CModal,
    CModalBody,
    CModalHeader,
    CModalFooter,
    CSpinner,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';
import Pagination from '../pagination/pagination';

const VariantPage = () => {
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate()
    const [variant, setVariant] = useState([]);
    const [show, setShow] = useState(false);  // Modal state
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);  // Selected brand
    const handleClose = () => setShow(false);
    const handleShow = (item) => {
        setSelectedUser(item);  // Set the selected brand object
        setShow(true);  // Show the modal
    };
    const [currentPage, setCurrentPage] = useState(1);
    const postPerPage = 5;
    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    const currentPost = variant.slice(firstPostIndex, lastPostIndex);

    const notify = () => toast.success('Delete successful!', {
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
        setIsLoading(true);
        axios.get(`${BASE_URL}/api/variants`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => { setVariant(result.data); setIsLoading(false) })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/api/variants/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                setVariant(variant.filter(variant => variant._id !== id)); // Update state after deletion
                notify();
                handleClose();  // Close the modal
            })
            .catch(err => console.log(err));
    };
    return (
        <div>
            <CButton
                type="submit"
                color="primary"
                style={{
                    height: '40px',
                    fontSize: '20px',
                    display: 'flex',
                    background: 'linear-gradient(135deg, #212631, #2c3e50)',
                    alignItems: 'center',
                    padding: '10px 20px',
                    borderRadius: '20px' // Custom border radius
                }}
                onClick={() => navigate('/createVariants')}
            >
                Add Variant
            </CButton>
            {isLoading ? ( // Show spinner if isLoading is true
                <div className="text-center mt-4">
                    <CSpinner color="primary" />
                </div>
            ) : (
                <div>
                    <CTable hover responsive className="mt-4" bordered>
                        <colgroup>
                            <col style={{ width: '20%' }} /> {/* Image Column */}
                            <col style={{ width: '20%' }} /> {/* Name Column */}
                            <col style={{ width: '20%' }} /> {/* Description Column */}
                            <col style={{ width: '20%' }} /> {/* Status Column */}
                            <col style={{ width: '20%' }} /> {/* Actions Column */}
                        </colgroup>
                        <CTableHead color="white">
                            <CTableRow>
                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Cars</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {currentPost.length > 0 ? (
                                currentPost.map((item, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{item.name}</CTableDataCell>
                                        <CTableDataCell>{item.description}</CTableDataCell>
                                        <CTableDataCell>{item.car_id.name}</CTableDataCell>
                                        <CTableDataCell>{item.status}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton className='update' size="sm" onClick={() => navigate(`/update_variant`, { state: { id: item._id } })}>
                                                Edit
                                            </CButton>
                                            <CButton size="sm" className="delete mx-2" onClick={() => handleShow(item)}>
                                                Delete
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan="5" className="text-center">
                                        No Categories Found
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>


                    </CTable>
                    < Pagination totalPost={variant.length} postPerPage={postPerPage} setCurrentPage={setCurrentPage} />
                </div>
            )}


            <CModal visible={show} onClose={handleClose} centered className="custom-modal">
                <CModalHeader closeButton>
                    <CModalBody>
                        <p>Are you sure you want to delete this Variant?</p>
                    </CModalBody>
                </CModalHeader>
                <CModalFooter>
                    <CButton className='No' onClick={handleClose}>
                        NO
                    </CButton>
                    <CButton className='Yes' onClick={() => handleDelete(selectedUser?._id)}>
                        Yes
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default VariantPage
