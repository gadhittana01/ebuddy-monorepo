import express from 'express';
import userRoutes from '../routes/userRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)).on('error', (error: Error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});
