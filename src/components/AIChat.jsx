import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, Loader, Sparkles, MapPin, DollarSign, Calendar, ArrowLeft, X } from 'lucide-react';
import chatService from '../services/chatService';

const AIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'Merhaba! Ben HealthJourney AI asistanınızım. Size nasıl yardımcı olabilirim? Sağlık turizmi paketleri, rezervasyonlar ve daha fazlası hakkında sorularınızı yanıtlayabilirim.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const response = await chatService.getSuggestions();
      if (response.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSendMessage = async (messageText = null) => {
    const message = messageText || inputMessage.trim();

    if (!message) return;

    // Add user message to chat
    const userMessage = {
      type: 'user',
      text: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await chatService.sendMessage(message);

      if (response.success) {
        const aiMessage = {
          type: 'ai',
          text: response.data.message,
          timestamp: new Date(),
          functionCalled: response.data.functionCalled,
          functionResult: response.data.functionResult
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          type: 'ai',
          text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
          timestamp: new Date(),
          error: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage = {
        type: 'ai',
        text: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Tüm sohbet geçmişini silmek istediğinizden emin misiniz?')) {
      try {
        await chatService.clearChat();
        setMessages([
          {
            type: 'ai',
            text: 'Sohbet geçmişi temizlendi. Size nasıl yardımcı olabilirim?',
            timestamp: new Date()
          }
        ]);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Clear chat error:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  // Render package cards if function result contains packages
  const renderPackageCards = (packages) => {
    if (!packages || packages.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h4 className="font-semibold text-gray-800 mb-1">{pkg.title}</h4>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{pkg.location}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{pkg.duration} gün</span>
              </div>
              <div className="flex items-center text-blue-600 font-semibold">
                <DollarSign className="h-4 w-4" />
                <span>{pkg.price} {pkg.currency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Ana sayfaya dön"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Sparkles className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">AI Sağlık Turizmi Danışmanı</h2>
            <p className="text-xs text-blue-100">Powered by GPT-4o mini</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Sohbeti temizle"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] lg:max-w-[70%] rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.error
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>

              {/* Render package cards if available */}
              {message.functionResult?.packages &&
                renderPackageCards(message.functionResult.packages)}

              {/* Render bookings if available */}
              {message.functionResult?.bookings && message.functionResult.bookings.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.functionResult.bookings.map((booking, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded p-2 text-sm"
                    >
                      <p className="font-semibold">{booking.packageTitle}</p>
                      <p className="text-gray-600">
                        Durum: <span className="font-medium">{booking.status}</span>
                      </p>
                      <p className="text-gray-600">
                        Toplam: {booking.totalPrice} {booking.currency || '€'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Render new booking confirmation if available */}
              {message.functionResult?.booking && (
                <div className="mt-3 bg-green-50 border border-green-300 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="text-green-600 mt-0.5">✓</div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-green-800 mb-1">
                        Rezervasyon Oluşturuldu!
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Rezervasyon No:</span> {message.functionResult.booking.bookingNumber}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Paket:</span> {message.functionResult.booking.packageTitle}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Tarih:</span> {new Date(message.functionResult.booking.startDate).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Kişi Sayısı:</span> {message.functionResult.booking.numberOfPeople}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Toplam:</span> {message.functionResult.booking.totalPrice} {message.functionResult.booking.currency}
                      </p>
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Durum:</span> <span className="text-yellow-600">Ödeme Bekleniyor</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI düşünüyor...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Hızlı Sorular:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-white text-gray-700 px-3 py-2 rounded-full border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın... (Enter: gönder, Shift+Enter: yeni satır)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          AI bazen hata yapabilir. Önemli bilgiler için doğrulama yapın.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
