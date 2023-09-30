const Transaction = require('../models/Transaction');
const TransactionDetail = require('../models/TransactionDetail');
const Product = require('../models/Product');
const User = require('../models/User');
const Role = require('../models/Role');

// Create a new transaction (admin-only)
exports.createTransaction = async (req, res) => {
  try {
    const { date, userId, details } = req.body;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the userId from req.body has the 'admin' role
    const targetUser = await User.findByPk(userId, {
      include: { model: Role, as: 'role' },
    });

    if (targetUser.role.name === 'admin') {
      return res.status(400).json({ error: 'The user provided has the admin role.' });
    }

    if (!date || !userId || !details || !Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    let totalAmount = 0;

    for (const detail of details) {
      const product = await Product.findByPk(detail.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${detail.productId} not found` });
      }

      if (detail.quantity > product.stock) {
        return res.status(400).json({ error: `Not enough stock for Product ID ${detail.productId}` });
      }

      totalAmount += product.price * detail.quantity;
    }

    const transaction = await Transaction.create({ date, userId, totalAmount });
    for (const detail of details) {
      const product = await Product.findByPk(detail.productId);
      await TransactionDetail.create({
        quantity: detail.quantity,
        transactionId: transaction.id,
        productId: detail.productId,
        unitPrice: product.price,
      });

      product.stock -= detail.quantity;
      await product.save();
    }

    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all transactions (admin-only)
exports.getAllTransactions = async (req, res) => {
  try {
    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactions = await Transaction.findAll();
    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get transaction by ID (admin-only)
exports.getTransactionById = async (req, res) => {
  try {
    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Transaction By User (admin-only)
exports.getTransactionByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check the current user role
    const currentUser = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (currentUser.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the userId from req.body has the 'admin' role
    const targetUser = await User.findByPk(userId, {
      include: { model: Role, as: 'role' },
    });

    if (targetUser.role.name === 'admin') {
      return res.status(400).json({ error: 'The user provided has the admin role.' });
    }

    // Retrieve transactions for the specified user
    const transactions = await Transaction.findAll({
      where: { userId: userId },
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Client transaction (client-only)
exports.getTransactionClient = async (req, res) => {
  try {
    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'client' role
    if (user.role.name !== 'client') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update transaction by ID (admin-only)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, userId, details } = req.body;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the userId from req.body has the 'admin' role
    const targetUser = await User.findByPk(userId, {
      include: { model: Role, as: 'role' },
    });

    if (targetUser.role.name === 'admin') {
      return res.status(400).json({ error: 'The user provided has the admin role.' });
    }

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const oldDetails = await TransactionDetail.findAll({ where: { transactionId: transaction.id } });
    for (const oldDetail of oldDetails) {
      const product = await Product.findByPk(oldDetail.productId);
      if (!product) {
        console.error(`Product with ID ${oldDetail.productId} not found`);
      } else {
        product.stock += oldDetail.quantity;
        await product.save();
      }
    }

    transaction.date = date || transaction.date;
    transaction.userId = userId || transaction.userId;

    let totalAmount = 0;
    if (details && Array.isArray(details)) {
      for (const detail of details) {
        const product = await Product.findByPk(detail.productId);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${detail.productId} not found` });
        }

        // Memastikan jumlah tidak melebihi stok produk
        if (detail.quantity > product.stock) {
          return res.status(400).json({ error: `Not enough stock for Product ID ${detail.productId}` });
        }

        totalAmount += product.price * detail.quantity;
      }
    }
    transaction.totalAmount = totalAmount;

    await transaction.save();

    // Menghapus detail transaksi yang lama
    await TransactionDetail.destroy({ where: { transactionId: transaction.id } });

    // Membuat detail transaksi yang baru
    if (details && Array.isArray(details)) {
      for (const detail of details) {
        const product = await Product.findByPk(detail.productId);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${detail.productId} not found` });
        }

        await TransactionDetail.create({
          quantity: detail.quantity,
          transactionId: transaction.id,
          productId: detail.productId,
          unitPrice: product.price,
        });

        // Mengurangi stok produk yang baru
        product.stock -= detail.quantity;
        await product.save();
      }
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete transaction by ID (admin-only)
exports.deleteTransaction = async (req, res) => {
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

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Delete associated transaction details (if any)
    await TransactionDetail.destroy({ where: { transactionId: id } });

    // Now, delete the transaction
    await transaction.destroy();

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


