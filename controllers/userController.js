const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const authConfig = require('../config/authConfig');

// Register a new user (admin-only)
exports.register = async (req, res) => {
  try {
    const { username, password, name, address, phone, nik, roleId } = req.body;

    // Check if username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user in the database
    await User.create({
      username,
      password,
      name,
      address,
      phone,
      nik,
      roleId,
    });

    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user and return a JWT token
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username and include the Role association
    const user = await User.findOne({
      where: { username },
      include: {
        model: Role,
        as: 'role',
      },
    });

    // Check if user exists and verify password
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users (admin-only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // JIf the user has the 'admin' role, get all users
    const users = await User.findAll({ include: { model: Role, as: 'role' } });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by ID (admin-only)
exports.getUserById = async (req, res) => {
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

    const targetUser = await User.findByPk(id, { include: { model: Role, as: 'role' } });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(targetUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get users by Role (admin-only)
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const usersRole = await User.findAll({
      include: {
        model: Role,
        as: 'role',
        where: { name: role }
      }
    });

    return res.status(200).json(usersRole);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get admin Profile (admin-only)
exports.getAdminProfile = async (req, res) => {
  try {
    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const adminProfile = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    return res.status(200).json(adminProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get client Profile (client-only)
exports.getClientProfile = async (req, res) => {
  try {
    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'client' role
    if (user.role.name !== 'client') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clientProfile = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    return res.status(200).json(clientProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user by ID (admin-only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, name, address, phone, nik, roleId } = req.body;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'admin' role
    if (user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username !== targetUser.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Hash the new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      targetUser.password = hashedPassword;
    }

    targetUser.username = username || targetUser.username;
    targetUser.name = name || targetUser.name;
    targetUser.address = address || targetUser.address;
    targetUser.phone = phone || targetUser.phone;
    targetUser.nik = nik || targetUser.nik;
    targetUser.roleId = roleId || targetUser.roleId;

    await targetUser.save();
    return res.status(200).json(targetUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update client profile (client-only)
exports.updateClientProfile = async (req, res) => {
  try {
    const { username, password, name, address, phone, nik } = req.body;

    // Check the current user role
    const user = await User.findByPk(req.userId, {
      include: { model: Role, as: 'role' },
    });

    // Check if the user has the 'client' role
    if (user.role.name !== 'client') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetClient = await User.findByPk(req.userId);
    if (!targetClient) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username && username !== targetClient.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Hash the new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      targetClient.password = hashedPassword;
    }

    targetClient.username = username || targetClient.username;
    targetClient.name = name || targetClient.name;
    targetClient.address = address || targetClient.address;
    targetClient.phone = phone || targetClient.phone;
    targetClient.nik = nik || targetClient.nik;

    await targetClient.save();
    return res.status(200).json(targetClient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user by ID (admin-only)
exports.deleteUser = async (req, res) => {
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

    const targetClient = await User.findByPk(id);
    if (!targetClient) {
      return res.status(404).json({ error: 'User not found' });
    }

    await targetClient.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
