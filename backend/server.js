import express from 'express';
import cors from 'cors';
import DBConnection from './database/db.js';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

DBConnection();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
app.use(express.json());
app.set('trust proxy', true);

app.use("/url",urlRoutes);
app.use("/auth",authRoutes);
app.use("/", urlRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});