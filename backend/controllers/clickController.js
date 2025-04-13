import Click from '../models/Click.js';
import Url from '../models/Url.js';

export const getClickInfo = async (req, res) => {
  const { shortId } = req.params; // Get the shortId from the URL parameter

  try {
    // Fetch URL data from the Url collection
    const urlDoc = await Url.findOne({ shortId });

    if (!urlDoc) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Fetch all clicks associated with the given shortId from the Click collection
    const clicks = await Click.find({ shortId });

    // If no clicks found, respond with a message
    if (!clicks.length) {
      return res.status(404).json({ message: 'No click information found for this URL' });
    }

    // Combine the URL and Clicks data into one response
    const responseData = {
      url: {
        originalUrl: urlDoc.originalUrl,
        shortId: urlDoc.shortId,
        userId: urlDoc.userId,
        expiresAt: urlDoc.expiresAt,
        clicks: urlDoc.clicks,
        createdAt: urlDoc.createdAt,
      },
      clicks: clicks,
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error fetching URL and click information:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


  export const redirectToOriginal = async (req, res) => {
    const { shortId } = req.params;
  
    try {
      const urlDoc = await Url.findOne({ shortId });
      if (!urlDoc) return res.status(404).json({ message: 'URL not found' });
  
      // Check for expiration
      if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
        return res.status(410).json({ message: 'URL expired' });
      }
  
      // Increment clicks (this will be handled in middleware if you prefer)
      urlDoc.clicks += 1;
      await urlDoc.save();
  
      // Log click asynchronously (this will go to the middleware)
      res.redirect(urlDoc.originalUrl);  // Redirect to the original URL
    } catch (err) {
      console.error('Error in redirection:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };