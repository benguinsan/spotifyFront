# Spotify Clone Frontend

## Giới thiệu
Đây là frontend của dự án Spotify Clone, sử dụng Next.js, React, TailwindCSS.
Backend của dự án có thể được tìm thấy tại: [Spotify Clone Backend](https://github.com/benguinsan/spotifyback)

## Yêu cầu
- Node.js >= 16
- npm >= 8

## Cài đặt
```bash
npm install
```

## Chạy development
```bash
npm run dev
```
Truy cập: http://localhost:3000

## Build production
```bash
npm run build
npm start
```

## Cấu trúc thư mục chính
- `src/` - Source code chính
- `public/` - Ảnh, file tĩnh
- `package.json` - Thông tin dependencies

## Biến môi trường
Tạo file `.env.local` nếu cần cấu hình endpoint backend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Các lệnh npm hữu ích
- `npm run lint` - Kiểm tra code style
- `npm run format` - Format code