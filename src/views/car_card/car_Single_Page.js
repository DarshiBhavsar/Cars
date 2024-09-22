import React, { useEffect, useRef, useState } from 'react';
import {
    CCard, CCardBody, CRow, CCol, CCardTitle, CCardText, CButton, CContainer,
    CDropdown,
    CDropdownItem,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CDropdownMenu,
    CDropdownToggle,
    CHeaderToggler,
    CNavItem,
    CNavLink,
    CHeader,
    CHeaderNav,
    useColorModes,
} from '@coreui/react';
import axios from 'axios';
import { useLocation, NavLink, Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../../config/config';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../car_card/singlePage.css'
import CIcon from '@coreui/icons-react';
import {
    cilArrowLeft,
    cilContrast,
    cilMenu,
    cilMoon,
    cilSun,
} from '@coreui/icons';
import { cilArrowCircleRight } from '@coreui/icons';
import { AppHeaderDropdown } from '../../components';
import { useSelector } from 'react-redux';
const CarSinglePage = () => {
    const navigate = useNavigate()
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    const { id } = location.state || {};
    const headerRef = useRef();
    const [cars, setCars] = useState({});
    const [variants, setVariants] = useState([]);
    const [currentImage, setCurrentImage] = useState('');
    const [error, setError] = useState(null);
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
    const handleThumbnailClick = (img) => {
        setCurrentImage(img);
    };

    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
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

    useEffect(() => {
        if (id) {
            window.scrollTo(0, 0);
            axios.get(`${BASE_URL}/api/cars/details/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    status: 'Active' // Add the status filter here
                }
            })
                .then(response => {
                    const { car, variants } = response.data;
                    setCars(car);
                    setVariants(variants);
                    setCurrentImage(car.image[0]);
                    setError(null); // Clear errors if successful
                })
                .catch(error => {
                    setError('Error fetching car details');
                    setCars({});
                    setVariants([]);
                });
        }
    }, [id, token]);


    return (
        <div>
            <CHeader position="sticky" className="p-0 mb-0" style={{
                border: 'none',
                backgroundColor: '#212631',
                padding: '0',
                marginBottom: '16px'
            }} ref={headerRef}>
                <CContainer className="px-4" fluid>
                    <CHeaderToggler className='text-white'
                        onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
                        style={{ marginInlineStart: '-14px' }}
                    >
                        <CIcon icon={cilMenu} size="lg" className='d-lg-none' />
                    </CHeaderToggler>
                    <CHeaderNav className="d-none d-md-flex">
                        <CNavItem>
                            <CNavLink to="" className='text-white dashboard' as={NavLink}>
                                Automotive
                            </CNavLink>
                        </CNavItem>
                    </CHeaderNav>
                    <CHeaderNav className="ms-auto">
                        <CNavItem>
                            <CNavLink>
                                <Link to="/home_page" className="text-white text text-decoration-none">Home</Link>
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            {/* <CNavLink>
                                <Link to="/brand_page" className="text-white text text-decoration-none">Brands</Link>
                            </CNavLink> */}
                        </CNavItem>
                        <CNavItem>
                            <CNavLink>
                                <Link to="/category_page" className="text-white text text-decoration-none">Category</Link>
                            </CNavLink>
                        </CNavItem>
                    </CHeaderNav>
                    <CHeaderNav>
                        <li className="nav-item py-1">
                            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
                        </li>
                        <CDropdown variant="nav-item" style={{ color: '#e0e0e0' }} placement="bottom-end">
                            <CDropdownToggle caret={false}>
                                {colorMode === 'dark' ? (
                                    <CIcon icon={cilMoon} size="lg" />
                                ) : colorMode === 'auto' ? (
                                    <CIcon icon={cilContrast} size="lg" />
                                ) : (
                                    <CIcon icon={cilSun} size="lg" />
                                )}
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem
                                    active={colorMode === 'light'}
                                    className="d-flex align-items-center"
                                    as="button"
                                    type="button"
                                    onClick={() => setColorMode('light')}
                                >
                                    <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                                </CDropdownItem>
                                <CDropdownItem
                                    active={colorMode === 'dark'}
                                    className="d-flex align-items-center"
                                    as="button"
                                    type="button"
                                    onClick={() => setColorMode('dark')}
                                >
                                    <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                                </CDropdownItem>
                                <CDropdownItem
                                    active={colorMode === 'auto'}
                                    className="d-flex align-items-center"
                                    as="button"
                                    type="button"
                                    onClick={() => setColorMode('auto')}
                                >
                                    <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                                </CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                        <li className="nav-item py-1">
                            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
                        </li>
                        <AppHeaderDropdown />
                    </CHeaderNav>
                </CContainer>
            </CHeader>
            <div
                className='back-button d-flex align-items-center mb-4 gap-2 fs-5'
                onClick={() => navigate('/home_page')}
            >
                <CIcon icon={cilArrowLeft} className='me-2' size='xl' />
                <p>Back</p>
            </div>

            <CContainer fluid>
                {/* Car Images Section */}

                <CRow className="mb-4">
                    <CCol xs="12" sm="12" md="6" lg='12'>
                        <CCard className="p-4">
                            <CCardBody>
                                <CCardText><strong>Name: </strong>{cars.name || 'Not Available'}</CCardText>
                                {/* <CCardText><strong>Brand: </strong>{cars.brand_id?.name || 'Not Available'}</CCardText> */}
                                <CCardText><strong>Description: </strong>{cars.description || 'Not Available'}</CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

                <CRow className="my-3">
                    <CCol xs="12" md="8">
                        <CCard>
                            <div className="main-image-container">
                                <div {...settings} className="main-image-slider">
                                    <img src={currentImage} alt="Main Car" className="main-image" />
                                </div>
                            </div>
                        </CCard>
                    </CCol>
                    <CCol xs="12" md="4">
                        <CCard className="p-4">
                            <div className="thumbnail-container">
                                {cars.image && Array.isArray(cars.image) && cars.image.length > 0 ? (
                                    cars.image.map((img, index) => (
                                        <div
                                            key={index}
                                            className="thumbnail-item"
                                            onClick={() => handleThumbnailClick(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index}`}
                                                className="thumbnail-image"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p>No images available</p>
                                )}
                            </div>
                        </CCard>
                    </CCol>
                </CRow>


                {/* Car Overview Section */}


                {/* Variants Section */}
                <CRow className="mb-4">
                    <CCol xs="12">
                        <CCard className="p-4">
                            <CCardBody>
                                <h3 className="text-center">Available Variants</h3>
                                {variants.length > 0 ? (
                                    <CTable hover responsive className="mt-4" bordered>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>Variant Name</CTableHeaderCell>
                                                <CTableHeaderCell>Year</CTableHeaderCell>
                                                <CTableHeaderCell>Description</CTableHeaderCell>
                                                <CTableHeaderCell>Fuel Type</CTableHeaderCell>
                                                <CTableHeaderCell>Available Colors</CTableHeaderCell>
                                                <CTableHeaderCell>Transmission</CTableHeaderCell>
                                                <CTableHeaderCell>Price</CTableHeaderCell>

                                            </CTableRow>
                                        </CTableHead>

                                        <CTableBody>
                                            {variants.map((variant, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>{variant.variant.name || 'Not Available'}</CTableDataCell>
                                                    <CTableDataCell>{variant.vehicleModel?.name || 'Not Available'}</CTableDataCell>
                                                    <CTableDataCell>{variant.variant.description || 'Not Available'}</CTableDataCell>
                                                    <CTableDataCell>{variant.fuelType || 'N/A'}</CTableDataCell>
                                                    <CTableDataCell>{variant.colorOptions?.join(', ') || 'N/A'}</CTableDataCell>
                                                    <CTableDataCell>{variant.transmissionOptions?.join(', ') || 'N/A'}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {variant.vehicleModel?.price ? <><span>₹</span>{variant.vehicleModel.price}</> : 'Not Available'}
                                                    </CTableDataCell>


                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                ) : (
                                    <p>No variants available</p>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>

            <footer className="footer">
                <div className="bg-[#1d1c1c] py-4 py-md-5 py-xl-8 text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <h5>About Foodhub</h5>
                                <p>Foodhub is your go-to platform for discovering new recipes, cooking tips, and culinary inspiration. Whether you're a seasoned chef or just starting, we've got something delicious for you.</p>
                            </div>
                            <div className="col-md-4">
                                <h5>Quick Links</h5>
                                <ul className="list-unstyled">
                                    <li><Link to="home_page" className="text-white">Home</Link></li>
                                    <li><Link to="/category_page" className="text-white">Categories</Link></li>
                                    <li><Link to="/brand_page" className="text-white">Brands</Link></li>
                                    <li><a href="#contact" className="text-white">Contact Us</a></li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <h5>Subscribe to Our Newsletter</h5>
                                <p>Get the latest recipes and culinary tips straight to your inbox. Sign up today!</p>
                                <form>
                                    <input type="email" placeholder="Enter your email" className="form-control mb-2" />
                                    <button type="submit" className="btn btn-primary">Subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-dark py-2">
                    <div className="container text-center">
                        <p className="mb-0 text-white">&copy; 2024 Foodhub. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default CarSinglePage;
