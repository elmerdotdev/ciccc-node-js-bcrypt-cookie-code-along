"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pageRouter = (0, express_1.Router)();
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
// Helper function for bcrypt
const hashPassword = (password, rounds) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(rounds);
    const hash = yield bcrypt_1.default.hash(password, salt);
    return hash; // hashed password
});
// In-memory database
let users = [];
// Home
pageRouter.get('/', (req, res) => {
    res.status(200).render('index', { users });
});
// Register
pageRouter.get('/register', auth_1.checkNotAuth, (req, res) => {
    res.status(200).render('register');
});
// Register process
pageRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const found = users.find(user => user.username === username);
        if (found) {
            res.status(500).send('Username already taken');
            return;
        }
        const newPassword = yield hashPassword(password, 12); // 12 is the recommended rounds
        const newUser = {
            username,
            password: newPassword,
            email
        };
        users.push(newUser);
        console.log(newUser);
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
        res.send(500).send("Internal server error");
    }
}));
// Login
pageRouter.get('/login', auth_1.checkNotAuth, (req, res) => {
    res.status(200).render('login');
});
// Login process
pageRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const found = users.find(user => user.username === username);
        if (found && (yield bcrypt_1.default.compare(password, found.password))) {
            // res.cookie('authToken', 'authenticated', {
            //   maxAge: 3 * 60 * 1000,
            //   httpOnly: true,
            //   signed: true
            // })
            req.session.sessionAuthToken = true;
            req.session.username = found.username;
            res.redirect('/profile');
            return;
        }
        res.status(404).send('User not found!');
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
// Profile
pageRouter.get('/profile', auth_1.checkAuth, (req, res) => {
    res.status(200).render('profile');
});
// Logout
pageRouter.get('/logout', (req, res) => {
    // res.clearCookie('authToken')
    req.session = null;
    res.redirect('/login');
});
exports.default = pageRouter;
