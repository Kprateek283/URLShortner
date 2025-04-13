import mongoose from 'mongoose';
import Click from './Click.js';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  clicks: {
    type: Number,
    default: 0,
  }
});

urlSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await Click.deleteMany({ shortId: doc.shortId });
  }
  next();
});

urlSchema.index({ userId: 1 });

export default mongoose.model('Url', urlSchema);
