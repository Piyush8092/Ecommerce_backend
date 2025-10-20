# Admin Panel Testing Guide

## Pre-Testing Setup

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
Ensure backend is running on `http://localhost:5000`

### 2. Update API Configuration
Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

## Manual Testing Checklist

### Authentication Tests

- [ ] **Login Page Loads**
  - Navigate to `http://localhost:5173/admin/login`
  - Verify login form displays with Name, Email, and Role fields

- [ ] **Form Validation**
  - Try submitting empty form → Should show error
  - Try submitting without email → Should show error
  - Try submitting invalid email → Should show error

- [ ] **Successful Login**
  - Enter valid name, email, and select role
  - Click Login button
  - Should redirect to dashboard
  - User info should display in header

- [ ] **Session Persistence**
  - After login, refresh page
  - Should remain logged in
  - User info should still display

- [ ] **Logout**
  - Click Logout button in header
  - Should redirect to login page
  - localStorage should be cleared

### Dashboard Tests

- [ ] **Dashboard Loads**
  - Verify dashboard displays after login
  - Check overview cards are visible
  - Verify sidebar menu is displayed

- [ ] **Overview Cards**
  - Check all 4 cards display (Users, Products, Orders, Blogs)
  - Verify card icons and styling

- [ ] **Sidebar Navigation**
  - Click each menu item
  - Verify correct section loads
  - Check active state highlights current section

### Users Section Tests

- [ ] **Load Users**
  - Click "Users" in sidebar
  - Verify users table loads
  - Check columns: Name, Email, Phone, Role, Actions

- [ ] **Search Users**
  - Type in search box
  - Verify table filters by name or email
  - Clear search to show all users

- [ ] **Edit User**
  - Click "Edit" button on a user
  - Modal should open with user data
  - Change role and click Save
  - Verify user role updates in table

- [ ] **Delete User**
  - Click "Delete" button
  - Confirm deletion dialog appears
  - Click confirm
  - Verify user is removed from table

### Products Section Tests

- [ ] **Load Products**
  - Click "Products" in sidebar
  - Verify products table loads
  - Check columns: Name, Category, Price, Stock, Availability, Actions

- [ ] **Add Product**
  - Click "+ Add New Product"
  - Fill in all required fields
  - Click Save
  - Verify new product appears in table

- [ ] **Edit Product**
  - Click "Edit" on a product
  - Modify product details
  - Click Save
  - Verify changes appear in table

- [ ] **Delete Product**
  - Click "Delete" on a product
  - Confirm deletion
  - Verify product is removed

- [ ] **Search Products**
  - Type in search box
  - Verify table filters by name or category

### Carousel Section Tests

- [ ] **Load Carousel Items**
  - Click "Carousel" in sidebar
  - Verify carousel items table loads

- [ ] **Add Carousel Item**
  - Click "+ Add New Carousel"
  - Fill in heading, title, image URL, category
  - Click Save
  - Verify item appears in table

- [ ] **Edit Carousel Item**
  - Click "Edit" on an item
  - Modify details
  - Click Save
  - Verify changes appear

- [ ] **Delete Carousel Item**
  - Click "Delete"
  - Confirm deletion
  - Verify item is removed

### Orders Section Tests

- [ ] **Load Orders**
  - Click "Orders" in sidebar
  - Verify orders table loads

- [ ] **Filter Orders**
  - Use status dropdown to filter:
    - All Orders
    - Pending
    - Accepted
    - Shipped
    - Cancelled
  - Verify table updates with filtered results

- [ ] **Edit Order Status**
  - Click "Edit" on an order
  - Change status and payment status
  - Click Save
  - Verify changes appear in table

### Blogs Section Tests

- [ ] **Load Blogs**
  - Click "Blogs" in sidebar
  - Verify blogs table loads

- [ ] **Add Blog**
  - Click "+ Add New Blog"
  - Fill in all fields
  - Click Save
  - Verify blog appears in table

- [ ] **Edit Blog**
  - Click "Edit" on a blog
  - Modify content
  - Click Save
  - Verify changes appear

- [ ] **Delete Blog**
  - Click "Delete"
  - Confirm deletion
  - Verify blog is removed

### Contact Section Tests

- [ ] **Load Contact Messages**
  - Click "Contact Messages" in sidebar
  - Verify messages table loads

- [ ] **View Message**
  - Click "View" on a message
  - Modal should display full message details
  - Click "Close"

- [ ] **Delete Message**
  - Click "Delete" on a message
  - Confirm deletion
  - Verify message is removed

### Delivery Address Section Tests

- [ ] **Load Addresses**
  - Click "Delivery Address" in sidebar
  - Verify addresses table loads

- [ ] **Add Address**
  - Click "+ Add New Address"
  - Fill in all required fields
  - Click Save
  - Verify address appears in table

- [ ] **Edit Address**
  - Click "Edit" on an address
  - Modify details
  - Click Save
  - Verify changes appear

- [ ] **Delete Address**
  - Click "Delete"
  - Confirm deletion
  - Verify address is removed

### Cart Section Tests

- [ ] **Load Carts**
  - Click "Cart" in sidebar
  - Verify carts table loads

- [ ] **Add to Cart**
  - Click "+ Add to Cart"
  - Enter product ID and quantity
  - Click Save
  - Verify cart item appears

- [ ] **Edit Cart Item**
  - Click "Edit" on a cart item
  - Modify quantity
  - Click Save
  - Verify changes appear

- [ ] **Delete Cart Item**
  - Click "Delete"
  - Confirm deletion
  - Verify item is removed

### UI/UX Tests

- [ ] **Responsive Design**
  - Test on desktop (1920x1080)
  - Test on tablet (768x1024)
  - Test on mobile (375x667)
  - Verify layout adjusts properly

- [ ] **Error Handling**
  - Disconnect backend
  - Try to load data
  - Verify error message displays

- [ ] **Loading States**
  - Observe loading indicators during API calls
  - Verify they disappear when data loads

- [ ] **Modal Functionality**
  - Open modal
  - Click outside modal → Should close
  - Click X button → Should close
  - Click Cancel → Should close

- [ ] **Form Validation**
  - Try submitting empty required fields
  - Verify error messages appear
  - Fill fields and submit successfully

## Browser Testing

Test on multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Performance Testing

- [ ] **Page Load Time**
  - Measure initial load time
  - Should be < 3 seconds

- [ ] **API Response Time**
  - Check network tab in DevTools
  - API calls should complete < 2 seconds

- [ ] **Memory Usage**
  - Monitor memory in DevTools
  - Should not continuously increase

## Accessibility Testing

- [ ] **Keyboard Navigation**
  - Tab through form fields
  - Enter to submit forms
  - Escape to close modals

- [ ] **Screen Reader**
  - Test with screen reader
  - All buttons and labels should be readable

- [ ] **Color Contrast**
  - Verify text is readable
  - Check contrast ratios

## Bug Reporting Template

When you find a bug, report it with:

```
Title: [Brief description]
Severity: Critical/High/Medium/Low
Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Browser: [Chrome/Firefox/Safari/Edge]
OS: [Windows/Mac/Linux]
Screenshots: [If applicable]
```

## Test Results Summary

After completing all tests, fill in:

| Category | Status | Notes |
|----------|--------|-------|
| Authentication | ✓/✗ | |
| Dashboard | ✓/✗ | |
| Users | ✓/✗ | |
| Products | ✓/✗ | |
| Carousel | ✓/✗ | |
| Orders | ✓/✗ | |
| Blogs | ✓/✗ | |
| Contact | ✓/✗ | |
| Delivery | ✓/✗ | |
| Cart | ✓/✗ | |
| UI/UX | ✓/✗ | |
| Responsive | ✓/✗ | |
| Performance | ✓/✗ | |

## Known Issues

(To be filled during testing)

## Recommendations

(To be filled during testing)

---

**Testing Date**: ___________
**Tester Name**: ___________
**Overall Status**: ✓ PASS / ✗ FAIL

