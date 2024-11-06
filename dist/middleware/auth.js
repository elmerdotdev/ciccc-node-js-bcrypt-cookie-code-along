"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNotAuth = exports.checkAuth = void 0;
// Auth check
const checkAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.sessionAuthToken) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.checkAuth = checkAuth;
// Check if not authenticated
const checkNotAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.sessionAuthToken) {
        res.redirect('/profile');
    }
    else {
        next();
    }
};
exports.checkNotAuth = checkNotAuth;
