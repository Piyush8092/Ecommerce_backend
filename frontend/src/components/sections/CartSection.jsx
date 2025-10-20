import React, { useState, useEffect } from 'react';
import { cartAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const CartSection = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCart, setEditingCart] = useState(null);
  const [viewingCart, setViewingCart] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await cartAPI.getAll();
      setCarts(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch carts');
      console.error(err);
      setCarts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cart = null) => {
    if (cart) {
      setEditingCart(cart);
      setFormData({
        productId: cart.productId || '',
        quantity: cart.quantity || '',
      });
    } else {
      setEditingCart(null);
      setFormData({
        productId: '',
        quantity: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCart(null);
  };

  const handleViewCart = (cart) => {
    setViewingCart(cart);
  };

  const handleCloseViewModal = () => {
    setViewingCart(null);
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
      if (editingCart) {
        await cartAPI.update(editingCart._id, formData);
      } else {
        await cartAPI.create(formData);
      }
      fetchCarts();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save cart');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cart item?')) {
      try {
        await cartAPI.delete(id);
        fetchCarts();
      } catch (err) {
        setError('Failed to delete cart item');
        console.error(err);
      }
    }
  };

  const filteredCarts = Array.isArray(carts) ? carts.filter(
    (cart) =>
      cart._id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Shopping Carts</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add to Cart
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search carts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.map((cart) => (
                <tr key={cart._id}>
                  <td>{cart._id?.substring(0, 8)}...</td>
                  <td>{cart.productId?.substring(0, 8)}...</td>
                  <td>{cart.quantity}</td>
                  <td>{new Date(cart.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewCart(cart)}
                        title="View cart details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(cart)}
                        title="Edit cart"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cart._id)}
                        title="Delete cart"
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
        title={editingCart ? 'Edit Cart Item' : 'Add to Cart'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product ID</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
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
        isOpen={!!viewingCart}
        onClose={handleCloseViewModal}
        title="View Cart"
      >
        {viewingCart && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>Cart #{viewingCart._id?.substring(0, 8)}</h3>
              <p className="blog-category">Product ID: <strong>{viewingCart.productId?.substring(0, 8)}</strong></p>
              <p className="blog-date">Quantity: <strong>{viewingCart.quantity}</strong></p>
              <p className="blog-date">Created: <strong>{new Date(viewingCart.createdAt).toLocaleDateString()}</strong></p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingCart);
                  handleCloseViewModal();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => {
                  handleDelete(viewingCart._id);
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

export default CartSection;

