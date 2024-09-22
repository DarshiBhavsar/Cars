import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../../../store/slices/authSlice'
import { useDispatch } from 'react-redux'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const notifySuccess = () => toast.success('Login successful!', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
  const notifyError = () => toast.error('Invalid Credentials', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on typing
  };
  const validateForm = () => {
    const validationErrors = {};
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

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const { email, password } = userData;

      try {
        const response = await dispatch(loginUser({ email, password })).unwrap();

        // Log the role to the console
        console.log('User Role:', response.role);
        // Check the user's role and navigate accordingly
        if (response.role === 'admin') {
          notifySuccess();
          navigate('/'); // Redirect to brands page for admin users
        } else if (response.role === 'user') {
          toast.success('Login successful!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          navigate('/home_page');

        }
      } catch (error) {
        notifyError(); // Handle error response
      }
    }

  };
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
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
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit'>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
