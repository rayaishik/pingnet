const express = require('express');
const { getConversationMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:conversationId', protect, getConversationMessages);
router.post('/', protect, sendMessage);

module.exports = router;
