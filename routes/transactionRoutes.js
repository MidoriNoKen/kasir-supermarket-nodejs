const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware');

// Admin //

// Create a new transaction (admin-only)
router.post('/admin/transactions', authMiddleware, transactionController.createTransaction);
// Get all transactions (admin-only)
router.get('/admin/transactions', authMiddleware, transactionController.getAllTransactions);
// Get Transaction By User (admin-only)
router.get('/admin/transactions/user/:userId', authMiddleware, transactionController.getTransactionByUser);
// Get transaction by ID (admin-only)
router.get('/admin/transactions/:id', authMiddleware, transactionController.getTransactionById);
// Update transaction by ID (admin-only)
router.put('/admin/transactions/:id', authMiddleware, transactionController.updateTransaction);
// Delete transaction by ID (admin-only)
router.delete('/admin/transactions/:id', authMiddleware, transactionController.deleteTransaction);

// Client //

// Get Client transaction (client-only)
router.get('/client/transactions', authMiddleware, transactionController.getTransactionClient);
module.exports = router;
