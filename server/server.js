import { resolve } from 'path';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import dbConnect from './db.js';
require('dotenv').config();

const app = express();
const PORT = 3000;

// handle json, cookies, serve static assets, etc
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(resolve(__dirname, '../dist')));

// routers
app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => {
  dbConnect();
  console.log(`Server listening on ${PORT}`);
});
