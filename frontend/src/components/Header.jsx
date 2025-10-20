import React from 'react';

const Header = ({ adminUser, onLogout }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="header">
      <div>
        <h1>Admin Dashboard</h1>
      </div>
      <div className="user-profile">
        <div className="user-avatar">{getInitials(adminUser?.name || 'A')}</div>
        <div>
          <div style={{ fontWeight: '600', color: '#333' }}>{adminUser?.name}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{adminUser?.email}</div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;

