"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claim_controller_1 = require("../controllers/claim.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.protect, claim_controller_1.createClaim);
router.get('/', auth_middleware_1.protect, claim_controller_1.getClaims);
router.get('/:id', auth_middleware_1.protect, claim_controller_1.getClaimById);
router.put('/:id/status', auth_middleware_1.protect, auth_middleware_1.admin, claim_controller_1.updateClaimStatus);
exports.default = router;
//# sourceMappingURL=claim.routes.js.map