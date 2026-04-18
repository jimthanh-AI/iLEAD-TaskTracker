# 🚀 Quick Start — 5 Bước Để Chạy iLEAD PM

## Bước 1: Chuẩn Bị Supabase (5 phút)

1. Đăng nhập: https://supabase.com
2. Vào project vừa tạo → **Project Settings** → **API**
3. Copy 2 giá trị:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://sdhnlwbryetclbmjzroq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-anon-key-from-supabase-dashboard>
   ```

## Bước 2: Tạo .env.local

Trong thư mục project:
```bash
cp .env.local.example .env.local
```

Mở `.env.local`, paste 2 giá trị từ Bước 1.

## Bước 3: Tạo Database (Supabase)

Supabase Dashboard → **SQL Editor** → **New Query**

Copy-paste toàn bộ SQL từ file `README.md` (phần "Database Schema SQL") → **Run**

Đợi hoàn thành.

## Bước 4: Test Locally

Mở terminal, chạy:
```bash
npm install  # cần chạy 1 lần đầu
npm run dev
```

Visit: **http://localhost:3000**

- Nó sẽ redirect sang /login
- Nhập email anh → Send Magic Link
- Check email, click link
- Vào dashboard, thấy 5 KPI cards

✅ Nếu thành công → bước tiếp theo

## Bước 5: Deploy lên Vercel

### 5a. Setup Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### 5b. Push GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ilead-pm.git
git push -u origin main
```

### 5c. Deploy Vercel
1. Vào https://vercel.com
2. Click "Add New" → "Project"
3. Select repo `ilead-pm`
4. **Environment Variables** → Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = (paste từ Bước 1)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (paste từ Bước 1)
5. Click "Deploy"

⏳ Chờ ~2 phút → Done! Website sẽ có URL như:
```
https://ilead-pm.vercel.app
```

---

## ✅ Checklist

- [ ] Supabase project tạo xong, lấy được 2 key
- [ ] .env.local file được tạo & filled
- [ ] Database schema đã chạy trong Supabase
- [ ] `npm run dev` chạy thành công
- [ ] Có thể login bằng email
- [ ] Dashboard hiện KPI cards
- [ ] GitHub repo có code
- [ ] Vercel deploy hoàn tất
- [ ] Website sống trên vercel.app

---

## Nếu Gặp Lỗi

### "Cannot GET /dashboard"
→ .env.local chưa có hoặc thiếu keys. Check lại Bước 2.

### "Failed to fetch from Supabase"
→ Database schema chưa tạo. Run SQL ở Bước 3.

### "Email send failed"
→ Bình thường là network. Thử refresh page.

### Deployment fails on Vercel
→ Kiểm tra environment variables trong Vercel project settings.

---

## Next Steps

Sau khi MVP chạy được, anh báo tôi:

> "MVP local chạy được, deployed lên Vercel. Bắt đầu Phase 2"

Tôi sẽ thêm:
- Forms để add/edit/delete partners, projects, etc.
- Real-time data sync
- Kanban board
- Filters & search
- Export CSV

---

**Questions? → Báo tôi ngay!**
