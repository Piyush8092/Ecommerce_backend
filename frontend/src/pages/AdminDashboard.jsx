import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UsersSection from '../components/sections/UsersSection';
import ProductsSection from '../components/sections/ProductsSection';
import CarouselSection from '../components/sections/CarouselSection';
import OrdersSection from '../components/sections/OrdersSection';
import BlogsSection from '../components/sections/BlogsSection';
import ContactSection from '../components/sections/ContactSection';
import DeliveryAddressSection from '../components/sections/DeliveryAddressSection';
import CartSection from '../components/sections/CartSection';
import PaymentSection from '../components/sections/PaymentSection';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    setAdminUser(JSON.parse(user));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await axios.get('http://localhost:3000/api/logout', {
        withCredentials: true, // Send cookies with request
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      // Clear cookies manually as fallback
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

      // Redirect to login
      navigate('/admin/login');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UsersSection />;
      case 'products':
        return <ProductsSection />;
      case 'carousel':
        return <CarouselSection />;
      case 'orders':
        return <OrdersSection />;
      case 'blogs':
        return <BlogsSection />;
      case 'contact':
        return <ContactSection />;
      case 'delivery':
        return <DeliveryAddressSection />;
      case 'cart':
        return <CartSection />;
      case 'payments':
        return <PaymentSection />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!adminUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} adminUser={adminUser} />
      <div className="main-content">
        <Header adminUser={adminUser} onLogout={handleLogout} />
        {renderSection()}
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalBlogs: 0,
  });

  useEffect(() => {
    // Fetch statistics
    const fetchStats = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalUsers: 1234,
          totalProducts: 567,
          totalOrders: 890,
          totalBlogs: 45,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="section-header">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <div className="card-icon" style={{ backgroundColor: '#e3f2fd' }}>
            👥
          </div>
          <div className="card-content">
            <h3>Total Users</h3>
            <div className="number">{stats.totalUsers}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-icon" style={{ backgroundColor: '#f3e5f5' }}>
            📦
          </div>
          <div className="card-content">
            <h3>Total Products</h3>
            <div className="number">{stats.totalProducts}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-icon" style={{ backgroundColor: '#e8f5e9' }}>
            🛒
          </div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <div className="number">{stats.totalOrders}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-icon" style={{ backgroundColor: '#fff3e0' }}>
            📝
          </div>
          <div className="card-content">
            <h3>Total Blogs</h3>
            <div className="number">{stats.totalBlogs}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Welcome to Admin Dashboard</h2>
        <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.6' }}>
          Use the sidebar menu to navigate through different sections of the admin panel.
          You can manage users, products, orders, blogs, and more from here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

