import React, { useState, useEffect } from 'react';
import { orderAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    status: 'PENDING',
    paymentStatus: 'UNPAID',
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (statusFilter === 'all') {
        response = await orderAPI.getAll();
      } else if (statusFilter === 'pending') {
        response = await orderAPI.getPending();
      } else if (statusFilter === 'accepted') {
        response = await orderAPI.getAccepted();
      } else if (statusFilter === 'shipped') {
        response = await orderAPI.getShipped();
      } else if (statusFilter === 'cancelled') {
        response = await orderAPI.getCancelled();
      }
      setOrders(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        status: order.status || 'PENDING',
        paymentStatus: order.paymentStatus || 'UNPAID',
      });
    } else {
      setEditingOrder(null);
      setFormData({
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleCloseViewModal = () => {
    setViewingOrder(null);
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
      if (editingOrder) {
        await orderAPI.updateStatus(editingOrder._id, formData);
      }
      fetchOrders();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save order');
      console.error(err);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Orders Management</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
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
                <th>Order ID</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id?.substring(0, 8)}...</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewOrder(order)}
                        title="View order details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(order)}
                        title="Edit order"
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
        title="Edit Order"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
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
        isOpen={!!viewingOrder}
        onClose={handleCloseViewModal}
        title="View Order"
      >
        {viewingOrder && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>Order #{viewingOrder._id?.substring(0, 8)}</h3>
              <p className="blog-category">Total Amount: <strong>₹{viewingOrder.totalAmount}</strong></p>
              <p className="blog-date">Status: <strong>{viewingOrder.status}</strong></p>
              <p className="blog-date">Payment Status: <strong>{viewingOrder.paymentStatus}</strong></p>
              <p className="blog-date">Payment Method: <strong>{viewingOrder.paymentMethod}</strong></p>
              <p className="blog-date">Date: <strong>{new Date(viewingOrder.createdAt).toLocaleDateString()}</strong></p>
            </div>

            {viewingOrder.items && viewingOrder.items.length > 0 && (
              <div className="blog-view-content">
                <h4>Order Items</h4>
                <ul style={{paddingLeft: '20px'}}>
                  {viewingOrder.items.map((item, idx) => (
                    <li key={idx}>{item.name} x {item.quantity} - ₹{item.price}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingOrder);
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

export default OrdersSection;

