"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const claim_routes_1 = __importDefault(require("./routes/claim.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const Message_1 = __importDefault(require("./models/Message"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/items', item_routes_1.default);
app.use('/api/claims', claim_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.get('/', (req, res) => {
    res.send('Campus Lost & Found API is running...');
});
// Error Middleware
app.use(error_middleware_1.errorHandler);
// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });
    socket.on('send_message', async (data) => {
        const { sender, receiver, item, content, roomId } = data;
        // Save message to database
        const newMessage = await Message_1.default.create({
            sender,
            receiver,
            item,
            content,
        });
        io.to(roomId).emit('receive_message', newMessage);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-lost-found';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
//# sourceMappingURL=index.js.map