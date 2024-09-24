import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';
import Pagination from '../pagination/pagination';

const BrandPage = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const [brand, setBrand] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);  // Modal state
    const [selectedUser, setSelectedUser] = useState(null);  // Selected brand

    // Modal control functions
    const handleClose = () => setShow(false);
    const handleShow = (item) => {
        setSelectedUser(item);  // Set the selected brand object
        setShow(true);  // Show the modal
    };
    const [currentPage, setCurrentPage] = useState(1);
    const postPerPage = 5;
    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    const currentPost = brand.slice(firstPostIndex, lastPostIndex);
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
        const token = window.localStorage.getItem('token');
        setIsLoading(true);
        if (token) { // Ensure the token is available
            axios.get(`${BASE_URL}/api/brands`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(result => { setBrand(result.data); setIsLoading(false); })
                .catch(err => console.log(err));
        } else {
            console.log('No token found');
        }
    }, [token, BASE_URL]);

    // Delete brand
    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/api/brands/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                setBrand(brand.filter(brand => brand._id !== id)); // Update state after deletion
                notify();
                handleClose();  // Close the modal
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            {/* Add Brand Button */}
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
                onClick={() => navigate('/createbrands')}
            >
                Add Brand
            </CButton>
            {isLoading ? ( // Show spinner if isLoading is true
                <div className="text-center mt-4">
                    <CSpinner color="primary" />
                </div>
            ) :
                (
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
                                    <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentPost.length > 0 ? (
                                    currentPost.map((item, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '50%',
                                                            // backgroundColor: 'black',
                                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                                        }}
                                                    />
                                                ) : 'No image'}
                                            </CTableDataCell>
                                            <CTableDataCell>{item.name}</CTableDataCell>
                                            <CTableDataCell>{item.description}</CTableDataCell>
                                            <CTableDataCell>{item.status}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton className='update' size="sm" onClick={() => navigate(`/update_brand`, { state: { id: item._id } })}>
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
                                            No Brands Found
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                        <Pagination totalPost={brand.length} postPerPage={postPerPage} setCurrentPage={setCurrentPage} />
                    </div>
                )}



            {/* Delete Confirmation Modal */}
            <CModal visible={show} onClose={handleClose} centered className="custom-modal">
                <CModalHeader closeButton>
                    <CModalBody>
                        <p>Are you sure you want to delete this brand?</p>
                    </CModalBody>
                </CModalHeader>
                <CModalFooter>
                    <CButton className="No" onClick={handleClose}>
                        NO
                    </CButton>
                    <CButton className="Yes" onClick={() => handleDelete(selectedUser?._id)}>
                        Yes
                    </CButton>

                </CModalFooter>
            </CModal>

            {/* Toast Container for notifications */}
        </div>
    );
}

export default BrandPage;
