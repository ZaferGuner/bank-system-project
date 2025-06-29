# Güvenli Banka Sistemi API

Kapsamlı ve güvenilir banka sistemi backend API'si. FastAPI ile geliştirilmiş, JWT tabanlı kimlik doğrulama, SQLAlchemy ORM ve kapsamlı güvenlik özellikleri içerir.

## Özellikler

### Güvenlik
- JWT tabanlı kimlik doğrulama
- Bcrypt şifre hashleme
- Hesap kilitleme mekanizması
- Rate limiting ve güvenlik başlıkları
- Audit logging sistemi
- SQL injection koruması

### Banka İşlemleri
- Kullanıcı kayıt ve giriş sistemi
- Hesap oluşturma ve yönetimi
- Para transferi işlemleri
- Bakiye sorgulama
- İşlem geçmişi
- Günlük transfer limitleri

### Teknik Özellikler
- FastAPI framework
- SQLAlchemy ORM
- Pydantic veri validasyonu
- SQLite veritabanı
- Otomatik API dokümantasyonu
- Type hints desteği

## API Endpoints

### Kullanıcı İşlemleri
- `GET /api/v1/user/profile` - Kullanıcı profili

### Hesap İşlemleri
- `GET /api/v1/accounts` - Kullanıcının hesapları
- `POST /api/v1/accounts` - Yeni hesap oluşturma
- `GET /api/v1/accounts/{account_number}/balance` - Bakiye sorgulama

### Transfer İşlemleri
- `POST /api/v1/accounts/{account_number}/transfer` - Para transferi
- `GET /api/v1/accounts/{account_number}/transactions` - İşlem geçmişi

### Sistem
- `GET /health` - Sistem durumu
- `GET /` - API bilgileri

## Örnek Kullanım

### 1. Kullanıcı Kaydı
```json
POST /api/v1/auth/register
{
  "username": "a",
  "email": "a@example.com",
  "password": "GuvenliSifre123",
  "first_name": "A",
  "last_name": "",
  "phone": "-",
  "address": "İstanbul, Türkiye"
}
```

### 2. Giriş Yapma
```json
POST /api/v1/auth/login
{
  "username": "A",
  "password": "GuvenliSifre123"
}
```

### 3. Para Transferi
```json
POST /api/v1/accounts/{account_number}/transfer
Headers: Authorization: Bearer {token}
{
  "to_account_number": "TR12345678ABCD",
  "amount": 1000.50,
  "description": "Kira ödemesi"
}
```

## Güvenlik Özellikleri

- **Şifre Politikası**: Minimum 8 karakter, büyük/küçük harf, rakam
- **Hesap Kilitleme**: 3 başarısız deneme sonrası 30 dakika kilitleme
- **JWT Token**: 30 dakika geçerlilik süresi
- **Günlük Transfer Limiti**: Varsayılan 10.000 TL
- **Audit Logging**: Tüm kritik işlemler loglanır
- **SQL Injection Koruması**: ORM kullanımı
- **XSS Koruması**: Güvenlik başlıkları
- **CORS Koruması**: Belirli domainlere izin

## Veritabanı Yapısı

### Users (Kullanıcılar)
- Kişisel bilgiler
- Şifre hash'i
- Hesap durumu
- Başarısız giriş sayacı

### Accounts (Hesaplar)
- Hesap numarası
- Bakiye
- Para birimi
- Günlük limit

### Transactions (İşlemler)
- Transfer detayları
- İşlem durumu
- Zaman damgası

### Audit_Logs (Denetim Kayıtları)
- Kullanıcı işlemleri
- IP adresi
- User agent

## Geliştirme

Sistemi geliştirme modunda çalıştırmak için:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Üretim Ortamı

Üretim ortamı için:
1. SECRET_KEY'i güçlü bir değerle değiştirin
2. PostgreSQL gibi üretim veritabanı kullanın
3. HTTPS sertifikası ekleyin
4. Rate limiting ayarlarını yapın
5. Monitoring ve logging sistemlerini kurun

## Lisans

Bu proje MIT lisansı altında geliştirilmiştir. 
