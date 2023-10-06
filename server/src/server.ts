import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose
  .connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
  .catch((err) => console.log(err.message));
