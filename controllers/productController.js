const User = require('../models/User');
const Role = require('../models/Role');
const Product = require('../models/Product');

// Create a new product (admin-only)
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if username already exists in the database
    const existingName = await Product.findOne({ where: { name } });
    if (existingName) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const product = await Product.create({ name, category, price, stock });
    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product by ID (public)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product by Category (public)
exports.getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findAll({ where: { category } });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'Products not found for this category' });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product by ID (admin-only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if username already exists in the database
    const existingName = await Product.findOne({ where: { name } });
    if (existingName) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.stock = stock || product.stock;

    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product by ID (admin-only)
exports.deleteProduct = async (req, res) => {
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

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
