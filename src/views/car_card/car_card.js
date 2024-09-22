import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CRow, CCol, CCardTitle, CCardText, CButton } from '@coreui/react';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import BASE_URL from '../../config/config';
import '../car_card/car_card.css'
import { cilArrowCircleRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import BrandCard from './brand_card';
import { useNavigate } from 'react-router-dom';

const CarCard = () => {
    const navigate = useNavigate()
    const [car, setCar] = useState([])
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
        axios.get(`${BASE_URL}/api/cars`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => {
                // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                const filteredCars = result.data.filter(cars => cars.status === 'Active');
                setCar(filteredCars);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='mt-5 bg-white p-2 m-4 rounded' style={{ cursor: 'pointer' }}>
            <CRow className="m-4 cars">
                <h4 className='top-selling'>Top Selling Cars</h4>
                {car.length > 0 ? (
                    car.map((item, index) => (
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
                                    {/* <CCardText>
                                        <strong>Description:</strong>
                                        {item.description}
                                    </CCardText> */}

                                    {/* <CCardText>
                                        <strong>Brand: </strong>{item.brand_id.name}
                                    </CCardText> */}
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
                        <p>No Cars Found</p>
                    </CCol>
                )}
            </CRow>
            <BrandCard />
        </div>

    );
}

export default CarCard;
