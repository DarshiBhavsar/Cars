import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';
import { CCard, CCol, CRow, CButton } from '@coreui/react';
import '../car_card/brand_card.css';
import { useNavigate } from 'react-router-dom';

const BrandCard = () => {
    const navigate = useNavigate();
    const [brand, setBrand] = useState([]);

    // Fetch brands from the API
    useEffect(() => {
        const token = window.localStorage.getItem('token');
        if (token) {
            axios.get(`${BASE_URL}/api/brands`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(result => {
                    // Filter brands on the frontend to exclude 'inactive' and 'draft' statuses
                    const filteredBrands = result.data.filter(brand => brand.status === 'Active');
                    setBrand(filteredBrands);
                })
                .catch(err => console.log(err));
        } else {
            console.log('No token found');
        }
    }, [token]);

    return (
        <div className="brandcontent">
            <CRow className="m-0">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='m-3'>Brands</h4>
                    <h6 className="show-more mb-0" onClick={() => navigate('/category_page')}>Show more</h6>
                </div>

                {brand.length > 0 ? (
                    brand.map((item, index) => (
                        <CCol xs="12" sm="4" md="4" lg="2" key={index} className="mb-4" style={{ cursor: 'pointer' }}>
                            <CCard className="p-3 m-0 brand_cards" onClick={() => {
                                console.log(item._id);  // Log the _id to the console
                                navigate(`/brand_page`, { state: { id: item._id, name: item.name, } });
                            }}>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            objectFit: 'contain',
                                            height: '60px'
                                        }}
                                    />
                                ) : 'No image'}
                            </CCard>
                        </CCol>
                    ))
                ) : (
                    <CCol>
                        <p>No Active Brands Found</p>
                    </CCol>
                )}
            </CRow>
        </div>
    );
};

export default BrandCard;
