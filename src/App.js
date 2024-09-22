import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import PrivateRoute from './routes/privateRoute'
import GuestRoute from './routes/guestRoute'
// import { addToken } from './store/slices/authSlice'
import HomePage from './views/home/home_page'
import Unauthorized from './views/unauthorized/unauthorized'
import Login from './views/pages/login/Login'
import CategoryPage from './views/car_card/category_page'
import BrandPage from './views/brands/Brand'
import Brands from './views/car_card/brand_page'
import CarSinglePage from './views/car_card/car_Single_Page'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  // const dispatch = useDispatch();


  // useEffect(() => {
  //   dispatch(addToken(localStorage.getItem('token')));
  // }, [dispatch]);

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route element={<GuestRoute />}>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />

          </Route>
          {/* <Route>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route> */}
          <Route exact path="/home_page" element={<HomePage />} />
          <Route exact path="/unauthorized" element={<Unauthorized />} />
          <Route exact path="/category_page" element={<CategoryPage />} />
          <Route exact path="/brand_page" element={<Brands />} />
          <Route exact path="/single_page" element={<CarSinglePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
