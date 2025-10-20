import React, { useState, useEffect } from 'react';
import { productAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    catagory: '',
    discount: '',
    stock: '',
    image: '',
    Availability: 'AVAILABLE',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productAPI.getAll();
      setProducts(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        catagory: product.catagory || '',
        discount: product.discount || '',
        stock: product.stock || '',
        image: product.image?.[0] || '',
        Availability: product.Availability || 'AVAILABLE',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        catagory: '',
        discount: '',
        stock: '',
        image: '',
        Availability: 'AVAILABLE',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  const handleCloseViewModal = () => {
    setViewingProduct(null);
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
      // Validate required fields
      if (!formData.name || !formData.price || !formData.description || !formData.catagory || !formData.stock || !formData.image) {
        setError('All fields are required');
        return;
      }

      // Convert image to array format
      const submitData = {
        ...formData,
        image: [formData.image],
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: formData.discount ? Number(formData.discount) : 0,
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, submitData);
      } else {
        await productAPI.create(submitData);
      }
      fetchProducts();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.catagory?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Products Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search products..."
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
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.catagory}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.Availability}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewProduct(product)}
                        title="View product details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(product)}
                        title="Edit product"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product._id)}
                        title="Delete product"
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
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
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
            <label>Category</label>
            <input
              type="text"
              name="catagory"
              value={formData.catagory}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              name="Availability"
              value={formData.Availability}
              onChange={handleChange}
            >
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
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
        isOpen={!!viewingProduct}
        onClose={handleCloseViewModal}
        title="View Product"
      >
        {viewingProduct && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>{viewingProduct.name}</h3>
              <p className="blog-category">Category: <strong>{viewingProduct.catagory}</strong></p>
              <p className="blog-date">Price: <strong>₹{viewingProduct.price}</strong></p>
              <p className="blog-date">Stock: <strong>{viewingProduct.stock}</strong></p>
              <p className="blog-date">Availability: <strong>{viewingProduct.Availability}</strong></p>
              {viewingProduct.discount && <p className="blog-date">Discount: <strong>{viewingProduct.discount}%</strong></p>}
            </div>

            <div className="blog-view-content">
              <h4>Description</h4>
              <p>{viewingProduct.description}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingProduct);
                  handleCloseViewModal();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => {
                  handleDelete(viewingProduct._id);
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

export default ProductsSection;

