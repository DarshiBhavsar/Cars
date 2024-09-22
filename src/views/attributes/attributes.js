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
} from '@coreui/react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';
import Pagination from '../pagination/pagination';

const AttributePage = () => {
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate()
    const [attribute, setAttribute] = useState([]);
    const [show, setShow] = useState(false);  // Modal state
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
    const currentPost = attribute.slice(firstPostIndex, lastPostIndex);
    // Notification for successful deletion
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

    // Fetch brands on component mount
    useEffect(() => {
        axios.get(`${BASE_URL}/api/attributes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => setAttribute(result.data))
            .catch(err => console.log(err));
    }, []);

    // Delete brand
    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/api/attributes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                setAttribute(attribute.filter(attribute => attribute._id !== id)); // Update state after deletion
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
                onClick={() => navigate('/createAttribute')}
            >
                Add Attribute
            </CButton>
            <CTable hover responsive className="mt-4" bordered>
                <colgroup>
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <CTableHead color="white">
                    <CTableRow>
                        <CTableHeaderCell scope="col">Attribute_type</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Attribute_value</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Variant</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {currentPost.length > 0 ? (
                        currentPost.map((item, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{item.attribute_type}</CTableDataCell>
                                <CTableDataCell>{item.attribute_value}</CTableDataCell>
                                <CTableDataCell>{item.variant_id.name}</CTableDataCell>
                                <CTableDataCell>{item.status}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton className='update' size="sm" onClick={() => navigate(`/update_attribute`, { state: { id: item._id } })}>
                                        Edit
                                    </CButton>
                                    <CButton className='delete mx-2' size="sm" onClick={() => handleShow(item)}>
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="5" className="text-center">
                                No Attributes Found
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>

            </CTable>
            <Pagination totalPost={attribute.length} postPerPage={postPerPage} setCurrentPage={setCurrentPage} />
            <CModal visible={show} onClose={handleClose} centered className="custom-modal">
                <CModalHeader closeButton>
                    <CModalBody>
                        <p>Are you sure you want to delete this Attribute?</p>
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

export default AttributePage
