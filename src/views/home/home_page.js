import {
    CContainer,
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
    CCard,
    CRow,
    CCol,
    CCardBody,
    CCardTitle,
    CFormInput,
    CButton
} from '@coreui/react';
import React, { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import '../home/home.css'
import {
    cilContrast,
    cilMenu,
    cilMoon,
    cilSun,
} from '@coreui/icons'
import { AppBreadcrumb, AppHeaderDropdown, AppSidebar } from '../../components';
import CarCard from '../car_card/car_card';
import axios from 'axios';
import BASE_URL from '../../config/config';
import BrandCard from '../car_card/brand_card';
import Sidebar from '../../components/sidebar';


const HomePage = () => {
    const [categories, setCategory] = useState([])
    const headerRef = useRef()
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const navigate = useNavigate();

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
    }, []);



    return (
        <div className='bg-[#F7F7F7]'>
            <div className="sidebar d-block d-lg-none">
                <Sidebar />
            </div>
            <div className='main-content'>
                <CHeader position="sticky" className="p-0 mb-0" style={{
                    border: 'none',
                    // backgroundColor: '#212631',
                    backgroundColor: 'transparent',
                    padding: '0',
                    marginBottom: '16px'
                }} ref={headerRef}>
                    <CContainer className="px-4" fluid>
                        <CHeaderToggler className='text-white'
                            onClick={() => {
                                dispatch({ type: 'set', sidebarShow: !sidebarShow });
                                console.log("Sidebar toggle clicked", !sidebarShow); // Check if it's being triggered
                            }}
                            style={{ marginInlineStart: '-14px' }}
                        >
                            <CIcon icon={cilMenu} size="lg" className=' d-block d-lg-none' />
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
                                <div className="vr h-100 mx-2 text-body text-opacity-75 "></div>
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
                <div className='inner-content'>
                </div>

            </div>
            <h1 className='paragraph'>We are India's #1 Auto Portal Website for Cars.</h1>
            <h2 className='paragraph' style={{ marginTop: '50px' }}>Thank You For Visit.</h2>
            <CarCard />

            <div className='image bg-white'>
                <img src='https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Creta/Interior/pc/Hyundai-creta-suv-interior-big-top-1600x580-1.jpg' width={'100%'}></img>
            </div>

            <CRow className="m-4 cars bg-white p-2  rounded">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='m-3'>Categories</h4>
                    <h6 className="show-more mb-0" onClick={() => navigate('/category_page')}>Show more</h6>
                </div>

                {categories.length > 0 ? (
                    categories.slice(0, 4).map((item, index) => (
                        <CCol xs="12" sm="6" md="4" lg="3" key={index} className="mb-4" style={{ cursor: 'pointer' }}>
                            <CCard className="p-0 m-2 category-card">
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
                                    console.log(item._id);  // Log the _id to the console
                                    navigate(`/category_page`, { state: { id: item._id, name: item.name } });
                                }}>
                                    <CCardTitle className='text-center'>{item.name}</CCardTitle>

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

            <div className='image bg-white'>
                <img src='https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/Thar-ROXX/8438/1723692413550/rear-right-side-48.jpg' width={'100%'}></img>
            </div>

            <div class="center-content">
                <h1>Find The Best Car for You</h1>
                <span>We are here to give you perfect reviews and price and range for your cars.</span>
                <div class="form-container">
                    <CFormInput type="email" name="" value="" placeholder="example@gmail.com" class="input-field"></CFormInput>
                    <CButton type="submit" class="subBtn">Subscribe Us</CButton>
                </div>
            </div>

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
                                    <li><Link to="/home_page" className="text-white">Home</Link></li>
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
        </div >
    )
}

export default HomePage
