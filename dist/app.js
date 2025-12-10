"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./utils/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const plannerRoutes_1 = __importDefault(require("./routes/plannerRoutes"));
const shoppingRoutes_1 = __importDefault(require("./routes/shoppingRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, 'docs/swagger.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get('/', (req, res) => {
    res.json({ message: 'Laoka Backend API is running' });
});
app.use('/auth', authRoutes_1.default);
app.use('/recipes', recipeRoutes_1.default);
app.use('/planner', plannerRoutes_1.default);
app.use('/meal-plans', plannerRoutes_1.default); // Alias for frontend compatibility
app.use('/shopping', shoppingRoutes_1.default);
app.use('/upload', uploadRoutes_1.default); // Standalone upload
app.use('/api/files/upload', uploadRoutes_1.default); // Alias for frontend compatibility
app.use(errorMiddleware_1.errorHandler);
const PORT = env_1.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
