import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Url from '../models/Url.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.create({ userName, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message});
  }
};


// Logout
export const logoutUser = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.userId).select('email userName');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const urlCount = await Url.countDocuments({ userId: req.userId });

    return res.json({
      name: user.userName || 'N/A',
      email: user.email,
      urlCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
