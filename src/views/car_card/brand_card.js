import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import { CCard, CCol, CRow, CSpinner } from '@coreui/react';
import '../car_card/brand_card.css';
import { useNavigate } from 'react-router-dom';

const BrandCard = () => {
    const navigate = useNavigate();
    const [brand, setBrand] = useState([]);
    const [loading, setLoading] = useState(true); // State for the loader

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/api/brands`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(result => {
                const filteredBrands = result.data.filter(brand => brand.status === 'Active');
                setBrand(filteredBrands);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch(err => {
                console.log(err);
                setLoading(false); // Set loading to false in case of an error
            });
    }, []);

    return (
        <div className="brandcontent">
            <CRow className="m-0">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='m-3'>Brands</h4>
                </div>

                {/* Loader Section */}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                        <CSpinner color="primary" />
                    </div>
                ) : brand.length > 0 ? (
                    brand.map((item, index) => (
                        <CCol xs="12" sm="4" md="4" lg="2" key={index} className="mb-4" style={{ cursor: 'pointer' }}>
                            <CCard className="p-3 m-0 brand_cards" onClick={() => {
                                console.log(item._id);  // Log the _id to the console
                                navigate(`/brand_page`, { state: { id: item._id, name: item.name } });
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
