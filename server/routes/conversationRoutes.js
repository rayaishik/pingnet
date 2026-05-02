const express = require('express');
const { getConversations, createConversation } = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, createConversation);

module.exports = router;
