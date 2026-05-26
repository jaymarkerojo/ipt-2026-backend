"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const db_1 = require("./_helpers/db");
const users_controller_1 = __importDefault(require("./users/users.controller"));
const accounts_controller_1 = __importDefault(require("./accounts/accounts.controller"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, "swagger.yaml"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get("/", (req, res) => res.redirect("/api-docs"));
app.use("/accounts", accounts_controller_1.default);
app.use("/users", users_controller_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
(0, db_1.initialize)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
        console.log(`TEST WITH: POST /users with {email, password, ....}`);
    });
}).catch((err) => {
    console.log(`Failed to initialize database::`, err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map