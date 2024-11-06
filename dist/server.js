"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import cookieParser from 'cookie-parser'
const cookie_session_1 = __importDefault(require("cookie-session"));
const path_1 = __importDefault(require("path"));
const page_routes_1 = __importDefault(require("./routes/page.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
// Middleware
const SIGN_KEY = (_a = process.env.COOKIE_SESSION_SIGN_KEY) !== null && _a !== void 0 ? _a : 'vnolrk1vjns';
const ENCRYPT_KEY = (_b = process.env.COOKIE_SESSION_ENCRYPT_KEY) !== null && _b !== void 0 ? _b : 'bvn1oiel2jk';
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [SIGN_KEY, ENCRYPT_KEY],
    maxAge: 3 * 60 * 1000
}));
// app.use(cookieParser(process.env.COOKIE_KEY))
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../src/views'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Routes
app.use('/', page_routes_1.default);
// 404 Fallback
app.use((req, res) => {
    res.status(404).render('404');
});
// Start server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
