import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import { CSpinner } from '@coreui/react';
import '../dashboard/dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate()
  const [brandCount, setBrandCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [variantCount, setVariantCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [attributeCount, setAttributeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Common function to fetch data
  const fetchData = async (endpoint, setState) => {
    try {
      const token = window.localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setState(response.data.count);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true); // Set loading to true before fetching data

      await Promise.all([
        fetchData('api/brands/count', setBrandCount),
        fetchData('api/categories/count', setCategoryCount),
        fetchData('api/cars/count', setCarCount),
        fetchData('api/variants/count', setVariantCount),
        fetchData('api/vehicles/count', setVehicleCount),
        fetchData('api/attributes/count', setAttributeCount)
      ]);

      setIsLoading(false); // Set loading to false after fetching all data
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      {isLoading ? ( // Show spinner if isLoading is true
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" size="lg" />
        </div>
      ) : (
        <>
          {/* Brand Card */}
          <div className="dashboard-card" onClick={() => navigate('/brands')}>
            <div className="card-header1">
              <h1 className="card-title1">Brand</h1>
              <p className="card-content1">Count: {brandCount}</p>
            </div>
          </div>

          {/* Category Card */}
          <div className="dashboard-card" onClick={() => navigate('/category')}>
            <div className="card-header1">
              <h1 className="card-title1">Category</h1>
              <p className="card-content1">Count: {categoryCount}</p>
            </div>
          </div>

          {/* Cars Card */}
          <div className="dashboard-card" onClick={() => navigate('/cars')}>
            <div className="card-header1">
              <h1 className="card-title1">Cars</h1>
              <p className="card-content1">Count: {carCount}</p>
            </div>
          </div>

          {/* Variant Card */}
          <div className="dashboard-card" onClick={() => navigate('/variant')}>
            <div className="card-header1">
              <h1 className="card-title1">Variant</h1>
              <p className="card-content1">Count: {variantCount}</p>
            </div>
          </div>

          {/* Vehicle Card */}
          <div className="dashboard-card" onClick={() => navigate('/vehicles')}>
            <div className="card-header1">
              <h1 className="card-title1">Vehicle</h1>
              <p className="card-content1">Count: {vehicleCount}</p>
            </div>
          </div>

          {/* Attribute Card */}
          <div className="dashboard-card" onClick={() => navigate('/attributes')}>
            <div className="card-header1">
              <h1 className="card-title1">Attribute</h1>
              <p className="card-content1">Count: {attributeCount}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
