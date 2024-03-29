"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_handlebars_1 = require("express-handlebars");
const bodyParser = __importStar(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const moment_1 = __importDefault(require("moment"));
const connect_db_1 = __importDefault(require("./utils/connect-db"));
const orchid_router_1 = __importDefault(require("./routes/orchid.router"));
const category_router_1 = __importDefault(require("./routes/category.router"));
const orchid_controller_1 = require("./controllers/orchid.controller");
const user_router_1 = __importDefault(require("./routes/user.router"));
const comment_router_1 = __importDefault(require("./routes/comment.router"));
dotenv_1.default.config();
const port = process.env.PORT;
const env = process.env.NODE_ENV;
const dbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/SDN301';
const app = (0, express_1.default)();
(0, connect_db_1.default)(dbUrl);
//Config
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'asdhbv618fbv7yfdf',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
if (env === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something happened!');
});
//Template engine
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(__dirname + '/views'));
app.engine('hbs', (0, express_handlebars_1.engine)({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        inc: function (value, options) {
            return parseInt(value) + 1;
        },
        prettifyDate: function (timestamp) {
            return (0, moment_1.default)(timestamp).format('YYYY-MM-DD HH:MM');
        },
        commentDate: function (timestamp) {
            console.log(timestamp, (0, moment_1.default)(timestamp).format('MMM. Do YYYY HH:MM'));
            return (0, moment_1.default)(timestamp).format('MMM. Do YYYY HH:MM');
        },
        ifEquals: function (arg1, arg2, options) {
            return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        }
    }
}));
//Endpoint
app.use(user_router_1.default);
app.use('/orchids', orchid_router_1.default);
app.use('/categories', category_router_1.default);
app.use('/comments', comment_router_1.default);
const orchidController = new orchid_controller_1.OrchidController();
app.get('/', orchidController.renderAllOrchids);
app.get('/home', (req, res) => {
    res.render('home', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
    });
});
app.get('*', (req, res) => {
    res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
exports.default = app;
