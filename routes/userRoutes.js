const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware');

// Public //

// Login user and return a JWT token
router.post('/login', UserController.login);

// Admin //

// Register a new user (admin-only)
router.post('/admin/register', authMiddleware, UserController.register);
// Get all users (admin-only)
router.get('/admin/users', authMiddleware, UserController.getAllUsers);
// Get user by ID (admin-only)
router.get('/admin/users/:id', authMiddleware, UserController.getUserById);
// Get users by Role (admin-only)
router.get('/admin/users/role/:role', authMiddleware, UserController.getUsersByRole);
// Get admin Profile (admin-only)
router.get('/admin/profile', authMiddleware, UserController.getAdminProfile);
// Update user by ID (admin-only)
router.put('/admin/users/:id', authMiddleware, UserController.updateUser);
// Delete user by ID (admin-only)
router.delete('/admin/users/:id', authMiddleware, UserController.deleteUser);

// Client //

// Get client Profile (client-only)
router.get('/client/profile', authMiddleware, UserController.getClientProfile);
// Update client profile (client-only)
router.put('/client/profile', authMiddleware, UserController.updateClientProfile);

module.exports = router;
