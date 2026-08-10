"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_controller_1 = require("../controllers/item.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', item_controller_1.getItems);
router.get('/:id', item_controller_1.getItemById);
router.post('/', auth_middleware_1.protect, item_controller_1.createItem);
router.put('/:id', auth_middleware_1.protect, item_controller_1.updateItem);
router.delete('/:id', auth_middleware_1.protect, item_controller_1.deleteItem);
exports.default = router;
//# sourceMappingURL=item.routes.js.map