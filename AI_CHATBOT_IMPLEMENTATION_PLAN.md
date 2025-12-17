# AI Chatbot Özelliği İmplementasyon Planı

## Genel Bakış
"Ask AI" butonuna tıklandığında, kullanıcıların bir AI chatbot ile sohbet ederek seyahatlerini planlayabilecekleri, paket rezervasyonu yapabilecekleri ve sitenin tüm özelliklerini kullanabilecekleri bir chatbot sistemi oluşturulacak.

## Mevcut Durum Analizi

### Frontend
- **Teknoloji Stack**: React + Vite, Tailwind CSS
- **Mevcut Chat Sayfası**: `src/components/HealthTourismPlatform.jsx` içinde basit bir chat arayüzü mevcut (satır 690-774)
- **Mevcut Chat Fonksiyonu**: Sadece statik/mock yanıtlar veriyor (satır 139-158)
- **API Servisleri**: `src/services/api.js` - Tüm API endpoints tanımlı

### Backend
- **Teknoloji Stack**: Node.js + Express, MongoDB
- **AI Paketi Mevcut**: `openai` paketi zaten yüklü (package.json satır 34)
- **OPENAI_API_KEY**: .env dosyasında tanımlı ama key girilmemiş
- **Chat Endpoint**: Henüz yok (server.js satır 323 - yorum satırı olarak görünüyor)

## İmplementasyon Yaklaşımları

### Yaklaşım 1: OpenAI GPT-4 ile Gerçek AI Chatbot (Önerilen)
**Avantajları:**
- En akıllı ve doğal konuşma deneyimi
- Function calling ile platform özelliklerini kullanabilir
- Türkçe desteği mükemmel
- GPT-4o mini kullanılırsa maliyet düşük

**Dezavantajları:**
- OpenAI API key gerekli
- API çağrısı başına maliyet (ancak GPT-4o mini çok ucuz)
- İnternet bağlantısı gerekli

**Maliyet Tahmini:**
- GPT-4o mini: ~$0.00015 per 1K input tokens
- Ortalama sohbet: ~2000 token = $0.0006 (çok düşük)

### Yaklaşım 2: Açık Kaynak Model (Mistral/Llama) ile Self-Hosted
**Avantajları:**
- API maliyeti yok
- Tam kontrol
- Veri gizliliği

**Dezavantajları:**
- Sunucu maliyeti yüksek (GPU gerekli)
- Setup ve maintenance karmaşık
- Performans GPT-4'ten düşük

### Yaklaşım 3: Hibrit - Kural Tabanlı + AI
**Avantajları:**
- Basit sorular için hızlı yanıt
- Maliyeti minimize eder
- Kontrollü deneyim

**Dezavantajları:**
- Daha az doğal konuşma
- Ekstra kod karmaşıklığı

## Önerilen Yaklaşım: OpenAI GPT-4o Mini
Bu proje için **Yaklaşım 1** önerilir çünkü:
1. Maliyet çok düşük (GPT-4o mini)
2. Setup basit (sadece API key)
3. En iyi kullanıcı deneyimi
4. Türkçe desteği mükemmel
5. Function calling ile platform entegrasyonu kolay

## Detaylı İmplementasyon Planı

### Faz 1: Backend - AI Chat Service Oluşturma

#### 1.1 OpenAI Service Oluşturma
**Dosya:** `backend/src/services/aiChatService.js`

**Özellikler:**
- OpenAI client kurulumu
- Chat completion API entegrasyonu
- Conversation history yönetimi
- Function calling setup
- Error handling ve retry logic

**Function Calling Yetenekleri:**
- `searchPackages`: Paket arama
- `getPackageDetails`: Paket detayları
- `createBooking`: Rezervasyon oluşturma
- `getUserBookings`: Kullanıcı rezervasyonları
- `updateUserPreferences`: Tercih güncelleme
- `searchByBudget`: Bütçeye göre arama
- `filterByLocation`: Lokasyona göre filtreleme
- `getAvailableDates`: Müsait tarihler

#### 1.2 Chat Routes Oluşturma
**Dosya:** `backend/src/routes/chat.js`

**Endpoints:**
- `POST /api/chat/message` - Mesaj gönder, AI yanıtı al
- `GET /api/chat/history` - Sohbet geçmişi
- `POST /api/chat/clear` - Sohbet temizle
- `GET /api/chat/suggestions` - Hızlı sorular/öneriler

#### 1.3 Chat Model Oluşturma (İsteğe bağlı)
**Dosya:** `backend/src/models/ChatSession.js`

Sohbet geçmişini saklamak için:
- userId (ref: User)
- sessionId
- messages: [{ role, content, timestamp }]
- context (user preferences, current package, etc.)
- createdAt, updatedAt

### Faz 2: Frontend - Chat Arayüzü Geliştirme

#### 2.1 Chat Service Oluşturma
**Dosya:** `src/services/chatService.js`

**Fonksiyonlar:**
- `sendMessage(message, sessionId)`
- `getChatHistory(sessionId)`
- `clearChat(sessionId)`
- `getSuggestions()`

#### 2.2 Gelişmiş Chat Component
**Dosya:** `src/components/AIChat.jsx`

**Özellikler:**
- **Message Display:**
  - Kullanıcı mesajları (sağda, mavi)
  - AI mesajları (solda, gri)
  - Typing indicator (AI düşünürken)
  - Markdown desteği (linkler, listeler vb.)

- **Input Area:**
  - Multi-line text input
  - Send butonu
  - Enter tuşu ile gönderme
  - Shift+Enter ile yeni satır

- **Quick Actions:**
  - Önerilen sorular (bubbles)
  - "Paket ara", "Rezervasyonlarım", "Bütçeme uygun paketler" gibi

- **Context Display:**
  - Görüntülenen paket bilgisi
  - Seçili filtreler
  - Kullanıcı tercihleri

- **Chat History:**
  - Önceki mesajları scroll
  - Temizle butonu
  - Export özelliği

#### 2.3 Mevcut Chat Sayfasını Güncelleme
**Dosya:** `src/components/HealthTourismPlatform.jsx`

`renderChatPage()` fonksiyonunu yeni AIChat component'i ile değiştir.

### Faz 3: AI Prompt Engineering

#### 3.1 System Prompt Tasarımı
```
Siz HealthJourney platformunun AI sağlık turizmi danışmanısınız.

GÖREVİNİZ:
- Kullanıcılara sağlık turizmi paketleri bulmada yardımcı olmak
- Paket rezervasyonu yapmalarına yardım etmek
- Bütçe, lokasyon, tarih ve hizmet tercihlerine göre öneriler sunmak
- Tüm platform özelliklerini konuşma yoluyla erişilebilir kılmak

KURALLARI:
- Her zaman Türkçe konuşun (kullanıcı İngilizce yazmadıkça)
- Samimi ve yardımsever olun
- Kısa ve net yanıtlar verin
- Paket önerirken nedenleri açıklayın
- Fiyatları her zaman doğru belirtin
- Kullanıcı bilgilerini gizli tutun

YETKİLERİNİZ:
- Paket arama ve filtreleme
- Rezervasyon oluşturma
- Kullanıcı tercihlerini güncelleme
- Mevcut rezervasyonları görüntüleme
```

#### 3.2 Conversation Flow Örnekleri
**Senaryo 1: Paket Arama**
```
Kullanıcı: "Bütçem 1000 euro, termal spa arıyorum"
AI: [searchPackages fonksiyonunu çağırır]
AI: "1000 euro bütçenizle 3 harika termal spa paketi buldum:
1. Pamukkale Wellness & Spa - €850 (5 gün)
2. Bursa Termal - €920 (4 gün)
3. Afyon Kaplıcaları - €780 (6 gün)

Hangi şehir daha çok ilginizi çekiyor?"
```

**Senaryo 2: Rezervasyon**
```
Kullanıcı: "Pamukkale paketini rezerve etmek istiyorum"
AI: [getPackageDetails + createBooking fonksiyonunu çağırır]
AI: "Harika seçim! Pamukkale Wellness & Spa paketinizi rezerve ediyorum.

📦 Paket Detayları:
- 5 gün, 4 gece konaklama
- Günlük termal spa
- 2 doktor konsültasyonu
- Havalimanı transferi
- Toplam: €850

Hangi tarihlerde seyahat etmek istersiniz?"
```

### Faz 4: Entegrasyon ve Test

#### 4.1 API Entegrasyonu
- Chat service'i tüm mevcut API'lerle bağla
- Package API
- Booking API
- User API
- Review API

#### 4.2 Function Calling Implementation
OpenAI'a şu fonksiyonları tanımla:
```javascript
const functions = [
  {
    name: "searchPackages",
    description: "Search health tourism packages by filters",
    parameters: {
      type: "object",
      properties: {
        category: { type: "string" },
        minPrice: { type: "number" },
        maxPrice: { type: "number" },
        location: { type: "string" },
        duration: { type: "number" }
      }
    }
  },
  // ... diğer fonksiyonlar
]
```

#### 4.3 Context Management
Her sohbette şu context'i koru:
- Kullanıcı tercihleri (budget, location, dates)
- Görüntülenen paketler
- Aktif rezervasyon süreci
- Önceki sorular ve yanıtlar

### Faz 5: Kullanıcı Deneyimi İyileştirmeleri

#### 5.1 Gelişmiş Özellikler
- **Voice Input:** Web Speech API ile sesli mesaj
- **Typing Indicator:** AI yanıt hazırlarken animasyon
- **Message Actions:** Mesajı kopyala, paylaş
- **Quick Replies:** AI'ın önerdiği hızlı yanıt butonları
- **Package Cards in Chat:** Paket önerilerini kart olarak göster
- **Rich Responses:** Resimler, haritalar, fiyat karşılaştırmaları

#### 5.2 Mobile Responsive
- Chat tam ekran modal (mobilde)
- Swipe to close
- Keyboard optimizasyonu

#### 5.3 Accessibility
- Keyboard navigation
- Screen reader desteği
- ARIA labels

### Faz 6: Performans ve Güvenlik

#### 6.1 Optimizasyon
- Response caching (benzer sorular için)
- Request debouncing
- Lazy loading chat history
- Message pagination

#### 6.2 Güvenlik
- Rate limiting (max 50 mesaj/saat per user)
- Input sanitization
- API key güvenliği
- User data encryption

#### 6.3 Monitoring
- Chat session analytics
- AI response quality tracking
- Error logging
- User satisfaction feedback

## Dosya Yapısı

```
Health Tourism Platform/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── aiChatService.js         [YENİ]
│   │   ├── routes/
│   │   │   └── chat.js                  [YENİ]
│   │   ├── models/
│   │   │   └── ChatSession.js           [YENİ - İsteğe bağlı]
│   │   └── server.js                    [GÜNCELLE]
│   └── .env                              [GÜNCELLE - API key ekle]
│
└── src/
    ├── components/
    │   ├── AIChat.jsx                    [YENİ]
    │   ├── ChatMessage.jsx               [YENİ]
    │   ├── ChatInput.jsx                 [YENİ]
    │   ├── QuickActions.jsx              [YENİ]
    │   ├── PackageCard.jsx               [YENİ - Chat içinde paket gösterimi]
    │   └── HealthTourismPlatform.jsx     [GÜNCELLE]
    └── services/
        └── chatService.js                [YENİ]
```

## İmplementasyon Sırası

### Sprint 1 (Backend Foundation)
1. ✅ OpenAI API key almak
2. ✅ `aiChatService.js` oluştur
3. ✅ Basit chat endpoint oluştur
4. ✅ Function calling setup
5. ✅ Test et (Postman/Thunder Client)

### Sprint 2 (Frontend Foundation)
1. ✅ `chatService.js` oluştur
2. ✅ Basit `AIChat.jsx` component
3. ✅ Mevcut chat sayfasını güncelle
4. ✅ Backend ile bağlan
5. ✅ Basit mesajlaşma test et

### Sprint 3 (Function Calling & Intelligence)
1. ✅ Package search function ekle
2. ✅ Booking function ekle
3. ✅ User preferences function ekle
4. ✅ Context management ekle
5. ✅ Conversation flow test et

### Sprint 4 (UX Enhancement)
1. ✅ Package cards in chat
2. ✅ Quick action buttons
3. ✅ Typing indicator
4. ✅ Message formatting (Markdown)
5. ✅ Mobile responsive

### Sprint 5 (Polish & Production)
1. ✅ Error handling
2. ✅ Rate limiting
3. ✅ Analytics
4. ✅ Performance optimization
5. ✅ Production deployment

## Örnek Kullanıcı Akışları

### Akış 1: Yeni Kullanıcı - Paket Bulma
```
1. Kullanıcı "Ask AI" butonuna tıklar
2. AI: "Merhaba! Size nasıl yardımcı olabilirim?"
3. Kullanıcı: "Diş tedavisi için paket arıyorum"
4. AI: [searchPackages çağırır]
5. AI: "3 diş tedavisi paketi buldum..." [paketleri kartlar halinde gösterir]
6. Kullanıcı: "İstanbul olanı detaylı göster"
7. AI: [getPackageDetails çağırır]
8. AI: "İstanbul Dental Care paketi..." [tüm detayları gösterir]
9. Kullanıcı: "Rezerve etmek istiyorum"
10. AI: [auth kontrolü] "Rezervasyon için giriş yapmanız gerekiyor"
11. Kullanıcı giriş yapar
12. AI: [createBooking çağırır] "Rezervasyonunuz oluşturuldu!"
```

### Akış 2: Kayıtlı Kullanıcı - Rezervasyon Kontrolü
```
1. Kullanıcı: "Rezervasyonlarımı göster"
2. AI: [getUserBookings çağırır]
3. AI: "2 aktif rezervasyonunuz var..." [listeyi gösterir]
4. Kullanıcı: "Pamukkale rezervasyonumu iptal edebilir miyim?"
5. AI: "Pamukkale rezervasyonunuz 15 Ocak için. İptal etmek istediğinize emin misiniz?"
6. Kullanıcı: "Evet"
7. AI: [cancelBooking çağırır] "Rezervasyonunuz iptal edildi"
```

### Akış 3: Bütçe Bazlı Arama
```
1. Kullanıcı: "1500 euro bütçem var, ne önerirsin?"
2. AI: "1500 euro harika bir bütçe! Hangi tür tedavi arıyorsunuz?"
3. Kullanıcı: "Saç ekimi + dinlenme"
4. AI: [searchPackages çağırır]
5. AI: "Bütçenize mükemmel uygun 2 paket buldum..." [önerileri gösterir]
```

## Gelecek Geliştirmeler (v2.0)

### Faz 2 Özellikler
- Multi-language support (İngilizce, Arapça, Rusça)
- Voice output (Text-to-speech)
- Image recognition (fotoğraf yükleme)
- Video call scheduling
- WhatsApp/Telegram integration
- Email summary (sohbet özeti mail)
- PDF itinerary generation
- Payment via chat
- Real-time availability check
- Live human takeover (escalation)

### AI Model Alternatifleri
- GPT-4 Turbo (daha akıllı ama pahalı)
- Claude 3 (Anthropic - rekabet)
- Gemini Pro (Google - bedava tier)
- Custom fine-tuned model (özel eğitim)

## Maliyet Analizi

### Aylık Tahmini Maliyet (1000 aktif kullanıcı)
- Ortalama 5 sohbet/kullanıcı/ay = 5000 sohbet
- Ortalama 20 mesaj/sohbet = 100,000 mesaj
- Ortalama 2000 token/sohbet = 10M token
- GPT-4o mini: $0.15/$1M input token
- **Toplam: ~$1.50/ay** (çok düşük!)

### Karşılaştırma
- Müşteri hizmetleri çalışanı: $2000/ay
- AI chatbot: $1.50/ay
- **ROI: %99.9 maliyet tasarrufu**

## Başarı Metrikleri

### KPI'lar
- Chat engagement rate (% kullanıcı chat kullanıyor)
- Conversion rate (chat → booking)
- Average session duration
- User satisfaction score
- Resolution rate (AI soruyu çözebiliyor mu)
- Escalation rate (insana yönlendirme oranı)

### Hedefler (3 ay sonra)
- 40%+ engagement rate
- 15%+ conversion rate
- 4.5/5 satisfaction score
- 80%+ resolution rate

## Risk Analizi ve Mitigasyon

### Risk 1: OpenAI API Kesintisi
**Mitigasyon:**
- Fallback mekanizması (basit kural tabanlı chat)
- Error mesajları ve retry logic
- Alternatif AI provider hazırlığı (Anthropic Claude)

### Risk 2: Hatalı AI Yanıtları
**Mitigasyon:**
- Strict system prompts
- Response validation
- Fiyat/tarih bilgilerini her zaman API'den al
- "Emin değilim, bir müşteri temsilcisi ile görüşün" seçeneği

### Risk 3: Yüksek Maliyet
**Mitigasyon:**
- Rate limiting (max 50 mesaj/saat)
- Response caching
- GPT-4o mini kullanımı (en ucuz model)
- Token limit (max 4000 token/sohbet)

### Risk 4: Kötüye Kullanım (Spam)
**Mitigasyon:**
- User authentication zorunlu
- IP-based rate limiting
- Suspicious activity detection
- CAPTCHA (gerekirse)

## Önerilen Roadmap Timeline

### Hafta 1-2: Setup & Backend
- OpenAI entegrasyonu
- Chat API endpoints
- Function calling setup
- Basic testing

### Hafta 3-4: Frontend Core
- Chat UI component
- Message display
- API entegrasyonu
- Basic chat flow

### Hafta 5-6: Intelligence & Functions
- Package search function
- Booking function
- User preferences
- Advanced prompts

### Hafta 7-8: UX & Polish
- Package cards
- Quick actions
- Mobile responsive
- Error handling

### Hafta 9-10: Testing & Launch
- End-to-end testing
- Bug fixes
- Performance optimization
- Production deployment

**Toplam: 10 hafta (2.5 ay)**

## Sonraki Adımlar

1. ✅ **OpenAI API Key Alma**: https://platform.openai.com/api-keys
2. ✅ **Backend aiChatService.js dosyasını oluştur**
3. ✅ **Chat endpoint'i ekle**
4. ✅ **Basit test yap (Postman)**
5. ✅ **Frontend chatService.js oluştur**
6. ✅ **AIChat component'i yaz**
7. ✅ **End-to-end test**
8. ✅ **Production deploy**

## Sorular ve Açıklamalar

### Soru 1: OpenAI API key'i nasıl alınır?
1. https://platform.openai.com adresine git
2. Hesap oluştur/giriş yap
3. API keys bölümüne git
4. "Create new secret key" tıkla
5. Key'i kopyala ve `.env` dosyasına ekle

### Soru 2: Hangi GPT modeli kullanılmalı?
- **GPT-4o mini**: Önerilen, ucuz ve hızlı ($0.15/$1M token)
- **GPT-4o**: Daha akıllı ama pahalı ($5/$1M token)
- **GPT-3.5 Turbo**: Eski, önerilmez

### Soru 3: Function calling nedir?
AI'ın backend fonksiyonlarını çağırabilmesi. Örnek:
```javascript
// AI "Paket ara" dediğinde:
{
  role: "assistant",
  function_call: {
    name: "searchPackages",
    arguments: '{"category":"dental","maxPrice":1000}'
  }
}

// Backend bu fonksiyonu çalıştırır ve sonucu AI'a verir
```

### Soru 4: Chat geçmişi nerede saklanır?
İki seçenek:
1. **MongoDB**: Kalıcı, her sohbeti sakla (önerilen production için)
2. **Memory**: Geçici, session bazlı (development için)

### Soru 5: Türkçe desteği nasıl?
GPT-4o mini Türkçe'de mükemmel. System prompt'ta "Her zaman Türkçe konuş" dersen sorun olmaz.

## Ekler

### Ek A: Örnek API Requests/Responses
```javascript
// Request
POST /api/chat/message
{
  "message": "Diş tedavisi paketi arıyorum",
  "sessionId": "abc123"
}

// Response
{
  "success": true,
  "data": {
    "message": "Diş tedavisi için 3 harika paketimiz var...",
    "packages": [...],
    "suggestions": ["Detayları göster", "Rezerve et", "Fiyat karşılaştır"]
  }
}
```

### Ek B: Örnek System Prompt
```
Sen HealthJourney'in AI asistanısın. Görevin kullanıcılara sağlık turizmi paketleri bulmak ve rezervasyon yapmak.

KURALLAR:
1. Türkçe konuş
2. Kısa ve öz yanıtlar ver
3. Her zaman yardımsever ol
4. Fiyatları doğru belirt
5. Kullanıcı verilerini koru

FONKSİYONLARIN:
- searchPackages: Paket ara
- createBooking: Rezervasyon oluştur
- getUserBookings: Rezervasyonları göster
...
```

### Ek C: Test Scenarios
1. ✅ Yeni kullanıcı paket arama
2. ✅ Kayıtlı kullanıcı rezervasyon
3. ✅ Bütçe bazlı arama
4. ✅ Lokasyon filtreleme
5. ✅ Tarih kontrolü
6. ✅ Rezervasyon iptali
7. ✅ Error handling (API down)
8. ✅ Rate limiting test
9. ✅ Multi-turn conversation
10. ✅ Context management

---

**Bu plan hazır! İmplementasyon için onay bekliyorum. Başlamak için hangi sprint'ten başlamak istersiniz?**
