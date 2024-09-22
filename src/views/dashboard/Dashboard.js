import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import '../dashboard/dashboard.css';

const Dashboard = () => {
  const [brandCount, setBrandCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [tagsCount, setTagsCount] = useState(0);
  const [carCount, setCarCount] = useState(0)
  const [variantCount, setVariantCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [attributeCount, setAttributeCount] = useState(0);

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
    fetchData('api/brands/count', setBrandCount);
    fetchData('api/categories/count', setCategoryCount);
    fetchData('api/cars/count', setCarCount); // Assuming you have an endpoint for tags count
    fetchData('api/variants/count', setVariantCount); // Endpoint for variants count
    fetchData('api/vehicles/count', setVehicleCount); // Endpoint for vehicles count
    fetchData('api/attributes/count', setAttributeCount); // Endpoint for attributes count
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="card-header1">
          <h1 className="card-title1">Brand</h1>
          <p className="card-content1">Count: {brandCount}</p>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card-header1">
          <h1 className="card-title1">Category</h1>
          <p className="card-content1">Count: {categoryCount}</p>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card-header1">
          <h1 className="card-title1">Cars</h1>
          <p className="card-content1">Count: {carCount}</p>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card-header1">
          <h1 className="card-title1">Variant</h1>
          <p className="card-content1">Count: {variantCount}</p>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card-header1">
          <h1 className="card-title1">Vehicle</h1>
          <p className="card-content1">Count: {vehicleCount}</p>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card-header1">
          <h1 className="card-title1">Attribute</h1>
          <p className="card-content1">Count: {attributeCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
