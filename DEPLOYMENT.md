# Render Deployment Guide

Bu rehber, Health Tourism Platform projesini Render'a deploy etmek için gerekli adımları açıklar.

## Ön Gereksinimler

1. **MongoDB Atlas Hesabı**
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
   - Yeni bir cluster oluşturun (M0 Sandbox - Ücretsiz)
   - Database user oluşturun
   - Network Access'te IP whitelist ayarlayın (0.0.0.0/0 - tüm IP'ler)
   - Connection string'i alın

2. **Render Hesabı**
   - [Render](https://render.com) hesabı oluşturun
   - GitHub hesabınızı bağlayın

## Deployment Adımları

### 1. MongoDB Atlas Kurulumu

1. MongoDB Atlas'ta yeni cluster oluşturun
2. Database Access'te yeni user oluşturun:
   - Username: `health-tourism-user`
   - Password: Güçlü bir şifre oluşturun
   - Role: `Atlas admin` veya `Read and write to any database`

3. Network Access'te IP whitelist ekleyin:
   - `0.0.0.0/0` (tüm IP'ler için)

4. Connection string'i kopyalayın:
   ```
   mongodb+srv://health-tourism-user:<password>@cluster0.xxxxx.mongodb.net/health-tourism?retryWrites=true&w=majority
   ```

### 2. Render'da Backend Deploy

1. Render Dashboard'a gidin
2. "New +" butonuna tıklayın
3. "Web Service" seçin
4. GitHub repository'nizi seçin
5. Aşağıdaki ayarları yapın:

**Basic Settings:**
- Name: `health-tourism-backend`
- Runtime: `Node`
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://health-tourism-user:<password>@cluster0.xxxxx.mongodb.net/health-tourism?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-at-least-32-characters
JWT_EXPIRE=7d
```

6. "Create Web Service" butonuna tıklayın

### 3. Render'da Frontend Deploy

1. Yeni bir "Web Service" oluşturun
2. Aynı GitHub repository'yi seçin
3. Aşağıdaki ayarları yapın:

**Basic Settings:**
- Name: `health-tourism-frontend`
- Runtime: `Static Site`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://health-tourism-backend.onrender.com/api
VITE_NODE_ENV=production
```

4. "Create Web Service" butonuna tıklayın

### 4. CORS Ayarları

Backend deploy edildikten sonra:

1. Frontend URL'ini alın (örn: `https://health-tourism-frontend.onrender.com`)
2. Backend environment variables'a ekleyin:
```
FRONTEND_URL=https://health-tourism-frontend.onrender.com
```

### 5. Domain Ayarları (Opsiyonel)

Kendi domain'inizi kullanmak istiyorsanız:
1. Render Dashboard'da service'inizi seçin
2. "Settings" > "Custom Domains" bölümüne gidin
3. Domain'inizi ekleyin ve DNS ayarlarını yapın

## Önemli Notlar

### Environment Variables
- `JWT_SECRET`: En az 32 karakter uzunluğunda güçlü bir key olmalı
- `MONGODB_URI`: MongoDB Atlas connection string'i
- `FRONTEND_URL`: Frontend'in deploy URL'i

### Free Tier Limitasyonları
- Render free tier'da servisler 15 dakika inaktivite sonrası uyur
- İlk request'te 30-60 saniye gecikme olabilir
- Aylık 750 saat limit var

### Monitoring
- Render Dashboard'dan logs'ları takip edebilirsiniz
- Health check endpoint: `/health`
- API info endpoint: `/api`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - MongoDB Atlas IP whitelist'ini kontrol edin
   - Connection string'in doğru olduğundan emin olun
   - Database user permissions'ını kontrol edin

2. **CORS Errors**
   - Frontend URL'inin backend environment variables'a eklendiğinden emin olun
   - Browser cache'ini temizleyin

3. **Build Errors**
   - Package.json dependencies'inin güncel olduğundan emin olun
   - Node.js version uyumluluğunu kontrol edin

4. **Service Sleep Issues**
   - Free tier'da servisler 15 dakika sonra uyur
   - Paid plan'a geçerek bu sorunu çözebilirsiniz

## Test Etme

Deploy sonrası test etmek için:

1. Backend health check: `https://your-backend-url.onrender.com/health`
2. Frontend: `https://your-frontend-url.onrender.com`
3. API endpoints: `https://your-backend-url.onrender.com/api`

## Güvenlik

Production'da mutlaka:
- Güçlü JWT secret kullanın
- Environment variables'ı güvenli tutun
- HTTPS kullanın (Render otomatik sağlar)
- Rate limiting aktif edin
- Input validation yapın

## Backup

- MongoDB Atlas otomatik backup sağlar
- Render'da manual backup yoktur
- Önemli data'yı düzenli export edin
