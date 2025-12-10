import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { env } from './utils/env';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';
import plannerRoutes from './routes/plannerRoutes';
import shoppingRoutes from './routes/shoppingRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const swaggerDocument = YAML.load(path.join(__dirname, 'docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: express.Request, res: express.Response) => {
    res.json({ message: 'Laoka Backend API is running' });
});

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/planner', plannerRoutes);
app.use('/meal-plans', plannerRoutes); // Alias for frontend compatibility
app.use('/shopping', shoppingRoutes);
app.use('/upload', uploadRoutes); // Standalone upload
app.use('/api/files/upload', uploadRoutes); // Alias for frontend compatibility

app.use(errorHandler);

const PORT = env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
