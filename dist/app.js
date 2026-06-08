"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const challenge_routes_1 = __importDefault(require("./routes/challenge.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const estudiante_routes_1 = __importDefault(require("./routes/estudiante.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const invitado_routes_1 = __importDefault(require("./routes/invitado.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const AppError_1 = require("./utils/AppError");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)({
            origin: env_1.env.NODE_ENV === 'production' ? 'https://tu-dominio-frontend.com' : '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            credentials: true
        }));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP, please try again in 15 minutes',
        });
        this.app.use('/api', limiter);
    }
    initializeRoutes() {
        this.app.get('/api/health', (req, res) => {
            res.status(200).json({ status: 'success', message: 'API is running', environment: env_1.env.NODE_ENV });
        });
        this.app.use('/api/auth', auth_routes_1.default);
        this.app.use('/api/challenges', challenge_routes_1.default);
        this.app.use('/api/companies', company_routes_1.default);
        this.app.use('/api/estudiantes', estudiante_routes_1.default);
        this.app.use('/api/admin', admin_routes_1.default);
        this.app.use('/api/invitado', invitado_routes_1.default);
    }
    initializeErrorHandling() {
        // 404 handler - catch all unmatched routes
        this.app.use((req, res, next) => {
            next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
        });
        this.app.use(error_middleware_1.globalErrorHandler);
    }
    listen() {
        this.app.listen(env_1.env.PORT, () => {
            console.log(`=================================`);
            console.log(`======= ENV: ${env_1.env.NODE_ENV} =======`);
            console.log(`🚀 App listening on the port ${env_1.env.PORT}`);
            console.log(`=================================`);
        });
    }
}
exports.App = App;
