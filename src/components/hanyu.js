import React, { useState, useEffect } from 'react';
import { Trophy, Play, List } from 'lucide-react';

// Contoh data konstruksi
const konstruksiData = [
  {
    mandarin: "施工现场",
    pinyin: "shīgōng xiànchǎng",
    indonesia: "Situs Konstruksi",
    deskripsi: "Area tempat proses konstruksi berlangsung."
  },
  {
    mandarin: "建筑工地",
    pinyin: "jiànzhú gōngdì", 
    indonesia: "Lokasi Konstruksi",
    deskripsi: "Tempat pembangunan bangunan."
  },
  // ... tambahkan data lain sesuai kebutuhan
];

function KuisTerminologiKonstruksi() {
  const [data, setData] = useState(konstruksiData);  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameState, setGameState] = useState('menu');

  // Mulai Kuis
  const mulaiKuis = () => {
    // Pastikan data tidak kosong
    if (!data || data.length === 0) {
      alert("Data terminologi kosong atau belum dimuat. Pastikan data tersedia.");
      return;
    }
    setScore(0);
    setTotalQuestions(0);
    hasilkanPertanyaan();
    setGameState('quiz');
  };

  // Membuat Pertanyaan Baru
  const hasilkanPertanyaan = () => {
    if (!data || data.length === 0) return;

    const indeksAcak = Math.floor(Math.random() * data.length);
    const pertanyaan = data[indeksAcak];
    
    const jenisJawaban = ['mandarin', 'indonesia', 'pinyin'];
    const jenisPertanyaan = jenisJawaban[Math.floor(Math.random() * jenisJawaban.length)];
    
    const pilihan = hasilkanPilihan(pertanyaan, jenisPertanyaan);

    setCurrentQuestion({
      ...pertanyaan,
      jenisPertanyaan,
      pilihan
    });
    setTotalQuestions((prev) => prev + 1);
  };

  // Membuat 4 pilihan jawaban
  const hasilkanPilihan = (pertanyaanBenar, jenisPertanyaan) => {
    const pilihan = [pertanyaanBenar[jenisPertanyaan]];
    
    while (pilihan.length < 4) {
      const indeksAcak = Math.floor(Math.random() * data.length);
      const pilihanAcak = data[indeksAcak][jenisPertanyaan];
      
      if (!pilihan.includes(pilihanAcak)) {
        pilihan.push(pilihanAcak);
      }
    }

    return pilihan.sort(() => Math.random() - 0.5);
  };

  // Ketika jawaban dipilih
  const handleJawaban = (jawabanTerpilih) => {
    if (!currentQuestion) return;

    const benar = jawabanTerpilih === currentQuestion[currentQuestion.jenisPertanyaan];
    if (benar) {
      setScore((prev) => prev + 1);
    }

    // Jika belum 10 pertanyaan, lanjut
    if (totalQuestions < 10) {
      hasilkanPertanyaan();
    } else {
      // Selesai
      setGameState('results');
    }
  };

  // Bagian Menu
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700">Kuis Terminologi Konstruksi</h1>
        <button 
          onClick={mulaiKuis} 
          className="w-full mb-4 bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition transform hover:scale-105"
        >
          <Play /> 
          <span>Mulai Kuis</span>
        </button>
        <button 
          onClick={() => setGameState('terminology')}
          className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition transform hover:scale-105"
        >
          <List /> 
          <span>Lihat Terminologi</span>
        </button>
      </div>
    </div>
  );

  // Bagian Kuis
  const renderKuis = () => {
    if (!currentQuestion) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <p className="text-xl text-gray-600">Memuat pertanyaan...</p>
        </div>
      );
    }

    const teksJawaban = () => {
      switch(currentQuestion.jenisPertanyaan) {
        case 'mandarin':
          return `Apa terjemahan Indonesia dari "${currentQuestion.mandarin}"?`;
        case 'indonesia':
          return `Apa istilah Mandarin untuk "${currentQuestion.indonesia}"?`;
        case 'pinyin':
          return `Apa terjemahan Indonesia dari istilah Mandarin dengan Pinyin "${currentQuestion.pinyin}"?`;
        default:
          return '';
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Pertanyaan {totalQuestions}/10
          </h2>
          <p className="text-center font-medium mb-4">{teksJawaban()}</p>
          <div className="space-y-3">
            {currentQuestion.pilihan.map((pilihan, index) => (
              <button 
                key={index} 
                onClick={() => handleJawaban(pilihan)}
                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition transform hover:scale-105"
              >
                {pilihan}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-lg">
            Skor: <span className="font-bold text-blue-600">{score}</span> / {totalQuestions}
          </p>
        </div>
      </div>
    );
  };

  // Bagian Hasil
  const renderHasil = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-100 to-green-200">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Trophy color="gold" size={40} /> 
          <h2 className="text-2xl font-bold">Hasil Kuis</h2>
        </div>
        <p className="text-xl font-bold mb-2">Skor Anda</p>
        <p className="text-5xl font-extrabold text-green-600 mb-4">{score}/10</p>
        <div className="space-y-3">
          <button 
            onClick={() => setGameState('menu')} 
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition transform hover:scale-105"
          >
            Kembali ke Menu
          </button>
          <button 
            onClick={mulaiKuis} 
            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition transform hover:scale-105"
          >
            Main Lagi
          </button>
        </div>
      </div>
    </div>
  );

  // Bagian Terminologi
  const renderTerminologi = () => {
    if (!data || data.length === 0) {
      return (
        <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setGameState('menu')}
            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition transform hover:scale-105"
          >
            Kembali
          </button>
          <p className="text-red-500">Data terminologi kosong atau belum dimuat.</p>
        </div>
      );
    }
    return (
      <div className="h-screen overflow-y-auto bg-gray-50 p-4">
        <button 
          onClick={() => setGameState('menu')}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition transform hover:scale-105"
        >
          Kembali
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Terminologi Konstruksi</h2>
        <div className="grid gap-4">
          {data.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded shadow hover:shadow-md transition">
              <p><strong className="text-blue-600">Mandarin:</strong> {item.mandarin}</p>
              <p><strong className="text-blue-600">Pinyin:</strong> {item.pinyin}</p>
              <p><strong className="text-blue-600">Indonesia:</strong> {item.indonesia}</p>
              <p><strong className="text-blue-600">Deskripsi:</strong> {item.deskripsi}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'quiz' && renderKuis()}
      {gameState === 'results' && renderHasil()}
      {gameState === 'terminology' && renderTerminologi()}
    </>
  );
}

export default KuisTerminologiKonstruksi;
