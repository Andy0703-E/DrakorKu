# 🎬 DrakorKu

DrakorKu adalah aplikasi streaming drama Korea berbasis web yang dibangun menggunakan React + Vite.  
Aplikasi ini mengambil data dari API eksternal untuk menampilkan daftar drama, detail, episode, hingga pemutar video streaming.

---

## 🚀 Fitur Utama

- 📺 Daftar drama Korea terbaru (Latest)
- 🔥 Ongoing & Recommended drama
- 🎬 Halaman detail drama lengkap
- ▶️ Streaming episode langsung
- 🎥 Pemilihan kualitas video (360p, 480p, 720p)
- 🔍 Fitur pencarian drama
- 📱 UI responsive (mobile & desktop)
- ⚡ Navigasi cepat tanpa reload (SPA)

---

## 🧠 Teknologi yang Digunakan

- React JS
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide Icons

---

## 🌐 API yang Digunakan

Project ini menggunakan API:


https://wudyver-api.vercel.app/api/film/drakor/v7


### Contoh endpoint:

- Latest drama:

?action=latest


- Ongoing drama:

?action=ongoing


- Recommended:

?action=recommended


- Detail drama:

?action=get_info&id={id}


- Episode:

?action=get_episodes&id={id}


- Streaming link:

?action=download_link&streaming={id}&movie_id={id}&episode_number={ep}


---

## 📁 Struktur Project


src/
│
├── api/
│ └── config.js # Axios & API function
│
├── components/
│ ├── Navbar.jsx
│ ├── Card.jsx
│
├── pages/
│ ├── Home.jsx
│ ├── Detail.jsx
│ ├── Watch.jsx
│ ├── Search.jsx
│
├── App.jsx
└── main.jsx


---

## ⚙️ Instalasi & Menjalankan Project

### 1. Clone repository
```bash
git clone https://github.com/username/drakor-ku.git
2. Masuk folder project
cd drakor-ku
3. Install dependency
npm install
4. Jalankan project
npm run dev
📦 Build Production
npm run build
📱 Preview

Aplikasi ini sudah responsive dan bisa digunakan di mobile maupun desktop.

🎯 Catatan
Project ini hanya untuk pembelajaran
Data streaming diambil dari API pihak ketiga
Tidak menyimpan video secara lokal
❤️ Developer

Dibuat dengan cinta untuk pecinta drama Korea 💖