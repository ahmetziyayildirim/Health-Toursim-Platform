const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { chat, getQuickSuggestions } = require('../services/aiChatService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory conversation storage (for development)
// In production, use MongoDB ChatSession model
const conversations = new Map();

// Optional authentication middleware - doesn't block if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // If token is invalid, just continue without user
      console.log('Optional auth failed (continuing without user):', error.message);
    }
  }
  next();
};

// @route   POST /api/chat/message
// @desc    Send a message to AI and get response
// @access  Public (but user info is optional for better experience)
router.post('/message', optionalAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Mesaj boş olamaz'
      });
    }

    // Get user ID if authenticated
    const userId = req.user?._id || null;

    console.log('Chat message received. User:', userId ? userId.toString() : 'not authenticated');

    // Get or create conversation history
    const conversationKey = sessionId || 'default';
    let conversationHistory = conversations.get(conversationKey) || [];

    // Call AI service
    const aiResponse = await chat(message, conversationHistory, userId);

    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: aiResponse.error,
        details: aiResponse.details
      });
    }

    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse.message }
    );

    // Keep only last 10 messages to avoid token limits
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    conversations.set(conversationKey, conversationHistory);

    // Clean up old conversations (simple memory management)
    if (conversations.size > 1000) {
      const firstKey = conversations.keys().next().value;
      conversations.delete(firstKey);
    }

    res.json({
      success: true,
      data: {
        message: aiResponse.message,
        sessionId: conversationKey,
        functionCalled: aiResponse.functionCalled,
        functionResult: aiResponse.functionResult,
        usage: aiResponse.usage
      }
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      success: false,
      message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      error: error.message
    });
  }
});

// @route   GET /api/chat/history/:sessionId
// @desc    Get conversation history
// @access  Public
router.get('/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = conversations.get(sessionId) || [];

    res.json({
      success: true,
      data: {
        sessionId,
        messages: history,
        count: history.length
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Sohbet geçmişi alınırken bir hata oluştu',
      error: error.message
    });
  }
});

// @route   POST /api/chat/clear
// @desc    Clear conversation history
// @access  Public
router.post('/clear', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId && conversations.has(sessionId)) {
      conversations.delete(sessionId);
    }

    res.json({
      success: true,
      message: 'Sohbet geçmişi temizlendi'
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Sohbet temizlenirken bir hata oluştu',
      error: error.message
    });
  }
});

// @route   GET /api/chat/suggestions
// @desc    Get quick action suggestions
// @access  Public
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = getQuickSuggestions();

    res.json({
      success: true,
      data: {
        suggestions
      }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Öneriler alınırken bir hata oluştu',
      error: error.message
    });
  }
});

// @route   DELETE /api/chat/sessions
// @desc    Clear all sessions (admin only - for development)
// @access  Private/Admin
router.delete('/sessions', protect, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    const count = conversations.size;
    conversations.clear();

    res.json({
      success: true,
      message: `${count} sohbet oturumu temizlendi`
    });
  } catch (error) {
    console.error('Clear sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Oturumlar temizlenirken bir hata oluştu',
      error: error.message
    });
  }
});

module.exports = router;
