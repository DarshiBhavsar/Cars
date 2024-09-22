import {
    CCard, CCardBody, CRow, CCol, CCardTitle, CCardText, CButton, CContainer,
    CDropdown,
    CDropdownItem,
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
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink, Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../../config/config';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../brands/brand.css';
import '../cars/car.css';
import '../car_card/category.css';
import CIcon from '@coreui/icons-react';
import {
    cilContrast,
    cilMenu,
    cilMoon,
    cilSun,
} from '@coreui/icons';
import { cilArrowCircleRight } from '@coreui/icons';
import { AppHeaderDropdown } from '../../components';
import Sidebar from '../../components/sidebar';
import { useDispatch, useSelector } from 'react-redux';

const CategoryPage = () => {
    const headerRef = useRef();
    const navigate = useNavigate();
    const [categories, setCategory] = useState([]);
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { id, name } = location.state || {}; // Get the category ID from the route state
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
    const isCategoryView = !id; // Determine if we're viewing categories or cars

    const dispatch = useDispatch();
    const sidebarShow = useSelector((state) => state.sidebarShow)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            headerRef.current &&
                headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
        })
    }, [])
    useEffect(() => {
        const token = window.localStorage.getItem('token');
        if (isCategoryView) {
            // Fetch categories data if no ID is present
            axios.get(`${BASE_URL}/api/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(result => {
                    // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                    const filteredCategory = result.data.filter(category => category.status === 'Active');
                    setCategory(filteredCategory);
                })
                .catch(err => console.log(err));

        } else {
            // Fetch cars data if ID is present
            axios.get(`${BASE_URL}/api/cars/category/${id}`)
                .then(response => {
                    setCars(response.data);
                    setError(null); // Clear errors if successful
                })
                .catch(error => {
                    setError('Error fetching cars for this category');
                    setCars([]); // Ensure cars is set to an empty array on error
                });
        }
    }, [id, isCategoryView]);

    const settings = {
        dots: true,
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

    return (
        <div className='rounded bg-white'>
            <div className="sidebar d-block d-lg-none">
                <Sidebar />
            </div>
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
                        {/* <CNavItem>
                            <CNavLink>
                                <Link to="/brand_page" className="text-white text text-decoration-none">Brands</Link>
                            </CNavLink>
                        </CNavItem> */}
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
            <div className='main-content1'>
                <div className='inner-content1'>
                </div>
                <h1 className='paragraph1'>Category Page</h1>
                <h2 className='paragraph1' style={{ marginTop: '50px' }}>{name}</h2>
            </div>

            {isCategoryView ? (
                <CRow className="m-4 cars">
                    {categories.length > 0 ? (
                        categories.map((item, index) => (
                            <CCol xs="12" sm="6" md="4" lg="3" key={index} className="mb-4" style={{ cursor: 'pointer' }}>
                                <CCard className="p-0 m-2 car-card" >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                objectFit: 'cover',
                                                backgroundColor: 'black',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    ) : 'No image'}
                                    <CCardBody className='mt-0 card-body1' onClick={() => {
                                        navigate(`/category_page`, { state: { id: item._id } });
                                    }}>
                                        <CCardTitle className='text-center'>{item.name}</CCardTitle>
                                        <CCardText>{item.description}</CCardText>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        ))
                    ) : (
                        <CCol>
                            <p>No Categories Found</p>
                        </CCol>
                    )}
                </CRow>
            ) : (
                <CRow className=" m-4 cars">
                    {cars.length > 0 ? (
                        cars.map((item, index) => (
                            <CCol xs="12" sm="6" md="4" lg="3" key={index} className="mb-4">
                                <CCard className="p-0 m-2 car-card">
                                    <div style={{ display: item.image && item.image.length > 0 ? 'block' : 'none' }}>
                                        <Slider {...settings} style={{ height: '230px', borderRadius: '0px' }}>
                                            {item.image.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Image ${index}`}
                                                    className='car-image1'
                                                />
                                            ))}
                                        </Slider>
                                    </div>
                                    <CCardBody className='mt-0 card-body1'>
                                        <CCardTitle className='text-center'>{item.name}</CCardTitle>
                                        <CCardText className='text-center mt-2'>
                                            <strong>Description:</strong>
                                            {item.description}
                                        </CCardText>

                                        <CCardText className='text-center'>
                                            <strong>Brand: </strong>{item.brand_id.name}
                                        </CCardText>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <CButton className="custom-button mt-3" variant='ghost' onClick={() => {
                                                console.log(item._id);  // Log the _id to the console
                                                navigate(`/single_page`, { state: { id: item._id } });
                                            }}>
                                                Check Out More
                                                <span className='icon'><CIcon size='lg' icon={cilArrowCircleRight} /></span>
                                            </CButton>
                                        </div>

                                    </CCardBody>
                                </CCard>
                            </CCol>
                        ))
                    ) : (
                        <CCol>
                            <p>{error || 'No cars available for this category'}</p>
                        </CCol>
                    )}
                </CRow>
            )}
            <footer className="footer">
                <div className="bg-[#1d1c1c] py-4 py-md-5 py-xl-8  text-white">
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

export default CategoryPage;
