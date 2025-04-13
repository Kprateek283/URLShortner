import { UAParser } from 'ua-parser-js';
import Click from '../models/Click.js';

const logClickMiddleware = async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const userAgent = req.get('User-Agent');
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;


    const click = new Click({
      shortId,
      timestamp: new Date(),
      ip: ip,
      browser: result.browser.name || 'chrome',
      os: result.os.name || 'windows',
      deviceType: result.device.type || 'desktop',
    });

    await click.save();
  } catch (error) {
    console.warn('Error logging click:', error);
  }

  next();
};

export default logClickMiddleware;
