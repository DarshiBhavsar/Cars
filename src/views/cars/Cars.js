import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import {
    CButton,
    CRow,
    CCol,
    CCard,
    CCardImage,
    CCardBody,
    CCardTitle,
    CCardText,
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import '../brands/brand.css'
import '../cars/car.css'
import BASE_URL from '../../config/config';

const CarPage = () => {
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate();
    const [cars, setCar] = useState([]);
    const [show, setShow] = useState(false);  // Modal state
    const [selectedUser, setSelectedUser] = useState(null);  // Selected brand

    // Modal control functions
    const handleClose = () => setShow(false);
    const handleShow = (item) => {
        setSelectedUser(item);  // Set the selected brand object
        setShow(true);  // Show the modal
    };
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
        axios.get(`${BASE_URL}/api/cars`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                // Filter cars and only include those where both the car and the brand are active
                const filteredCar = result.data.filter(car => car.brand_id.status === 'Active' && car.category_id.status === 'Active');
                setCar(filteredCar);
            })
            .catch(err => console.log(err));
    }, []);

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} >
                <SlArrowRight class="arrows" style={{ color: "gray" }} />
            </div>
        )
    }

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} >
                <SlArrowLeft class="arrows" style={{ color: "gray" }} />
            </div>
        )
    }

    const settings = {
        dots: true,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow to="next" />,
        prevArrow: <SamplePrevArrow to="prev" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/api/cars/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                setCar(cars.filter(cars => cars._id !== id)); // Update state after deletion
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
                onClick={() => navigate('/createcars')}
            >
                Add Car
            </CButton>
            {/* <CTable hover responsive className="mt-4" bordered>
                <CTableHead color="white">
                    <CTableRow>
                        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {cars.length > 0 ? (
                        cars.map((item, index) => (
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
                                                backgroundColor: 'black',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    ) : 'No image'}
                                </CTableDataCell>
                                <CTableDataCell>{item.name}</CTableDataCell>
                                <CTableDataCell>{item.description}</CTableDataCell>
                                <CTableDataCell>{item.status}</CTableDataCell>
                                <CTableDataCell>{item.brand_id.name}</CTableDataCell>
                                <CTableDataCell>{item.category_id.name}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" size="sm" onClick={() => navigate(`/update_car`, { state: { id: item._id } })}>
                                        Update
                                    </CButton>
                                    <CButton color="danger" size="sm" className="mx-2" onClick={() => handleShow(item)}>
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center">
                                No Cars Found
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>
            </CTable> */}
            <CRow className="mt-4" >
                {cars.length > 0 ? (
                    cars.map((item, index) => (
                        <CCol xs="12" sm="6" md="4" lg="3" key={index} className="mb-4">
                            <CCard className="p-0 cars-card">
                                <div style={{ display: item.image && item.image.length > 0 ? 'block' : 'none' }}>
                                    <Slider {...settings} style={{ height: '230px', borderRadius: '0px' }}>
                                        {item.image.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Image ${index}`}
                                                className='car-image'
                                            />
                                        ))}
                                    </Slider>
                                </div>
                                <CCardBody style={{ backgroundColor: '#FAFAFB' }}>
                                    <CCardText className='mb-3'><strong>Name: </strong>{item.name}</CCardText>
                                    <CCardText>
                                        <strong>Description: </strong>
                                        {item.description}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Status: </strong>{item.status}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Brand: </strong>{item.brand_id.name}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Category: </strong>{item.category_id.name}
                                    </CCardText>
                                    <CButton className='update' size="sm" onClick={() => navigate(`/update_car`, { state: { id: item._id } })}>
                                        Update
                                    </CButton>
                                    <CButton size="sm" className="delete mx-2" onClick={() => handleShow(item)}>
                                        Delete
                                    </CButton>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))
                ) : (
                    <CCol>
                        <p>No Cars Found</p>
                    </CCol>
                )}
            </CRow>
            {/* <CRow className="mt-4">
                {cars.length > 0 ? (
                    cars.map((item, index) => (
                        <CCol xs="12" sm="6" md="4" lg="3" key={index} className="mb-4">
                            <CCard className="h-100 p-0">
                                <div style={{ display: item.image && item.image.length > 0 ? 'block' : 'none' }}>
                                    <Slider {...settings} style={{ borderRadius: '20px' }}>
                                        {item.image.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Image ${index}`}
                                                className='car-image'
                                            />
                                        ))}
                                    </Slider>
                                </div>
                                <CCardBody>
                                    <CCardTitle><strong>Name:</strong>{item.name}</CCardTitle>
                                    <CCardText>
                                        <strong>Description:</strong>
                                        {item.description}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Status: </strong>{item.status}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Brand: </strong>{item.brand_id.name}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Category: </strong>{item.category_id.name}
                                    </CCardText>
                                    <CButton color="info" size="sm" onClick={() => navigate(`/update_car`, { state: { id: item._id } })}>
                                        Update
                                    </CButton>
                                    <CButton color="danger" size="sm" className="mx-2" onClick={() => handleShow(item)}>
                                        Delete
                                    </CButton>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))
                ) : (
                    <CCol>
                        <p>No Cars Found</p>
                    </CCol>
                )}
            </CRow> */}
            <CModal visible={show} onClose={handleClose} centered className="custom-modal">
                <CModalHeader closeButton>
                    <CModalBody>
                        <p>Are you sure you want to delete this Car?</p>
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
            <ToastContainer />
        </div>

    )
}

export default CarPage
