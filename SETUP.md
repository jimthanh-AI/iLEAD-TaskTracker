# 🚀 iLEAD PM — Setup Hướng Dẫn

## 1. Chuẩn Bị Supabase

1. Đăng nhập: https://supabase.com
2. Project Settings → API
3. Copy 2 giá trị này vào `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Tạo .env.local

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

## 3. Tạo Database Schema (Supabase SQL Editor)

1. Supabase Dashboard → SQL Editor → New Query
2. Copy-paste schema từ README.md → Run

## 4. Run Local

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## 5. Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ilead-pm
git push -u origin main
```

In Vercel:
- Add New → Project
- Select ilead-pm repo
- Add Environment Variables (same as .env.local)
- Deploy

## Files Included

✅ Next.js 14 + TypeScript setup
✅ Tailwind CSS styling
✅ Supabase auth (magic link)
✅ Dashboard layout
✅ Partners, Projects, Activities, Tasks pages (skeleton)
✅ Complete type definitions
✅ Environment template

## Next Phase

After this MVP works:
1. Add CRUD operations
2. Add forms & modals
3. Add data tables with filtering
4. Add drag-drop Kanban
5. Add export features

Questions? → Jim Thanh
