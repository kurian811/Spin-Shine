import React from 'react';
import { useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import SubmitLaundry from './components/SubmitLaundry';
import LaundryStatus from './components/LaundryStatus';
import ChooseLaundry from './components/ChooseLaundry';
import AdminDashboard from './components/AdminDashboard';
import EditUsers from './components/EditUsers';
import LaundryStatusUpdate from './components/LaundryStatusUpdate';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const App = () => {
  const location = useLocation();

  // Logic to hide NavBar and Footer on AdminDashboard route
  const hideNavBarRoutes = ['/Login', '/Signup', '/AdminDashboard', '/forgot-password'];
  const showNavBar = !hideNavBarRoutes.includes(location.pathname);

  const hideFooterRoutes = ['/AdminDashboard', '/forgot-password', '/reset-password/:token'];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        <Route path="/Profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/SubmitLaundry" element={<SubmitLaundry />} />
        <Route path="/LaundryStatus" element={<LaundryStatus />} />
        <Route path="/Choose" element={<ChooseLaundry />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/EditUsers" element={<EditUsers />} />
        <Route path="/LaundryStatusUpdate" element={<LaundryStatusUpdate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
      {showFooter && <Footer />}
    </>
  );
};

const RootApp = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default RootApp;
