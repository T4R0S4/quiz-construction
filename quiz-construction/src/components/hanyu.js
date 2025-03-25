import React, { useState, useEffect } from 'react';
import { Trophy, Play, List } from 'lucide-react';

function AplikasiKuisKonstruksi() {
  const [data, setData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameState, setGameState] = useState('menu');

  // Ambil data dari file data.txt di folder public
  useEffect(() => {
    fetch('/data.txt')
      .then(response => response.json())
      .then(jsonData => {
        // Asumsikan baris pertama adalah header
        const [header, ...rows] = jsonData;
        const dataObj = rows.map(row => ({
          mandarin: row[0],
          pinyin: row[1],
          indonesia: row[2],
          deskripsi: row[3]
        }));
        setData(dataObj);
      })
      .catch(error => {
        console.error("Gagal mengambil data:", error);
      });
  }, []);

  // Mulai kuis
  const mulaiKuis = () => {
    setScore(0);
    setTotalQuestions(0);
    generateQuestion();
    setGameState('quiz');
  };

  // Menghasilkan pertanyaan acak dari data
  const generateQuestion = () => {
    if (data.length === 0) return;
    const randomIndex = Math.floor(Math.random() * data.length);
    const question = data[randomIndex];

    // Pilih salah satu jenis pertanyaan secara acak
    const answerTypes = ['mandarin', 'indonesia', 'pinyin'];
    const questionType = answerTypes[Math.floor(Math.random() * answerTypes.length)];

    const choices = generateChoices(question, questionType);

    setCurrentQuestion({
      ...question,
      questionType,
      choices
    });
    setTotalQuestions(prev => prev + 1);
  };

  // Menghasilkan pilihan jawaban acak (termasuk jawaban benar)
  const generateChoices = (correctQuestion, questionType) => {
    const choices = [correctQuestion[questionType]];

    while (choices.length < 4) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomChoice = data[randomIndex][questionType];
      if (!choices.includes(randomChoice)) {
        choices.push(randomChoice);
      }
    }

    // Acak urutan pilihan
    return choices.sort(() => Math.random() - 0.5);
  };

  // Tangani jawaban yang dipilih
  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentQuestion[currentQuestion.questionType];
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    if (totalQuestions < 10) {
      generateQuestion();
    } else {
      setGameState('results');
    }
  };

  // Render menu utama
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center">Kuis Terminologi Konstruksi</h1>
      <button
        onClick={mulaiKuis}
        className="w-full bg-blue-500 text-white p-3 rounded flex items-center justify-center space-x-2 hover:bg-blue-600"
      >
        <Play /> <span>Mulai Kuis</span>
      </button>
      <button
        onClick={() => setGameState('terminology')}
        className="w-full bg-green-500 text-white p-3 rounded flex items-center justify-center space-x-2 hover:bg-green-600"
      >
        <List /> <span>Lihat Terminologi</span>
      </button>
    </div>
  );

  // Render tampilan kuis
  const renderQuiz = () => {
    if (!currentQuestion) return null;

    // Tentukan teks pertanyaan berdasarkan jenis pertanyaan
    const questionText = () => {
      switch (currentQuestion.questionType) {
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
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Pertanyaan {totalQuestions}/10</h2>
          <p className="text-center font-medium mb-4">{questionText()}</p>
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(choice)}
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p>Skor: {score}/{totalQuestions}</p>
        </div>
      </div>
    );
  };

  // Render tampilan hasil kuis
  const renderResults = () => (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Trophy color="gold" size={40} />
          <h2 className="text-2xl font-bold">Hasil Kuis</h2>
        </div>
        <p className="text-xl font-bold">Skor Anda</p>
        <p className="text-4xl font-extrabold text-green-600 mb-4">{score}/10</p>
        <div className="space-y-3">
          <button
            onClick={() => setGameState('menu')}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Kembali ke Menu
          </button>
          <button
            onClick={mulaiKuis}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
          >
            Main Lagi
          </button>
        </div>
      </div>
    </div>
  );

  // Render tampilan terminologi (data lengkap)
  const renderTerminology = () => (
    <div className="h-screen overflow-y-auto bg-gray-100 p-4">
      <button
        onClick={() => setGameState('menu')}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
      >
        Kembali
      </button>
      <h2 className="text-2xl font-bold mb-4">Terminologi Konstruksi</h2>
      <div className="grid gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p><strong>Mandarin:</strong> {item.mandarin}</p>
            <p><strong>Pinyin:</strong> {item.pinyin}</p>
            <p><strong>Indonesia:</strong> {item.indonesia}</p>
            <p><strong>Deskripsi:</strong> {item.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'quiz' && renderQuiz()}
      {gameState === 'results' && renderResults()}
      {gameState === 'terminology' && renderTerminology()}
    </div>
  );
}

export default AplikasiKuisKonstruksi;
