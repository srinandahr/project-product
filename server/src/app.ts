import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://project-product-delta.vercel.app"
        ],
        credentials: true
    })
);
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', router);

export default app;
