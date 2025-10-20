import React, { useState, useEffect } from 'react';
import { paymentAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const PaymentSection = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [formData, setFormData] = useState({
    paymentStatus: 'UNPAID',
    paymentMethod: 'CASH',
  });

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (statusFilter === 'all') {
        response = await paymentAPI.getAll();
      } else if (statusFilter === 'pending') {
        response = await paymentAPI.getPending();
      } else if (statusFilter === 'successful') {
        response = await paymentAPI.getSuccessful();
      }
      setPayments(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch payments');
      console.error(err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        paymentStatus: payment.paymentStatus || 'UNPAID',
        paymentMethod: payment.paymentMethod || 'CASH',
      });
    } else {
      setEditingPayment(null);
      setFormData({
        paymentStatus: 'UNPAID',
        paymentMethod: 'CASH',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPayment(null);
  };

  const handleViewPayment = (payment) => {
    setViewingPayment(payment);
  };

  const handleCloseViewModal = () => {
    setViewingPayment(null);
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
      if (editingPayment) {
        await paymentAPI.update(editingPayment._id, formData);
      }
      fetchPayments();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save payment');
      console.error(err);
    }
  };

  // Get unique payment methods and dates
  const uniqueMethods = Array.from(new Set(payments.map(p => p.paymentMethod).filter(Boolean)));
  const uniqueDates = Array.from(new Set(
    payments.map(p => new Date(p.createdAt).toLocaleDateString()).filter(Boolean)
  ));

  // Filter payments
  const filteredPayments = Array.isArray(payments) ? payments.filter((payment) => {
    const matchesSearch = 
      payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount?.toString().includes(searchTerm) ||
      payment.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    const paymentDate = new Date(payment.createdAt).toLocaleDateString();
    const matchesDate = dateFilter === 'all' || paymentDate === dateFilter;
    
    return matchesSearch && matchesMethod && matchesDate;
  }) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Payments Management</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by payment ID, amount, or user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="successful">Successful</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Method:</label>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Methods</option>
            {uniqueMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
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
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>User</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.paymentId?.substring(0, 12)}...</td>
                  <td>₹{payment.amount}</td>
                  <td>
                    <span className={`status-badge ${payment.paymentStatus?.toLowerCase()}`}>
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.userId?.name || 'N/A'}</td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewPayment(payment)}
                        title="View payment details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(payment)}
                        title="Edit payment"
                      >
                        Edit
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
        title="Edit Payment"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Status</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
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
        isOpen={!!viewingPayment}
        onClose={handleCloseViewModal}
        title="View Payment"
      >
        {viewingPayment && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>Payment #{viewingPayment.paymentId?.substring(0, 12)}</h3>
              <p className="blog-category">Amount: <strong>₹{viewingPayment.amount}</strong></p>
              <p className="blog-date">Status: <strong>{viewingPayment.paymentStatus}</strong></p>
              <p className="blog-date">Method: <strong>{viewingPayment.paymentMethod}</strong></p>
            </div>

            <div className="blog-view-content">
              <h4>Payment Details</h4>
              <p><strong>User:</strong> {viewingPayment.userId?.name || 'N/A'}</p>
              <p><strong>User Email:</strong> {viewingPayment.userId?.email || 'N/A'}</p>
              <p><strong>Order ID:</strong> {viewingPayment.orderId?._id?.substring(0, 12) || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(viewingPayment.createdAt).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(viewingPayment.createdAt).toLocaleTimeString()}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingPayment);
                  handleCloseViewModal();
                }}
              >
                Edit
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

export default PaymentSection;

