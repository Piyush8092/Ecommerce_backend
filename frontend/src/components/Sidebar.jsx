import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, adminUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'carousel', label: 'Carousel', icon: '🎠' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'blogs', label: 'Blogs', icon: '📝' },
    { id: 'contact', label: 'Contact Messages', icon: '💬' },
    { id: 'delivery', label: 'Delivery Address', icon: '📍' },
    { id: 'cart', label: 'Cart', icon: '🛍️' },
  ];

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <div className="sidebar-role">Role: {adminUser?.role || 'ADMIN'}</div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.id);
              }}
              className={activeSection === item.id ? 'active' : ''}
            >
              <span style={{ marginRight: '10px' }}>{item.icon}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

