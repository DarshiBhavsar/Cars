import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CRow, CCol, CCardTitle, CButton, CSpinner } from '@coreui/react';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import BASE_URL from '../../config/config';
import '../car_card/car_card.css';
import { cilArrowCircleRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import BrandCard from './brand_card';
import { useNavigate } from 'react-router-dom';

const CarCard = () => {
    const navigate = useNavigate();
    const [car, setCar] = useState([]);
    const [loading, setLoading] = useState(true); // State for the loader

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`}>
                <SlArrowRight className="arrows" style={{ color: "gray" }} />
            </div>
        );
    }

    const SamplePrevArrow = (props) => {
        const { className, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`}>
                <SlArrowLeft className="arrows" style={{ color: "gray" }} />
            </div>
        );
    };

    const settings = {
        dots: true,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
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
        const token = window.localStorage.getItem('token');
        setLoading(true);
        axios.get(`${BASE_URL}/api/cars`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => {
                const filteredCars = result.data.filter(car => car.status === 'Active');
                setCar(filteredCars);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch(err => {
                console.log(err);
                setLoading(false); // Set loading to false in case of an error
            });
    }, []);

    return (
        <div className='mt-5 bg-white p-2 m-4 rounded' style={{ cursor: 'pointer' }}>
            <CRow className="m-4 cars">
                <h4 className='top-selling'>Top Selling Cars</h4>

                {/* Loader Section */}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                        <CSpinner color="primary" size="lg" />
                    </div>
                ) : car.length > 0 ? (
                    car.map((item, index) => (
                        <CCol xs="12" sm="6" md="4" lg="3" key={index} className="mb-4">
                            <CCard className="p-0 m-2 car-card">
                                {item.image && item.image.length > 0 && (
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
                                )}
                                <CCardBody className='mt-0 card-body1'>
                                    <CCardTitle className='text-center'>{item.name}</CCardTitle>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <CButton
                                            className="custom-button mt-3"
                                            variant='ghost'
                                            onClick={() => navigate(`/single_page`, { state: { id: item._id } })}
                                        >
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
                        <p>No Cars Found</p>
                    </CCol>
                )}
            </CRow>
            <BrandCard />
        </div>
    );
};

export default CarCard;
