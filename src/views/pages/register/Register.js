import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CInputGroup,
  CInputGroupText,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CContainer
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../../store/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../config/config';

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const notify = () => toast.success('Register  successfully!', {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });


  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on typing
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!userData.userName.trim()) validationErrors.userName = 'Name is required';
    if (!userData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      validationErrors.email = "Email is not valid";
    }
    if (!userData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (userData.password.length < 8) {
      validationErrors.password = "Password should be at least 8 characters";
    }
    if (!userData.confirmPassword.trim()) validationErrors.confirmPassword = 'Confirm Password is required';
    if (userData.password !== userData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const { userName, email, password, confirmPassword } = userData; // Extract from userData

      try {
        // Dispatch the async thunk action to handle the registration process
        dispatch(signUpUser({ userName, email, password, confirmPassword }))
          .unwrap() // Unwrap the result to handle fulfilled or rejected states
          .then(() => {
            // Remove any existing token from local storage (optional)
            localStorage.removeItem('token');

            // Show a success notification (optional)
            notify();

            // Redirect to the login page after successful registration
            navigate('/login');
          })
          .catch((error) => {
            // Handle error response, log or show error to the user
            console.log("Registration failed:", error);
          });
      } catch (error) {
        console.log("Unexpected error:", error);
      }
    }

  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <div className='mb-3'>
                    <CInputGroup className="mb-0">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="userName"
                        placeholder="Enter your name"
                        value={userData.userName}
                        onChange={handleInputChange}

                      />
                    </CInputGroup>
                    {errors.userName && <p className="text-danger">{errors.userName}</p>}
                  </div>
                  <div className='mb-3'>
                    <CInputGroup className="mb-0">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={userData.email}
                        onChange={handleInputChange}

                      />
                    </CInputGroup>
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                  </div>
                  <div className='mb-3'>
                    <CInputGroup className="mb-0">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={userData.password}
                        onChange={handleInputChange}

                      />
                    </CInputGroup>
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                  </div>
                  <div className='mb-3'>
                    <CInputGroup className="mb-0">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}

                      />
                    </CInputGroup>
                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                  </div>

                  <div className="d-grid">
                    <CButton color="success" type="submit" >
                      Submit
                    </CButton>
                  </div>

                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
          {/* <ToastContainer /> */}
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
