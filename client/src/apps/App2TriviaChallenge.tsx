import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Clock, CheckCircle2, XCircle, ArrowLeft,
  ChevronRight, Star, RotateCcw, Medal, Zap, Target,
  Brain, Users, Award
} from 'lucide-react';

interface Question {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  basePoints: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LeaderboardEntry {
  _id?: string;
  name: string;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  date?: string;
}

const questions: Question[] = [
  {
    id: 1,
    difficulty: 'easy',
    basePoints: 100,
    category: 'Product Knowledge',
    question: 'What is the brand name of AstraZeneca\'s EGFR inhibitor osimertinib used in lung cancer?',
    options: ['Lynparza', 'Tagrisso', 'Imfinzi', 'Calquence'],
    correctIndex: 1,
    explanation: 'Tagrisso (osimertinib) is AstraZeneca\'s third-generation EGFR tyrosine kinase inhibitor. It uniquely targets both primary EGFR activating mutations and the T790M resistance mutation, making it effective even when patients progress on earlier-generation EGFR inhibitors.',
  },
  {
    id: 2,
    difficulty: 'easy',
    basePoints: 100,
    category: 'Mechanism of Action',
    question: 'Imfinzi (durvalumab) is classified as which type of immunotherapy agent?',
    options: ['VEGF inhibitor', 'EGFR tyrosine kinase inhibitor', 'PD-L1 checkpoint inhibitor', 'BTK inhibitor'],
    correctIndex: 2,
    explanation: 'Imfinzi (durvalumab) is a human monoclonal antibody that selectively blocks PD-L1, preventing it from binding to PD-1 and CD80 receptors. By blocking this interaction, it restores the immune system\'s ability to recognize and destroy cancer cells, representing a key mechanism in immunotherapy.',
  },
  {
    id: 3,
    difficulty: 'easy',
    basePoints: 100,
    category: 'Product Knowledge',
    question: 'Which AstraZeneca product is a PARP inhibitor with approvals across ovarian, breast, prostate, and pancreatic cancers?',
    options: ['Calquence', 'Tagrisso', 'Lynparza', 'Imfinzi'],
    correctIndex: 2,
    explanation: 'Lynparza (olaparib) was one of the first PARP inhibitors approved for clinical use and has the broadest indication range in its class. It exploits the concept of synthetic lethality in cancer cells with BRCA1/2 mutations or homologous recombination deficiency (HRD), making it effective across multiple tumor types.',
  },
  {
    id: 4,
    difficulty: 'medium',
    basePoints: 150,
    category: 'Clinical Evidence',
    question: 'Which landmark clinical trial established Tagrisso (osimertinib) as the preferred first-line treatment for EGFR-mutated NSCLC?',
    options: ['PACIFIC', 'FLAURA', 'POLO', 'ADAURA'],
    correctIndex: 1,
    explanation: 'The FLAURA trial was pivotal for Tagrisso\'s first-line approval, demonstrating superior progression-free survival (18.9 months vs 10.2 months) compared to first-generation EGFR inhibitors (erlotinib/gefitinib). Subsequent FLAURA2 data confirmed OS benefit, establishing Tagrisso as the gold standard for EGFR-mutated NSCLC.',
  },
  {
    id: 5,
    difficulty: 'medium',
    basePoints: 150,
    category: 'Mechanism of Action',
    question: 'Calquence (acalabrutinib) selectively inhibits which kinase, and why is its selectivity important?',
    options: ['EGFR — reduces skin toxicity', 'PARP — improves DNA repair', 'BTK — reduces off-target cardiac effects vs ibrutinib', 'JAK2 — enhances T-cell activity'],
    correctIndex: 2,
    explanation: 'Calquence (acalabrutinib) is a highly selective, covalent BTK (Bruton\'s Tyrosine Kinase) inhibitor. Compared to ibrutinib (first-generation BTK inhibitor), acalabrutinib\'s improved selectivity reduces binding to off-target kinases (like TEC and EGFR), which is associated with a more favorable cardiac safety profile (lower atrial fibrillation risk) and reduced bleeding.',
  },
  {
    id: 6,
    difficulty: 'medium',
    basePoints: 150,
    category: 'Clinical Evidence',
    question: 'The PACIFIC trial established which AstraZeneca drug as the standard of care in which setting?',
    options: [
      'Tagrisso in resectable Stage I NSCLC after surgery',
      'Imfinzi in unresectable Stage III NSCLC after concurrent chemoradiotherapy',
      'Lynparza in platinum-sensitive recurrent ovarian cancer',
      'Calquence in treatment-naive CLL with del(17p)'
    ],
    correctIndex: 1,
    explanation: 'The PACIFIC trial established Imfinzi (durvalumab) as the standard of care for unresectable Stage III NSCLC patients whose disease had not progressed after concurrent platinum-based chemoradiotherapy. It showed significant improvements in both PFS and OS, fundamentally changing the treatment paradigm for this previously difficult-to-treat population.',
  },
  {
    id: 7,
    difficulty: 'medium',
    basePoints: 150,
    category: 'Drug Class',
    question: 'Enhertu (trastuzumab deruxtecan), developed with Daiichi Sankyo, belongs to which innovative drug class that makes it effective even in HER2-low tumors?',
    options: ['PARP inhibitor', 'Checkpoint inhibitor', 'BTK inhibitor', 'Antibody-Drug Conjugate (ADC)'],
    correctIndex: 3,
    explanation: 'Enhertu (trastuzumab deruxtecan) is an ADC combining a HER2-directed antibody with a potent topoisomerase I inhibitor payload. Its high drug-to-antibody ratio (approximately 8) and membrane-permeable payload create a unique "bystander effect," where the payload can kill adjacent tumor cells. This mechanism makes it effective in HER2-low breast cancer — a population previously considered ineligible for HER2-directed therapy.',
  },
  {
    id: 8,
    difficulty: 'hard',
    basePoints: 200,
    category: 'Mechanism of Action',
    question: 'What specific mutation was Tagrisso (osimertinib) engineered to overcome, making it a third-generation EGFR TKI?',
    options: [
      'Exon 19 deletion (del19)',
      'L858R point mutation in exon 21',
      'T790M "gatekeeper" resistance mutation',
      'Exon 20 insertion'
    ],
    correctIndex: 2,
    explanation: 'Tagrisso was primarily designed to overcome the T790M "gatekeeper" resistance mutation, which develops in 50-60% of patients progressing on first- or second-generation EGFR inhibitors. The T790M mutation substitutes methionine for threonine at position 790, sterically hindering earlier inhibitors. Tagrisso\'s unique covalent binding structure allows it to maintain potent activity against T790M while also treating primary EGFR activating mutations (del19, L858R).',
  },
  {
    id: 9,
    difficulty: 'hard',
    basePoints: 200,
    category: 'Biochemistry',
    question: 'What does PARP stand for, and why does PARP inhibition cause selective toxicity in BRCA-mutated cancer cells?',
    options: [
      'Phospho-Adenine Ribose Protein — blocks proliferation signals in cancer cells',
      'Poly ADP-Ribose Polymerase — creates synthetic lethality in HR-deficient BRCA-mutated cells',
      'Programmed Apoptosis Receptor Pathway — activates intrinsic cell death signals',
      'Protein-Associated RNA Polymerase — prevents DNA transcription in dividing cells'
    ],
    correctIndex: 1,
    explanation: 'PARP (Poly ADP-Ribose Polymerase) enzymes repair single-strand DNA breaks. In BRCA1/2-mutated cancer cells that are already deficient in homologous recombination (HR) repair, PARP inhibition creates "synthetic lethality": the combination of two DNA repair pathway defects results in irreparable DNA damage and selective cancer cell death. Normal cells with intact BRCA can survive using alternative repair pathways, creating the therapeutic window for PARP inhibitors like Lynparza.',
  },
  {
    id: 10,
    difficulty: 'hard',
    basePoints: 200,
    category: 'Regulatory & Approvals',
    question: 'The ADAURA trial led to a paradigm-shifting approval for which AstraZeneca product in which groundbreaking setting?',
    options: [
      'Imfinzi as adjuvant therapy after Stage I-IIA NSCLC resection',
      'Tagrisso as adjuvant therapy after complete resection of Stage IB-IIIA EGFR-mutated NSCLC',
      'Lynparza combined with bevacizumab in Stage IIIC NSCLC maintenance',
      'Calquence as adjuvant therapy in surgically resected diffuse large B-cell lymphoma'
    ],
    correctIndex: 1,
    explanation: 'ADAURA was a landmark trial evaluating Tagrisso (osimertinib) as adjuvant (post-surgical) therapy in patients with completely resected Stage IB-IIIA EGFR-mutated NSCLC. The trial was stopped early at its first interim analysis due to overwhelming OS benefit — demonstrating an 88% reduction in the risk of disease recurrence or death in the Stage II-IIIA population. This established Tagrisso as the first EGFR TKI to demonstrate OS benefit in early-stage, resected NSCLC.',
  },
];

const TIMER_SECONDS = 20;

export default function App2TriviaChallenge() {
  const navigate = useNavigate();
  const [view, setView] = useState<'home' | 'quiz' | 'results'>('home');
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(10).fill(null));

  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      } else {
        // Fall back to local storage
        const local = localStorage.getItem('az_trivia_leaderboard');
        if (local) setLeaderboard(JSON.parse(local));
      }
    } catch {
      const local = localStorage.getItem('az_trivia_leaderboard');
      if (local) setLeaderboard(JSON.parse(local));
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Timer
  useEffect(() => {
    if (view !== 'quiz' || selectedAnswer !== null) return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [view, timeLeft, selectedAnswer]);

  const handleTimeUp = () => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(-1); // -1 means time ran out
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = -1;
      return next;
    });
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = idx;
      return next;
    });
    const q = questions[currentQ];
    if (idx === q.correctIndex) {
      const timeBonus = timeLeft * 5;
      setScore(prev => prev + q.basePoints + timeBonus);
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(TIMER_SECONDS);
    } else {
      // End of game - save score
      const finalScore = score;
      const accuracy = Math.round((correctCount / questions.length) * 100);
      const entry: LeaderboardEntry = {
        name: playerName,
        score: finalScore,
        accuracy,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        date: new Date().toISOString(),
      };
      try {
        await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      } catch {
        // Save locally if API fails
        const local = localStorage.getItem('az_trivia_leaderboard');
        const existing: LeaderboardEntry[] = local ? JSON.parse(local) : [];
        const updated = [...existing, entry].sort((a, b) => b.score - a.score).slice(0, 20);
        localStorage.setItem('az_trivia_leaderboard', JSON.stringify(updated));
      }
      await fetchLeaderboard();
      setView('results');
    }
  };

  const startGame = () => {
    if (!playerName.trim()) {
      setNameError('Please enter your name to start');
      return;
    }
    if (playerName.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    setNameError('');
    setView('quiz');
    setCurrentQ(0);
    setSelectedAnswer(null);
    setTimeLeft(TIMER_SECONDS);
    setScore(0);
    setCorrectCount(0);
    setAnswers(new Array(10).fill(null));
  };

  const resetGame = () => {
    setView('home');
    setPlayerName('');
    setCurrentQ(0);
    setSelectedAnswer(null);
    setTimeLeft(TIMER_SECONDS);
    setScore(0);
    setCorrectCount(0);
    setAnswers(new Array(10).fill(null));
    fetchLeaderboard();
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-emerald-600';
    if (timeLeft > 5) return 'text-amber-600';
    return 'text-red-600';
  };
  const getTimerBg = () => {
    if (timeLeft > 10) return 'bg-emerald-100';
    if (timeLeft > 5) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const getDifficultyColor = (d: string) => {
    if (d === 'easy') return 'bg-emerald-100 text-emerald-700';
    if (d === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getMyRank = () => {
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex(e => e.name === playerName && e.score === score);
    return idx >= 0 ? idx + 1 : sorted.length + 1;
  };

  // ---- HOME VIEW ----
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">AI Oncology Trivia</h1>
            <p className="text-purple-300 text-lg font-semibold">Challenge</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rules + Name Input */}
            <div className="space-y-4">
              {/* Rules */}
              <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 sm:p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" /> Game Rules
                </h2>
                <div className="space-y-3">
                  {[
                    { icon: Brain, text: 'Answer 10 questions about AstraZeneca oncology products', color: 'text-purple-400' },
                    { icon: Clock, text: '20 seconds per question — answer faster for bonus points!', color: 'text-cyan-400' },
                    { icon: Star, text: 'Easy: 100 pts | Medium: 150 pts | Hard: 200 pts', color: 'text-amber-400' },
                    { icon: Zap, text: 'Time bonus: +5 points per second remaining', color: 'text-emerald-400' },
                    { icon: Trophy, text: 'Beat the leaderboard to claim victory!', color: 'text-pink-400' },
                  ].map((rule, i) => {
                    const RIcon = rule.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <RIcon className={`w-5 h-5 ${rule.color} flex-shrink-0 mt-0.5`} />
                        <p className="text-slate-300 text-sm">{rule.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 sm:p-6">
                <h2 className="text-white font-bold text-lg mb-4">Enter Your Name</h2>
                <input
                  type="text"
                  value={playerName}
                  onChange={e => { setPlayerName(e.target.value); setNameError(''); }}
                  onKeyDown={e => e.key === 'Enter' && startGame()}
                  placeholder="Your name..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-sm sm:text-base mb-2"
                />
                {nameError && <p className="text-red-400 text-xs mb-3">{nameError}</p>}
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Start Challenge
                </button>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 sm:p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> Leaderboard
              </h2>
              {loadingLeaderboard ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Loading scores...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No scores yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {leaderboard.slice(0, 10).map((entry, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-amber-500/20 border border-amber-500/30' : i === 1 ? 'bg-slate-500/20 border border-slate-500/20' : i === 2 ? 'bg-orange-700/20 border border-orange-700/20' : 'bg-white/5'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-amber-400 text-amber-900' : i === 1 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/60'}`}>
                        {i === 0 ? <Medal className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{entry.name}</p>
                        <p className="text-slate-400 text-xs">{entry.accuracy}% accuracy</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-bold text-sm">{entry.score.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs">pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- QUIZ VIEW ----
  if (view === 'quiz') {
    const q = questions[currentQ];
    const isAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === q.correctIndex;
    const timedOut = selectedAnswer === -1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Top bar */}
          <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-3 sm:p-4 mb-4">
            <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors mb-2"><ArrowLeft className="w-4 h-4" /> Home</button>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">{playerName.charAt(0).toUpperCase()}</div>
                <span className="text-white text-sm font-semibold">{playerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm">Q{currentQ + 1}/10</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getDifficultyColor(q.difficulty)}`}>
                  {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)} &bull; {q.basePoints} pts
                </span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getTimerBg()}`}>
                  <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                  <span className={`font-bold text-sm ${getTimerColor()}`}>{timedOut ? '0' : timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold text-sm">{score.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 bg-white/10 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
            </div>
            {/* Timer bar */}
            {!isAnswered && (
              <div className="mt-1.5 bg-white/10 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-1000 ${timeLeft > 10 ? 'bg-emerald-400' : timeLeft > 5 ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Question card */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-6 md:p-7">
            <div className="mb-4">
              <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full mb-3">{q.category}</span>
              <h2 className="text-slate-900 font-bold text-base sm:text-lg md:text-xl leading-snug">{q.question}</h2>
            </div>

            <div className="space-y-2.5 mb-5">
              {q.options.map((opt, idx) => {
                let btnClass = 'border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 cursor-pointer';
                if (isAnswered || timedOut) {
                  if (idx === q.correctIndex) {
                    btnClass = 'border-emerald-500 bg-emerald-50 cursor-default';
                  } else if (idx === selectedAnswer && selectedAnswer !== q.correctIndex) {
                    btnClass = 'border-red-400 bg-red-50 cursor-default';
                  } else {
                    btnClass = 'border-slate-200 bg-white opacity-50 cursor-default';
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered || timedOut}
                    className={`w-full text-left border-2 rounded-xl px-4 py-3 transition-all flex items-center justify-between gap-3 ${btnClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0
                        ${isAnswered && idx === q.correctIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                          isAnswered && idx === selectedAnswer && selectedAnswer !== q.correctIndex ? 'bg-red-400 border-red-400 text-white' :
                          'border-slate-300 text-slate-500'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-sm sm:text-base ${isAnswered && idx === q.correctIndex ? 'text-emerald-800 font-semibold' : isAnswered && idx === selectedAnswer && idx !== q.correctIndex ? 'text-red-700' : 'text-slate-800'}`}>
                        {opt}
                      </span>
                    </div>
                    {isAnswered && idx === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                    {isAnswered && idx === selectedAnswer && selectedAnswer !== q.correctIndex && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {(isAnswered || timedOut) && (
              <div className={`rounded-xl p-4 border mb-4 ${timedOut ? 'bg-slate-50 border-slate-200' : isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {timedOut ? (
                    <Clock className="w-4 h-4 text-slate-500" />
                  ) : isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs font-bold ${timedOut ? 'text-slate-600' : isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {timedOut ? "TIME'S UP!" : isCorrect ? `CORRECT! +${q.basePoints + timeLeft * 5} pts (including ${timeLeft * 5} time bonus)` : 'INCORRECT'}
                  </span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${timedOut ? 'text-slate-600' : isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.explanation}</p>
              </div>
            )}

            {(isAnswered || timedOut) && (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {currentQ < questions.length - 1 ? (
                  <>Next Question <ChevronRight className="w-5 h-5" /></>
                ) : (
                  <>See Results <Trophy className="w-5 h-5" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- RESULTS VIEW ----
  const accuracy = Math.round((correctCount / questions.length) * 100);
  const myRank = getMyRank();

  const getRankBadge = () => {
    if (accuracy >= 90 && correctCount >= 9) return { label: 'Oncology Expert', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (accuracy >= 70) return { label: 'Product Specialist', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (accuracy >= 50) return { label: 'Emerging Learner', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Keep Studying', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' };
  };
  const badge = getRankBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-7 md:p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{playerName}</h1>
            <p className="text-slate-500 text-sm">Challenge Complete!</p>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5 text-center mb-5">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              {score.toLocaleString()}
            </div>
            <p className="text-slate-500 text-sm">Total Points</p>
            <div className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border ${badge.bg}`}>
              <Award className={`w-4 h-4 ${badge.color}`} />
              <span className={`text-sm font-bold ${badge.color}`}>{badge.label}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: 'from-purple-500 to-pink-500' },
              { icon: CheckCircle2, label: 'Correct', value: `${correctCount}/10`, color: 'from-emerald-500 to-teal-500' },
              { icon: Medal, label: 'Rank', value: `#${myRank}`, color: 'from-amber-500 to-orange-500' },
            ].map((stat, i) => {
              const SIcon = stat.icon;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <SIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Mini Leaderboard */}
          {leaderboard.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
              <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Top 5 Leaderboard
              </h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${entry.name === playerName ? 'bg-purple-100 border border-purple-300' : 'bg-white border border-slate-100'}`}>
                    <span className="text-slate-500 font-bold w-5 text-xs">#{i + 1}</span>
                    <span className={`flex-1 font-semibold ${entry.name === playerName ? 'text-purple-700' : 'text-slate-800'}`}>{entry.name}</span>
                    <span className="text-slate-500 text-xs">{entry.accuracy}%</span>
                    <span className={`font-bold ${entry.name === playerName ? 'text-purple-700' : 'text-slate-700'}`}>{entry.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={resetGame} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={() => navigate('/')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
