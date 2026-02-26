import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, BookOpen, BarChart3, FlaskConical, Building2,
  Target, Mail, Phone, FileText, Calendar, CheckCircle2,
  XCircle, RotateCcw, ChevronRight, Brain, TrendingUp,
  ArrowLeft, Star, Zap
} from 'lucide-react';

type Stage = 'intro' | 'research' | 'strategy' | 'approach' | 'result';

interface ResearchOption {
  id: number;
  icon: React.ElementType;
  title: string;
  points: number;
  insight: string;
  aiNote: string;
}

interface StrategyOption {
  id: number;
  title: string;
  description: string;
  points: number;
  aiRecommended: boolean;
  feedback: string;
}

interface ApproachOption {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  points: number;
  success: boolean;
  outcome: string;
  details?: string;
}

const researchOptions: ResearchOption[] = [
  {
    id: 1,
    icon: BookOpen,
    title: 'Recent Publications & Research',
    points: 2,
    insight: 'AI identified 3 recent papers by Dr. Martinez on treatment resistance in post-menopausal HER2+ breast cancer patients, with a focus on 18-month resistance rates.',
    aiNote: 'High relevance: Her research directly aligns with your product\'s differentiated resistance profile. Reference her findings to establish immediate scientific credibility.',
  },
  {
    id: 2,
    icon: BarChart3,
    title: 'Prescribing History & Patterns',
    points: 2,
    insight: 'Currently prescribing competitor product for 85% of eligible HER2+ patients. AI identified 23 potential switch candidates based on recent progression data from claims.',
    aiNote: 'Competitive intelligence: AI analysis shows 8 patients have recently progressed on competitor therapy — ideal candidates for your product\'s resistance data discussion.',
  },
  {
    id: 3,
    icon: FlaskConical,
    title: 'Clinical Trial Involvement',
    points: 3,
    insight: 'Principal Investigator on 2 active trials studying treatment-resistant HER2+ breast cancer at Memorial Cancer Institute. Recently published interim results.',
    aiNote: 'Critical insight: Her trial focus precisely matches your product\'s mechanism against resistance. This creates an immediate scientific bridge — she\'s actively seeking solutions to this problem.',
  },
  {
    id: 4,
    icon: Building2,
    title: 'Institutional Influence & Network',
    points: 2,
    insight: 'Presents at 3–4 regional oncology meetings annually and serves on the institutional formulary committee. Influence extends to 40+ community oncologists.',
    aiNote: 'Network multiplier: Converting Dr. Martinez could influence the prescribing patterns of 40+ community oncologists who follow her recommendations.',
  },
];

const strategyOptions: StrategyOption[] = [
  {
    id: 1,
    title: 'Standard Sales Call',
    description: 'Schedule a routine sales visit to present product features, efficacy data, and patient benefits using the standard detail aid.',
    points: 0,
    aiRecommended: false,
    feedback: 'Generic approach. No consideration of her specific research focus or patient challenges. AI analysis shows this approach has less than 5% conversion rate with academic oncologists who are evidence-driven researchers.',
  },
  {
    id: 2,
    title: 'Share Clinical Data Package',
    description: 'Send a comprehensive clinical data package via email and request a medical education lunch to walk through the trial results.',
    points: 1,
    aiRecommended: false,
    feedback: 'Moderate approach. Sharing data is valuable, but not personalized to her specific research on resistance mechanisms or her current trial population. A generic data package may not differentiate from competitor materials.',
  },
  {
    id: 3,
    title: 'AI-Personalized Engagement Strategy',
    description: 'Use AI insights to craft a targeted approach: personalized email referencing her resistance research → share relevant case study → connect with MSL for scientific exchange → explore speaker opportunity aligned with her expertise.',
    points: 3,
    aiRecommended: true,
    feedback: 'Optimal strategy. By connecting your approach to her exact research focus, her trial data, and her patient population, you create immediate scientific relevance and credibility. AI-powered personalization converts 3x better than generic approaches with academic KOLs.',
  },
];

const approachOptions: ApproachOption[] = [
  {
    id: 1,
    icon: Phone,
    title: 'Cold Phone Call',
    description: 'Call her office directly and ask to speak with Dr. Martinez about your oncology product.',
    points: 0,
    success: false,
    outcome: 'Call screened by her assistant. Message left but never returned. Oncologists receive 50+ cold calls weekly — unscheduled interruptions are universally rejected.',
    details: undefined,
  },
  {
    id: 2,
    icon: Mail,
    title: 'Send Generic Email',
    description: 'Email a product brochure and request a meeting to discuss clinical data and patient benefits.',
    points: 1,
    success: false,
    outcome: 'No response after 2 weeks. Email likely filtered or ignored among hundreds of daily messages. No personalization means no reason to prioritize your message.',
    details: undefined,
  },
  {
    id: 3,
    icon: FileText,
    title: 'AI-Powered Personalized Email',
    description: 'Send a brief, personalized email referencing her published resistance research with a specific data point from your pivotal trial addressing her exact clinical challenge.',
    points: 3,
    success: true,
    outcome: 'Response within 48 hours: "Interesting data. I\'d like to learn more about the resistance profile. Do you have time next Tuesday at 3pm?"',
    details: `Subject: Addressing HER2+ Resistance — Insights from Your Recent Research

Dear Dr. Martinez,

I recently read your excellent paper on treatment resistance in post-menopausal HER2+ patients. Your finding that 20% develop resistance within 18 months resonated deeply with me.

Our TRIUMPH trial showed a median duration of response of 24.7 months in a similar patient population, with only 12% developing resistance at 18 months — a 40% improvement over current standard of care.

Given your active research in this area, I thought you might find the detailed resistance biomarker data from our trial particularly relevant.

Would you have 15 minutes next week for a brief scientific discussion?

Best regards,
[Your name]`,
  },
  {
    id: 4,
    icon: Calendar,
    title: 'AI-Coordinated Multi-Touch Campaign',
    description: 'AI orchestrates a sequenced campaign: personalized email → relevant resistance case study → invitation to virtual KOL discussion on resistance mechanisms.',
    points: 3,
    success: true,
    outcome: 'She engages with the case study, registers for the KOL event, and proactively reaches out to schedule a meeting before the event.',
    details: `Timeline:
Day 1: Personalized email referencing her resistance research + TRIUMPH data
Day 4: Follow-up with case study: HER2+ patient who progressed on competitor, switched to your product
Day 7: Invitation to virtual panel "Overcoming Resistance in HER2+ Breast Cancer" featuring peer KOLs
Day 10: Personal note: "Looking forward to seeing you at the panel — I'd love to connect beforehand."`,
  },
];

export default function App1SkepticalOncologist() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('intro');
  const [score, setScore] = useState(0);
  const [selectedResearch, setSelectedResearch] = useState<ResearchOption[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyOption | null>(null);
  const [selectedApproach, setSelectedApproach] = useState<ApproachOption | null>(null);

  const reset = () => {
    setStage('intro');
    setScore(0);
    setSelectedResearch([]);
    setSelectedStrategy(null);
    setSelectedApproach(null);
  };

  const toggleResearch = (option: ResearchOption) => {
    const exists = selectedResearch.find(r => r.id === option.id);
    if (exists) {
      setSelectedResearch(prev => prev.filter(r => r.id !== option.id));
      setScore(prev => prev - option.points);
    } else {
      setSelectedResearch(prev => [...prev, option]);
      setScore(prev => prev + option.points);
    }
  };

  const selectStrategy = (option: StrategyOption) => {
    if (selectedStrategy) return;
    setSelectedStrategy(option);
    setScore(prev => prev + option.points);
  };

  const selectApproach = (option: ApproachOption) => {
    if (selectedApproach) return;
    setSelectedApproach(option);
    setScore(prev => prev + option.points);
  };

  const getSuccess = () => selectedApproach?.success === true;

  const getRank = () => {
    const pct = (score / 15) * 100;
    const success = getSuccess();
    if (pct >= 85 && success) return { label: 'AI-Powered Sales Master', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', message: 'Outstanding! You demonstrated mastery of AI-powered sales techniques. You used data-driven insights to understand your customer, developed a personalized strategy, and executed flawlessly.' };
    if (pct >= 70) return { label: 'Strategic AI User', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', message: 'Great work! You understand how to leverage AI for sales intelligence and personalization. With refinement, you\'ll excel at converting even the most skeptical oncologists.' };
    if (pct >= 50) return { label: 'AI Explorer', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', message: 'You\'re on the right track. There\'s room to improve your research depth and strategic personalization. Review the optimal choices and try again.' };
    return { label: 'AI Beginner', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', message: 'Keep learning! Review the optimal choices and discover how AI-powered approaches dramatically improve outcomes in oncology sales.' };
  };

  // ---- INTRO ----
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-5 sm:p-7 md:p-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Skeptical Oncologist</h1>
              <p className="text-sm text-blue-600 font-medium">AI Sales Simulator</p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Meet Dr. Martinez</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Dr. Elena Martinez is a highly respected oncologist at Memorial Cancer Institute specializing in HER2+ breast cancer. She's research-driven, evidence-focused, and deeply skeptical of pharmaceutical sales visits. She currently prescribes a competitor's product for 85% of eligible patients.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" /> Your Challenge
            </h3>
            <div className="space-y-2">
              {[
                { step: '1', label: 'Research', desc: 'Use AI tools to gather intelligence on Dr. Martinez' },
                { step: '2', label: 'Strategy', desc: 'Choose your engagement approach' },
                { step: '3', label: 'Execute', desc: 'Select the right outreach method' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
                  <div>
                    <span className="font-semibold text-slate-800 text-sm">{item.label}: </span>
                    <span className="text-slate-600 text-sm">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-900">15</div>
              <div className="text-xs text-slate-500">Max Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-slate-900">4</div>
              <div className="text-xs text-slate-500">Rank Levels</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-slate-900">3</div>
              <div className="text-xs text-slate-500">Stages</div>
            </div>
          </div>

          <button
            onClick={() => setStage('research')}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Start Challenge <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ---- RESEARCH ----
  if (stage === 'research') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Stage 1 of 3</div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">AI Research Phase</h2>
              <p className="text-sm text-slate-500">Select all tools to gather intelligence on Dr. Martinez</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-slate-500">points</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-slate-700">{selectedResearch.length}</div>
                <div className="text-xs text-slate-500">selected</div>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all" style={{ width: '33%' }} />
          </div>
        </div>

        {/* Research Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {researchOptions.map(option => {
            const Icon = option.icon;
            const selected = !!selectedResearch.find(r => r.id === option.id);
            return (
              <div
                key={option.id}
                onClick={() => toggleResearch(option)}
                className={`bg-white/95 backdrop-blur rounded-xl border-2 shadow-md hover:shadow-lg transition-all cursor-pointer
                  ${selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'}`}>
                      <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>+{option.points} pts</span>
                      {selected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">{option.title}</h3>
                  {selected && (
                    <div className="space-y-2">
                      <div className="bg-white border border-blue-200 rounded-lg p-3">
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{option.insight}</p>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Brain className="w-3.5 h-3.5 text-blue-200" />
                          <span className="text-blue-200 text-xs font-semibold">AI Insight</span>
                        </div>
                        <p className="text-white text-xs leading-relaxed">{option.aiNote}</p>
                      </div>
                    </div>
                  )}
                  {!selected && <p className="text-slate-500 text-sm">Click to run AI analysis</p>}
                </div>
              </div>
            );
          })}
        </div>

        {selectedResearch.length >= 2 && (
          <div className="bg-white/95 backdrop-blur rounded-xl border border-white/20 shadow-xl p-4">
            <button
              onClick={() => setStage('strategy')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Choose Strategy <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {selectedResearch.length < 2 && (
          <div className="bg-white/10 backdrop-blur rounded-xl border border-white/10 p-3 text-center">
            <p className="text-white/50 text-sm">Select at least 2 research tools to proceed</p>
          </div>
        )}
      </div>
    );
  }

  // ---- STRATEGY ----
  if (stage === 'strategy') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-5 sm:p-7">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-slate-500">Stage 2 of 3</div>
              <div className="text-sm font-bold text-blue-600">{score} pts</div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Choose Your Strategy</h2>
            <p className="text-sm text-slate-500">How will you approach engaging Dr. Martinez?</p>
            <div className="mt-3 bg-slate-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '66%' }} />
            </div>
          </div>

          {/* Context panel */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-sm text-slate-700 font-medium mb-2">AI Summary of Dr. Martinez:</p>
            <ul className="space-y-1">
              {selectedResearch.map(r => (
                <li key={r.id} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{r.insight.split('.')[0]}.</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strategy Options */}
          <div className="space-y-3 mb-5">
            {strategyOptions.map(option => {
              const isSelected = selectedStrategy?.id === option.id;
              const isDisabled = !!selectedStrategy && !isSelected;
              let borderClass = 'border-slate-200 bg-white/50';
              if (isSelected) {
                if (option.points === 3) borderClass = 'border-emerald-500 bg-emerald-50';
                else if (option.points === 1) borderClass = 'border-amber-500 bg-amber-50';
                else borderClass = 'border-red-500 bg-red-50';
              }
              return (
                <div
                  key={option.id}
                  onClick={() => !isDisabled && selectStrategy(option)}
                  className={`border-2 rounded-xl transition-all max-h-96 overflow-y-auto
                    ${borderClass}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'}
                    ${isSelected ? '' : 'hover:bg-slate-50'}`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{option.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {option.aiRecommended && (
                          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" /> AI Pick
                          </span>
                        )}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${option.points === 3 ? 'bg-emerald-100 text-emerald-700' : option.points === 1 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {option.points} pts
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{option.description}</p>
                    {isSelected && (
                      <div className={`mt-3 rounded-lg p-3 border ${option.points === 3 ? 'bg-emerald-50 border-emerald-200' : option.points === 1 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          {option.points === 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-amber-600" />}
                          <span className={`text-xs font-bold ${option.points === 3 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {option.points === 3 ? 'OPTIMAL' : 'SUB-OPTIMAL'}
                          </span>
                        </div>
                        <p className={`text-xs ${option.points === 3 ? 'text-emerald-700' : option.points === 1 ? 'text-amber-700' : 'text-red-700'}`}>{option.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedStrategy && (
            <button
              onClick={() => setStage('approach')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Choose Approach <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- APPROACH ----
  if (stage === 'approach') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-5 sm:p-7">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-slate-500">Stage 3 of 3</div>
              <div className="text-sm font-bold text-blue-600">{score} pts</div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Choose Your Outreach</h2>
            <p className="text-sm text-slate-500">How will you make contact with Dr. Martinez?</p>
            <div className="mt-3 bg-slate-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {approachOptions.map(option => {
              const Icon = option.icon;
              const isSelected = selectedApproach?.id === option.id;
              const isDisabled = !!selectedApproach && !isSelected;
              let borderClass = 'border-slate-200 bg-white/50';
              if (isSelected) {
                if (option.points === 3 && option.success) borderClass = 'border-emerald-500 bg-emerald-50';
                else if (option.points === 1) borderClass = 'border-amber-500 bg-amber-50';
                else borderClass = 'border-red-500 bg-red-50';
              }
              return (
                <div
                  key={option.id}
                  onClick={() => !isDisabled && selectApproach(option)}
                  className={`border-2 rounded-xl transition-all max-h-96 overflow-y-auto
                    ${borderClass}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'}
                    ${isSelected ? '' : 'hover:bg-slate-50'}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected && option.success ? 'bg-emerald-500' : isSelected ? 'bg-red-400' : 'bg-slate-100'}`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">{option.title}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${option.points === 3 ? 'bg-emerald-100 text-emerald-700' : option.points === 1 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {option.points} pts
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1">{option.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className={`mt-3 rounded-lg p-3 border ${option.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-1.5 mb-2">
                          {option.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span className={`text-xs font-bold ${option.success ? 'text-emerald-700' : 'text-red-700'}`}>
                            {option.success ? 'SUCCESS' : 'NO RESPONSE'}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${option.success ? 'text-emerald-700' : 'text-red-700'} line-clamp-3`}>{option.outcome}</p>
                        {option.details && (
                          <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3">
                            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{option.details}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedApproach && (
            <button
              onClick={() => setStage('result')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              See Results <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- RESULT ----
  const rank = getRank();
  const RankIcon = rank.icon;
  const pct = Math.round((score / 15) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 max-w-3xl w-full p-5 sm:p-7 md:p-10">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Results</h1>
          <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full ${rank.bg} border-4 ${rank.color.replace('text-', 'border-')} mb-4`}>
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${rank.color}`}>{score}</div>
              <div className="text-slate-500 text-xs">/15</div>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${rank.bg} mb-3`}>
            <RankIcon className={`w-5 h-5 ${rank.color}`} />
            <span className={`font-bold text-sm ${rank.color}`}>{rank.label}</span>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">{rank.message}</p>
        </div>

        {getSuccess() && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-800 text-sm sm:text-base">Achievements Unlocked</h3>
            </div>
            <ul className="space-y-2">
              {['Researched Dr. Martinez\'s publications', 'Identified HER2+ resistance focus', 'Developed personalized outreach strategy', 'Secured meeting with oncologist'].map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          {[
            { icon: Brain, label: 'Research', value: `${selectedResearch.length}/4`, gradient: 'from-blue-500 to-teal-500' },
            { icon: Target, label: 'Strategy', value: selectedStrategy?.points === 3 ? 'Opt' : 'Sub', gradient: 'from-teal-500 to-emerald-500' },
            { icon: Mail, label: 'Outcome', value: getSuccess() ? 'Yes' : 'No', gradient: 'from-emerald-500 to-teal-500' },
          ].map((stat, i) => {
            const SIcon = stat.icon;
            return (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center shadow-sm">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2`}>
                  <SIcon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
