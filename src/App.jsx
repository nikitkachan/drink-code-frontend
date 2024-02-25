/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// @ts-nocheck
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authSelectors from './redux/auth/authSelectors';
import SharedLayout from './components/SharedLayout/SharedLayout';
import PublicRoute from './helpers/PublicRoute';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import SignUpPage from './pages/SignUpPage/signUpPage';
import SignInPage from './pages/SignInPage/SignInPage';
import VerificationPage from './pages/VerificationPage/VerificationPage';

import { lazy, useEffect } from 'react';
import { authOperations } from './redux/auth/authOperations';
import { PrivateRoute } from './helpers/PrivateRoute';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage/ErrorPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage/FavoritesPage'));
const AddDrinkPage = lazy(() => import('./pages/AddDrinkPage/AddDrinkPage'));
const DrinksPage = lazy(() => import('./pages/DrinksPage/DrinksPage'));
const MyDrinksPage = lazy(() => import('./pages/MyDrinksPage/MyDrinksPage'));

function App() {
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(location.pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authOperations.currentUser());
    if(!isLoggedIn) {
      navigate("/welcome");
    }

    if (currentPage !== '/' && isLoggedIn) {
      navigate(currentPage);
    }
  }, [dispatch]);

  return (

      <Routes>
        <Route path="/:id" element={<VerificationPage />}/>  
        <Route path="/welcome" element={
            <PublicRoute
              redirectTo="/"
              isLoggedIn={isLoggedIn}
              component={<WelcomePage />}
            />
          }
      />
      
      <Route
        path="/signin"
        element={
          <PublicRoute
            redirectTo="/"
            isLoggedIn={isLoggedIn}
            component={<SignInPage />}
          />
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute
            redirectTo="/"
            isLoggedIn={isLoggedIn}
            component={<SignUpPage />}
          />
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute redirectTo="/welcome" component={<SharedLayout />} />
        }
      >
        <Route
          index
          element={
            <PrivateRoute redirectTo="/welcome" component={<HomePage />} />
          }
        />
        <Route
          path="/drinks"
          element={
            <PrivateRoute redirectTo="/welcome" component={<DrinksPage />} />
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute redirectTo="/welcome" component={<AddDrinkPage />} />
          }
        />
        <Route
          path="/my"
          element={
            <PrivateRoute redirectTo="/welcome" component={<MyDrinksPage />} />
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute redirectTo="/welcome" component={<FavoritesPage />} />
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
export default App;
