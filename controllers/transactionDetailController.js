const TransactionDetail = require('../models/TransactionDetail');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const Role = require('../models/Role');

// Get all transaction details (admin-only)
exports.getAllTransactionDetails = async (req, res) => {
  try {

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactionDetails = await TransactionDetail.findAll();

    if (!transactionDetails || transactionDetails.length === 0) {
      return res.status(404).json({ error: 'Transaction details not found' });
    }

    return res.status(200).json(transactionDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all transaction details by transaction ID (admin-only)
exports.getTransactionDetailsByTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    const transactionDetails = await TransactionDetail.findAll({
      where: { transactionId },
      include: [{ model: Product, as: 'product' }],
    });

    res.status(200).json({ transaction, transactionDetails });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Get all transaction details by User (admin-only)
exports.getTransactionDetailsByTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the transaction by ID
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Find the transaction details associated with that transaction
    const transactionDetails = await TransactionDetail.findAll({
      where: { transactionId },
      include: [{ model: Product, as: 'product' }],
    });

    res.status(200).json({ transaction, transactionDetails });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Transaction Detail by ID (admin-only)
exports.getTransactionDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactionDetail = await TransactionDetail.findByPk(id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['date', 'totalAmount'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'category', 'price'],
        },
      ],
    });

    if (!transactionDetail) {
      return res.status(404).json({ error: 'Transaction detail not found' });
    }

    return res.status(200).json(transactionDetail);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Client Transaction Detail (client-only)
exports.getClientTransactionDetail = async (req, res) => {
  try {

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'client') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactionDetails = await TransactionDetail.findAll({
      include: [
        {
          model: Transaction,
          as: 'transaction',
          where: { userId: req.userId },
          attributes: ['date', 'totalAmount'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'category', 'price'],
        },
      ],
    });

    if (!transactionDetails || transactionDetails.length === 0) {
      return res.status(404).json({ error: 'Transaction details not found' });
    }

    return res.status(200).json(transactionDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};