# AI Chatbot Rezervasyon Test Senaryoları

Bu senaryolar AI chatbot'un rezervasyon yapma ve yönetme yeteneklerini test etmek için kullanılır.

## ÖNEMLİ: Test Öncesi Gereksinimler

1. ✅ **Kullanıcı girişi yapılmalı**: Rezervasyon yapmak için giriş yapmış olmanız gerekiyor
   - **ÖNERİLEN Test Kullanıcıları** (normal kullanıcı olarak kalırsınız):
     - alice.johnson@email.com / password123
     - michael.smith@email.com / password123
     - sarah.wilson@email.com / password123
   - ⚠️ Admin kullanmayın: admin@healthjourney.com giriş yapınca admin paneline yönlendiriyor

2. ✅ Backend sunucusu çalışıyor olmalı (http://localhost:5001)

3. ✅ Frontend çalışıyor olmalı (http://localhost:5173)

---

## Senaryo 1: Basit Rezervasyon Yapma

**Hedef**: Kullanıcı bir paket arayıp doğrudan rezervasyon yapmalı

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**: "Ask AI" butonuna tıkla
3. **Paket ara**: "5 günlük wellness paketi arıyorum"
4. **Paket seç**: AI'nin önerdiği paketlerden birini seç (örn: "Bodrum Luxury Wellness & Spa" veya "Wellness & Thermal Spa Retreat")
5. **Rezervasyon yap**: "Bodrum Luxury Wellness & Spa paketini 20 Mart 2025 tarihinde 2 kişi için rezerve etmek istiyorum"

**Beklenen Sonuç**:
- ✅ AI, createBooking fonksiyonunu çağırmalı
- ✅ Rezervasyon başarıyla oluşturulmalı
- ✅ Yeşil onay kutusu ile rezervasyon detayları gösterilmeli:
  - Rezervasyon numarası
  - Paket adı
  - Başlangıç tarihi
  - Kişi sayısı
  - Toplam fiyat (1150 EUR × 2 = 2300 EUR)
  - Durum: "Ödeme Bekleniyor"
- ✅ AI teşekkür mesajı ve sonraki adımlar hakkında bilgi vermeli

**Test Mesajları**:
```
1. "5 günlük wellness paketi arıyorum"
2. "Bodrum Luxury Wellness & Spa paketini 20 Mart 2025 tarihinde 2 kişi için rezerve etmek istiyorum"
```

---

## Senaryo 2: Rezervasyon Yapma - Özel İsteklerle

**Hedef**: Kullanıcı özel istekleriyle birlikte rezervasyon yapmalı

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**
3. **Paket ara**: "İstanbul'da diş tedavisi paketi"
4. **Rezervasyon yap özel istekle**: "Dental Care Excellence Package'ı 15 Nisan 2025 için rezerve et. Özel isteğim: Vejetaryen yemek menüsü ve havalimanı karşılaması öğleden sonra 14:00"

**Beklenen Sonuç**:
- ✅ Rezervasyon oluşturulmalı
- ✅ specialRequests alanında özel istek kaydedilmeli
- ✅ AI, özel isteklerin alındığını onaylamalı

**Test Mesajı**:
```
1. "İstanbul'da diş tedavisi paketi"
2. "Dental Care Excellence Package'ı 15 Nisan 2025 için rezerve et. Özel isteğim: Vejetaryen yemek menüsü ve havalimanı karşılaması öğleden sonra 14:00"
```

---

## Senaryo 3: Rezervasyonlarımı Görüntüleme

**Hedef**: Kullanıcı mevcut rezervasyonlarını görüntülemeli

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**
3. **Rezervasyonları sorgula**: "Mevcut rezervasyonlarımı göster"

**Beklenen Sonuç**:
- ✅ AI, getUserBookings fonksiyonunu çağırmalı
- ✅ Kullanıcının tüm rezervasyonları listelenmelidir
- ✅ Her rezervasyon için:
  - Paket adı
  - Durum
  - Toplam fiyat
  - Para birimi
- ✅ Eğer rezervasyon yoksa "Henüz rezervasyonunuz yok" mesajı gösterilmeli

**Test Mesajları**:
```
1. "Mevcut rezervasyonlarımı göster"
VEYA
2. "Rezervasyonlarım neler?"
VEYA
3. "Geçmiş seyahatlerimi görmek istiyorum"
```

---

## Senaryo 4: Giriş Yapmadan Rezervasyon Denemesi

**Hedef**: Giriş yapmamış kullanıcı rezervasyon yapmaya çalışırsa uyarı almalı

**Adımlar**:
1. **Çıkış yap** (eğer giriş yapmışsan)
2. **AI Chat'i aç**
3. **Paket ara**: "Bursa termal spa paketi"
4. **Rezervasyon dene**: "Bu paketi yarın için rezerve etmek istiyorum"

**Beklenen Sonuç**:
- ✅ AI, rezervasyon yapılamayacağını bildirmeli
- ✅ Hata mesajı: "Rezervasyon yapmak için giriş yapmanız gerekiyor"
- ✅ AI, kullanıcıyı giriş yapmaya yönlendirmeli

**Test Mesajları**:
```
1. "Bursa termal spa paketi"
2. "Bu paketi yarın için rezerve etmek istiyorum"
```

---

## Senaryo 5: Çoklu Kişi Rezervasyonu

**Hedef**: Kullanıcı birden fazla kişi için rezervasyon yapmalı

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**
3. **Paket ara**: "Bodrum'da lüks wellness paketi"
4. **Grup rezervasyonu**: "Bodrum Luxury Wellness & Spa paketini 1 Haziran 2025 için 4 kişi rezerve et"

**Beklenen Sonuç**:
- ✅ numberOfPeople: 4 olarak kaydedilmeli
- ✅ Toplam fiyat = basePrice × 4 olarak hesaplanmalı
- ✅ AI, toplam fiyatı ve kişi sayısını onaylamalı

**Test Mesajları**:
```
1. "Bodrum'da lüks wellness paketi"
2. "Bodrum Luxury Wellness & Spa paketini 1 Haziran 2025 için 4 kişi rezerve et"
```

---

## Senaryo 6: Konuşma Akışında Rezervasyon

**Hedef**: Kullanıcı doğal bir konuşma akışında rezervasyon yapmalı

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**
3. **Genel soru**: "5-6 günlük wellness paketleriniz var mı?"
4. **Detay iste**: "Bodrum Luxury Wellness & Spa hakkında daha fazla bilgi verir misin?"
5. **Rezervasyon kararı**: "Bu paketi beğendim, 10 Nisan 2025 için rezervasyon yapmak istiyorum"

**Beklenen Sonuç**:
- ✅ AI, tüm konuşma boyunca bağlamı korumalı
- ✅ Hangi paketten bahsedildiğini anlamalı
- ✅ Rezervasyon başarıyla oluşturulmalı
- ✅ Tüm detaylar doğru kaydedilmeli

**Test Mesajları**:
```
1. "5-6 günlük wellness paketleriniz var mı?"
2. "Bodrum Luxury Wellness & Spa hakkında daha fazla bilgi verir misin?"
3. "Bu paketi beğendim, 10 Nisan 2025 için rezervasyon yapmak istiyorum"
```

---

## Senaryo 7: Geçersiz Tarihle Rezervasyon

**Hedef**: Kullanıcı geçmiş tarih veya geçersiz tarih formatında rezervasyon yaparsa hata almalı

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**
3. **Paket ara**: "Wellness paketi"
4. **Geçmiş tarih dene**: "Bu paketi dün için rezerve et"

**Beklenen Sonuç**:
- ✅ AI, geçersiz tarih olduğunu fark etmeli
- ✅ Kullanıcıdan geçerli bir gelecek tarih istemeli
- ✅ Tarih formatı hakkında yardımcı olmalı

**Test Mesajları**:
```
1. "Wellness paketi"
2. "Bu paketi dün için rezerve et"
```

---

## Senaryo 8: Arama + Rezervasyon + Görüntüleme

**Hedef**: Tam bir rezervasyon döngüsünü test et

**Adımlar**:
1. **Giriş yap**: alice.johnson@email.com / password123
2. **AI Chat'i aç**
3. **Arama**: "700-900 Euro arası wellness paketleri"
4. **Rezervasyon**: "Bursa Thermal Spa & Wellness'i 5 Mayıs 2025 için 2 kişi rezerve et"
5. **Görüntüle**: "Yeni yaptığım rezervasyonu göster"

**Beklenen Sonuç**:
- ✅ Arama sonuçları doğru gösterilmeli
- ✅ Rezervasyon başarıyla oluşturulmalı
- ✅ getUserBookings sonucunda yeni rezervasyon görünmeli
- ✅ Tüm bilgiler tutarlı olmalı

**Test Mesajları**:
```
1. "700-900 Euro arası wellness paketleri"
2. "Bursa Thermal Spa & Wellness'i 5 Mayıs 2025 için 2 kişi rezerve et"
3. "Yeni yaptığım rezervasyonu göster"
```

---

## Test Kontrol Listesi

Her senaryo için kontrol edilmesi gerekenler:

### Fonksiyon Çağrıları
- [ ] Doğru fonksiyon çağrıldı mı? (createBooking, getUserBookings)
- [ ] Parametreler doğru mu? (packageId, startDate, numberOfPeople, specialRequests)
- [ ] userId backend'e doğru gönderildi mi?

### UI/UX
- [ ] Loading göstergesi göründü mü?
- [ ] Yeşil onay kutusu doğru görüntülendi mi?
- [ ] Rezervasyon detayları eksiksiz mi?
- [ ] Tarih formatı Türkçe mi (DD.MM.YYYY)?
- [ ] Hata mesajları anlaşılır mı?

### Backend
- [ ] Rezervasyon veritabanına kaydedildi mi?
- [ ] Rezervasyon numarası unique mi?
- [ ] Toplam fiyat doğru hesaplandı mı?
- [ ] specialRequests alanı doğru kaydedildi mi?
- [ ] Status "pending" olarak ayarlandı mı?
- [ ] bookingSource "ai-chat" olarak kaydedildi mi?

### AI Davranışı
- [ ] AI doğal ve yardımsever mi?
- [ ] Bağlamı koruyor mu?
- [ ] Eksik bilgi varsa soruyor mu?
- [ ] Rezervasyon sonrası teşekkür ediyor mu?
- [ ] Sonraki adımlar hakkında bilgi veriyor mu?

---

## Notlar

- **Test için normal kullanıcıları kullanın**:
  - alice.johnson@email.com / password123
  - michael.smith@email.com / password123
  - sarah.wilson@email.com / password123
- ⚠️ **Admin kullanmayın**: admin@healthjourney.com ile giriş yaparsanız admin paneline yönlendirilirsiniz
- Her testten sonra "Sohbeti Temizle" butonunu kullanarak yeni bir senaryo başlatın
- Tarihler her zaman gelecek tarih olmalı (bugünden sonra)
- Paket ID'leri her seeder çalıştırıldığında değişir, bu yüzden paket adlarını kullanın

---

## Sorun Giderme

**Rezervasyon oluşturulamıyor**:
- Giriş yaptığınızdan emin olun
- Backend çalışıyor mu kontrol edin
- Console'da hata var mı bakın

**Paket bulunamıyor**:
- Seeder çalıştırıldı mı kontrol edin
- Paket adını doğru yazdığınızdan emin olun
- Türkçe karakter sorunları için normalizasyon çalışıyor mu kontrol edin

**AI yanlış fonksiyon çağırıyor**:
- Promptunuzu daha açık yapın
- "rezerve et", "rezervasyon yap" gibi net kelimeler kullanın
- Tarih formatını net belirtin (örn: "20 Mart 2025")
