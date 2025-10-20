import React, { useState, useEffect } from 'react';
import { deliveryAddressAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const DeliveryAddressSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [viewingAddress, setViewingAddress] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [pinCodeFilter, setPinCodeFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    optionalPhoneNo: '',
    Address: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await deliveryAddressAPI.getAll();
      setAddresses(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch delivery addresses');
      console.error(err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name || '',
        email: address.email || '',
        phoneNo: address.phoneNo || '',
        optionalPhoneNo: address.optionalPhoneNo || '',
        Address: address.Address || '',
        landmark: address.landmark || '',
        city: address.city || '',
        state: address.state || '',
        zip: address.zip || '',
      });
    } else {
      setEditingAddress(null);
      setFormData({
        name: '',
        email: '',
        phoneNo: '',
        optionalPhoneNo: '',
        Address: '',
        landmark: '',
        city: '',
        state: '',
        zip: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleViewAddress = (address) => {
    setViewingAddress(address);
  };

  const handleCloseViewModal = () => {
    setViewingAddress(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await deliveryAddressAPI.update(editingAddress._id, formData);
      } else {
        await deliveryAddressAPI.create(formData);
      }
      fetchAddresses();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save delivery address');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deliveryAddressAPI.delete(id);
        fetchAddresses();
      } catch (err) {
        setError('Failed to delete delivery address');
        console.error(err);
      }
    }
  };

  // Get unique cities and pin codes for filter dropdowns
  const uniqueCities = Array.from(new Set(addresses.map(addr => addr.city).filter(Boolean)));
  const uniquePinCodes = Array.from(new Set(addresses.map(addr => addr.zip?.toString()).filter(Boolean)));
  const uniqueNames = Array.from(new Set(addresses.map(addr => addr.name).filter(Boolean)));

  const filteredAddresses = Array.isArray(addresses) ? addresses.filter(
    (address) => {
      const matchesSearch =
        address.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.zip?.toString().toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = cityFilter === 'all' || address.city === cityFilter;
      const matchesPinCode = pinCodeFilter === 'all' || address.zip?.toString() === pinCodeFilter;
      const matchesName = nameFilter === 'all' || address.name === nameFilter;

      return matchesSearch && matchesCity && matchesPinCode && matchesName;
    }
  ) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Delivery Addresses</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add New Address
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name, city, or PIN code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-group">
          <label>Filter by Name:</label>
          <select
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Names</option>
            {uniqueNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by City:</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by PIN Code:</label>
          <select
            value={pinCodeFilter}
            onChange={(e) => setPinCodeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All PIN Codes</option>
            {uniquePinCodes.map((pinCode) => (
              <option key={pinCode} value={pinCode}>
                {pinCode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAddresses.map((address) => (
                <tr key={address._id}>
                  <td>{address.name}</td>
                  <td>{address.email}</td>
                  <td>{address.phoneNo}</td>
                  <td>{address.city}</td>
                  <td>{address.state}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewAddress(address)}
                        title="View address details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(address)}
                        title="Edit address"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(address._id)}
                        title="Delete address"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Optional Phone</label>
            <input
              type="text"
              name="optionalPhoneNo"
              value={formData.optionalPhoneNo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewingAddress}
        onClose={handleCloseViewModal}
        title="View Delivery Address"
      >
        {viewingAddress && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>{viewingAddress.name}</h3>
              <p className="blog-category">Email: <strong>{viewingAddress.email}</strong></p>
              <p className="blog-date">Phone: <strong>{viewingAddress.phoneNo}</strong></p>
              {viewingAddress.optionalPhoneNo && <p className="blog-date">Alt Phone: <strong>{viewingAddress.optionalPhoneNo}</strong></p>}
            </div>

            <div className="blog-view-content">
              <h4>Address Details</h4>
              <p><strong>Address:</strong> {viewingAddress.Address}</p>
              <p><strong>Landmark:</strong> {viewingAddress.landmark || 'N/A'}</p>
              <p><strong>City:</strong> {viewingAddress.city}</p>
              <p><strong>State:</strong> {viewingAddress.state}</p>
              <p><strong>ZIP Code:</strong> {viewingAddress.zip}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingAddress);
                  handleCloseViewModal();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => {
                  handleDelete(viewingAddress._id);
                  handleCloseViewModal();
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseViewModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeliveryAddressSection;

