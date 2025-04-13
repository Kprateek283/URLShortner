import Url from '../models/Url.js';
import shortid from 'shortid';
import dotenv from 'dotenv';



export const shortenUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;
  const userId = req.userId;

  dotenv.config();

  try {
    let shortId = customAlias || shortid.generate();

    // Check if alias already exists
    const existing = await Url.findOne({ shortId });
    if (existing) {
      return res.status(400).json({ message: 'Alias already taken' });
    }

    const newUrl = await Url.create({
      originalUrl,
      shortId,
      userId,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      shortUrl: `${process.env.FRONTEND_URL}/${shortId}`,
      originalUrl,
      shortId,
      expiresAt,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteUrl = async (req, res) => {
  const { shortId } = req.params;
  const userId = req.userId; // set from auth middleware

  try {
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // ✅ Check if the logged-in user owns this URL
    if (url.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this URL' });
    }

    // Deleting will automatically trigger Click.deleteMany() via pre hook
    await Url.findOneAndDelete({ shortId });

    res.status(200).json({ message: 'URL and related clicks deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserUrls = async (req, res) => {
  const userId = req.userId;  // Extracted from JWT token in middleware

  try {
    const urls = await Url.find({ userId });  // Get all URLs for the logged-in user

    if (!urls.length) {
      return res.status(404).json({ message: 'No URLs found for this user' });
    }

    res.status(200).json({ urls });
  } catch (err) {
    console.error('Error fetching user URLs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
