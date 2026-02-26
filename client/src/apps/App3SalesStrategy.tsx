import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Target, TrendingUp, Award, RotateCcw,
  ChevronRight, ChevronDown, ArrowLeft, CheckCircle2,
  XCircle, Zap, Star, Users, Clock, Shield
} from 'lucide-react';

interface Option {
  text: string;
  points: 0 | 1 | 2 | 3;
  feedback: string;
}

interface Scenario {
  title: string;
  situation: string;
  options: Option[];
  aiRecommendation: string;
  aiReasoning: string;
}

const scenarios: Scenario[] = [
  {
    title: 'The Skeptical Oncologist',
    situation: 'Dr. Chen is a highly respected oncologist at a major academic cancer center who has prescribed a competitor\'s EGFR inhibitor for 5 years and achieved good results with it. You have a 10-minute window before her next patient, with only your detail aid and your wits. She\'s politely skeptical of pharmaceutical representatives and values published, peer-reviewed evidence above all else. How do you make the most of this opportunity?',
    options: [
      {
        text: 'A) Leave samples and your business card with the nurse, mentioning you have new efficacy data available whenever she\'s ready.',
        points: 0,
        feedback: 'Missed opportunity. Leaving materials passively sends the message that you don\'t believe the conversation is worth having. Nurses typically don\'t relay this level of scientific detail, and the materials will likely be discarded.',
      },
      {
        text: 'B) Focus your 10 minutes on presenting Tagrisso\'s safety profile, specifically the more favorable side effect profile compared to older EGFR inhibitors.',
        points: 1,
        feedback: 'Partial credit. Safety differentiation is a valid point, but it\'s a generic message she\'s likely heard before. You haven\'t connected to her specific patient population or clinical experience, making this easy to dismiss.',
      },
      {
        text: 'C) Open by asking about her patients\' progression patterns after first-line treatment and pivot to present T790M resistance data and FLAURA head-to-head outcomes.',
        points: 2,
        feedback: 'Good approach. You\'re connecting to a real clinical challenge and presenting relevant comparative data. However, you\'re still working from a general clinical problem — not her specific patient cases or research interests.',
      },
      {
        text: 'D) Reference her recently published paper on EGFR resistance mechanisms, acknowledge the specific challenge she identified, and share one data point from FLAURA2 that directly addresses her published hypothesis.',
        points: 3,
        feedback: 'Optimal. AI-powered pre-call research identified her publication, extracted the key scientific question she\'s focused on, and allowed you to create an immediate, relevant scientific connection. This is 3x more likely to generate a follow-up meeting than a generic detail.',
      },
    ],
    aiRecommendation: 'Reference her recently published paper on EGFR resistance mechanisms and share one data point from FLAURA2 that directly addresses her published hypothesis.',
    aiReasoning: 'AI pre-call analysis cross-referenced Dr. Chen\'s publication history, identified her active research focus on T790M resistance mechanisms, and matched it to FLAURA2 subset data. Academic oncologists who feel their research is recognized and engaged are 3.2x more likely to schedule a follow-up scientific exchange. The AI\'s ability to personalize outreach at scale — reading and synthesizing publications, claims data, and conference presentations — is the core competitive advantage that transforms a "sales call" into a "scientific conversation."',
  },
  {
    title: 'Territory Prioritization Dilemma',
    situation: 'You have 45 oncologists in your territory. It\'s Q4, your quota requires 20 new patient starts, and you have 8 weeks left. You can realistically make 4-5 quality calls per day. You\'ve been spreading your time fairly evenly across your territory, but aren\'t hitting your numbers. You need to fundamentally rethink your approach. How do you decide who to call on?',
    options: [
      {
        text: 'A) Visit all 45 oncologists in alphabetical order — a systematic approach ensures no one is overlooked.',
        points: 0,
        feedback: 'This approach ignores patient volume, prescribing potential, and timing entirely. Visiting low-volume community oncologists who see 2 eligible patients per year with the same frequency as high-volume academic oncologists is a fundamental misallocation of your most scarce resource: time.',
      },
      {
        text: 'B) Focus exclusively on your top 5 highest current prescribers to maximize existing relationships and defend your base.',
        points: 1,
        feedback: 'Defending your base has value, but it\'s not a growth strategy. If these 5 are already prescribing, you may be getting diminishing returns on each visit. You\'re ignoring high-potential accounts that could drive significant new patient starts in the next 8 weeks.',
      },
      {
        text: 'C) Segment your territory into tiers based on historical prescription volume and patient population, and prioritize tier-1 and tier-2 accounts proportionally.',
        points: 2,
        feedback: 'Solid strategic approach. Tiering by potential ensures your time is spent proportionally. However, this is based on historical data — it doesn\'t account for accounts with recent trigger events (new EGFR+ diagnoses, competitor drug shortages, newly hired fellows) that represent immediate opportunity.',
      },
      {
        text: 'D) Use AI-powered territory analysis to identify oncologists with newly diagnosed EGFR+ patients in the past 30 days, recent conference attendance, upcoming tumor board presentations, and treatment gaps versus your product\'s indication.',
        points: 3,
        feedback: 'Optimal. AI identifies the right account, at the right moment, for the right reason. This is the difference between interrupting a physician on a random Tuesday and arriving when a patient is actively being treatment-planned. Timing-based prioritization consistently outperforms volume-based prioritization in driving new starts.',
      },
    ],
    aiRecommendation: 'Use AI-powered territory analysis to identify oncologists with newly diagnosed EGFR+ patients, recent conference attendance, and timing-based treatment gaps.',
    aiReasoning: 'AI territory intelligence layers multiple real-time data streams: claims data for new patient identification, EHR integration signals for treatment initiation windows, conference attendance for scientific interest indicators, and competitive intelligence for market shift opportunities. Studies show that timing-based call prioritization (calling when a treatment decision is being made) drives 2.5x more new patient starts than volume-based prioritization alone. AI can analyze all 45 accounts simultaneously in seconds and rank them by probability of generating a new start in the next 30 days — something impossible to do manually at scale.',
  },
  {
    title: 'The Tumor Board Ambush',
    situation: 'You\'ve been invited to present at a regional tumor board — 22 oncologists, a rare and valuable opportunity. Halfway through your Tagrisso presentation, a KOL in the back raises her hand and cites a single case report from a European journal suggesting a possible rare adverse event you weren\'t expecting. The room goes quiet and all eyes turn to you. How do you respond?',
    options: [
      {
        text: 'A) Minimize the concern by noting that case reports are anecdotal, not population-level data, and quickly pivot back to your efficacy slides.',
        points: 0,
        feedback: 'Dangerous and reputation-damaging. Dismissing a safety concern raised by a KOL in front of 22 colleagues signals that you prioritize sales over patient safety. This will be remembered long after your efficacy data is forgotten. Never minimize a safety concern.',
      },
      {
        text: 'B) Acknowledge the question respectfully, admit you\'re not familiar with the specific case report, and promise to follow up with a written response within 48 hours.',
        points: 1,
        feedback: 'Professional but incomplete. Acknowledging the concern and committing to follow up is appropriate, but you\'ve left a vacuum that competitors and skeptics will fill. If you can provide any contextual data in the moment, you should.',
      },
      {
        text: 'C) Immediately reference the comprehensive safety data from the Phase 3 label and the adverse event monitoring protocol, placing the case report in statistical context.',
        points: 2,
        feedback: 'Good response. Using the label data to contextualize a case report demonstrates scientific credibility. However, you\'re missing the opportunity to facilitate the scientific dialogue that could convert skeptics into advocates.',
      },
      {
        text: 'D) Thank the physician for the question, reference the specific adverse event monitoring protocol from your FLAURA safety database, compare the incidence rate to the competitor\'s label, offer to connect the KOL directly with your Medical Science Liaison for a deeper scientific exchange, and volunteer to provide a written summary to all attendees.',
        points: 3,
        feedback: 'Optimal. This response demonstrates scientific depth, transparency, and proactive follow-through. Offering an MSL connection signals that you\'re prioritizing scientific dialogue over sales, which builds the credibility that drives long-term relationships. AI pre-call preparation would have flagged this safety topic as a likely discussion point based on recent publications in this geographic market.',
      },
    ],
    aiRecommendation: 'Thank the physician, reference the adverse event monitoring protocol from FLAURA safety data, compare to competitor\'s label, offer MSL connection, and volunteer a written summary to all attendees.',
    aiReasoning: 'AI pre-call intelligence scans recent publications, conference presentations, and medical community discussions in your geographic territory to identify likely objections. In this case, AI would have flagged the European case report as a "trending discussion topic" among regional oncologists 2 weeks before your presentation, giving you time to prepare a comprehensive response. The optimal response doesn\'t just answer the question — it demonstrates scientific partnership by engaging the MSL (who can have conversations you can\'t) and creating a follow-up touchpoint with all 22 attendees simultaneously. This turns a potential ambush into a relationship-building opportunity.',
  },
  {
    title: 'The Insurance Denial Crisis',
    situation: 'It\'s 4:30 PM on a Friday. Dr. Patel calls you — his office manager is on the line, frustrated. A patient\'s insurance has denied prior authorization for Lynparza. The patient is a 52-year-old BRCA2+ ovarian cancer patient who has been on Lynparza for 3 weeks, responding well, and is now facing an interruption in therapy if the denial isn\'t resolved. The office manager says they\'ve never dealt with an appeal before. What do you do?',
    options: [
      {
        text: 'A) Express empathy, explain that reimbursement issues are technically outside your scope, and provide the general customer service number for the insurance company.',
        points: 0,
        feedback: 'Completely inadequate. Patient access is your responsibility as a pharmaceutical representative. Directing them to a general insurance hotline is the equivalent of saying "not my problem." This will damage your relationship with Dr. Patel permanently.',
      },
      {
        text: 'B) Provide the Lynparza patient support program hotline number and the general reimbursement specialist contact, and encourage the office to call first thing Monday morning.',
        points: 1,
        feedback: 'Minimal response. The hotline is helpful, but waiting until Monday creates unnecessary treatment gap anxiety for the patient and the physician. You\'re not adding unique value — you\'re just passing the problem to another phone number.',
      },
      {
        text: 'C) Immediately call your own reimbursement team, conference them into the call with Dr. Patel\'s office, and provide a standardized appeal letter template while staying on the line.',
        points: 2,
        feedback: 'Strong response. Real-time connection with your reimbursement team shows urgency and ownership. The template accelerates the appeal process. You\'re creating genuine value. However, you\'re not yet personalizing the appeal to the specific denial reason code.',
      },
      {
        text: 'D) Get the specific denial reason code from the office manager right now, text your reimbursement specialist to pull the matching clinical evidence and appeal pathway, send the office a denial-specific appeal template with the exact clinical data required by this insurer within 30 minutes, and commit to a personal update call before end of business.',
        points: 3,
        feedback: 'Optimal. Each insurance denial has a specific reason code that requires specific clinical evidence. Generic appeals are often denied again. AI can instantly identify the denial reason, match it to the appropriate clinical data, and pre-populate an appeal template specific to that payer\'s requirements. Your ability to respond specifically, rapidly, and personally — on a Friday at 4:30 PM — will make Dr. Patel a loyal advocate for life.',
      },
    ],
    aiRecommendation: 'Get the specific denial reason code, immediately text your reimbursement specialist, send a payer-specific appeal template with matched clinical evidence within 30 minutes, and commit to a personal update call.',
    aiReasoning: 'AI-powered reimbursement tools map insurance denial reason codes to the specific clinical evidence that has the highest appeal success rate with each individual payer. This is not generic — each payer has different evidence standards, different formulary requirements, and different coverage criteria. AI can analyze thousands of prior appeals to identify which clinical arguments succeed with which payers. The ability to respond specifically (not generically), immediately (not Monday morning), and personally (not through a general hotline) is what transforms a crisis into a trust-building moment. Studies show that reps who resolve access issues rapidly have 4x higher physician loyalty scores.',
  },
  {
    title: 'The New Hire Opportunity',
    situation: 'Three newly hired oncologists have just joined Meridian Cancer Center, one of the top 5 accounts in your territory. They\'re all fellows just out of residency with no established prescribing history. Your veteran rep competitor has a 10-year relationship with the division chief who is mentoring them. You have no existing relationship with any of the three. This is a critical opportunity to establish foundational relationships before habits form. How do you approach them?',
    options: [
      {
        text: 'A) Wait 6 months until they are more settled and have an established patient panel before attempting to build a relationship.',
        points: 0,
        feedback: 'Fatal strategic error. The most powerful predictor of a physician\'s long-term prescribing patterns is what they learned and practiced in their first year of independent practice. The window to establish foundational relationships is narrow — once prescribing habits form, they become deeply entrenched. Waiting is conceding this opportunity entirely to your competitor.',
      },
      {
        text: 'B) Send a professional welcome package with product brochures, a personalized note from your medical director, and an invitation to a virtual product symposium next month.',
        points: 1,
        feedback: 'Shows awareness, but lacks genuine personalization. Welcome packages are standard practice — your competitor is likely sending one too. A generic introduction doesn\'t differentiate you or create a genuine connection. New physicians are drowning in materials; a brochure won\'t be remembered.',
      },
      {
        text: 'C) Schedule individual introductory meetings with each physician within their first week to understand their patient focus areas, therapeutic interests, and professional goals before discussing your product.',
        points: 2,
        feedback: 'Good foundational approach. Learning before selling is exactly right. Understanding their interests before presenting your product builds credibility. However, you\'re still starting from zero — you have no background intelligence to make the first meeting feel customized to them.',
      },
      {
        text: 'D) Use AI to analyze each physician\'s fellowship institution, residency publications, thesis topics, conference presentations, and mentor networks. Craft three unique introductory messages referencing something specific about each physician\'s training background. Coordinate with existing institution relationships to get a warm introduction. Schedule meetings before their first week ends.',
        points: 3,
        feedback: 'Optimal. AI pre-analysis of public medical profiles, publications, and training backgrounds allows you to walk into the first meeting already knowing what matters to this physician. "I noticed your fellowship was focused on EGFR resistance mechanisms at Dana-Farber — that\'s directly relevant to the data I\'d like to share with you" is infinitely more powerful than "Hi, I\'m your new AstraZeneca rep." Speed + personalization + warm introduction = relationship foundation that lasts a career.',
      },
    ],
    aiRecommendation: 'Use AI to analyze each physician\'s fellowship, publications, and training background. Craft personalized introductions referencing their specific research interests and secure warm introductions through existing institutional relationships.',
    aiReasoning: 'New physician relationships are the highest-ROI investment in pharmaceutical sales — the cost to establish a prescribing preference early is dramatically lower than the cost to change an established habit later. AI can analyze a new physician\'s entire digital footprint in minutes: fellowship training, thesis work, conference presentations, publications, and professional networks. This intelligence transforms a generic cold introduction into a personalized scientific conversation that signals genuine respect for their expertise. Combined with institutional network analysis to identify shared professional connections for warm introductions, AI gives you a competitive advantage over incumbents who rely only on tenure. Fellowship-trained physicians who receive scientifically personalized outreach in their first 90 days are 5x more likely to remain loyal prescribers for their first decade of practice.',
  },
];

export default function App3SalesStrategy() {
  const navigate = useNavigate();
  const [view, setView] = useState<'quiz' | 'results'>('quiz');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [aiRevealed, setAiRevealed] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario) / scenarios.length) * 100;
  const maxScore = scenarios.length * 3;

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setTotalScore(prev => prev + scenario.options[idx].points);
  };

  const handleRevealAI = () => {
    setAiRevealed(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setAiRevealed(false);
    } else {
      setIsComplete(true);
      setView('results');
    }
  };

  const handleReset = () => {
    setView('quiz');
    setCurrentScenario(0);
    setSelectedOption(null);
    setAiRevealed(false);
    setTotalScore(0);
    setIsComplete(false);
  };

  const getOptionStyle = (idx: number) => {
    if (selectedOption === null) return 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer';
    const pts = scenario.options[idx].points;
    if (idx === selectedOption) {
      if (pts === 3) return 'border-emerald-500 bg-emerald-50 cursor-default';
      if (pts === 2) return 'border-teal-400 bg-teal-50 cursor-default';
      if (pts === 1) return 'border-amber-400 bg-amber-50 cursor-default';
      return 'border-red-400 bg-red-50 cursor-default';
    }
    return 'border-slate-200 bg-white opacity-30 cursor-not-allowed';
  };

  const getPointsStyle = (pts: number) => {
    if (pts === 3) return 'bg-emerald-100 text-emerald-700';
    if (pts === 2) return 'bg-teal-100 text-teal-700';
    if (pts === 1) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getRank = () => {
    const pct = (totalScore / maxScore) * 100;
    if (pct >= 90) return { label: 'AI Sales Master', color: 'text-emerald-600', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', message: 'Exceptional. You consistently chose the data-driven, AI-powered approach. You understand how to leverage technology to personalize, time, and optimize every customer interaction for maximum impact.' };
    if (pct >= 70) return { label: 'Strategic Thinker', color: 'text-blue-600', bg: 'from-blue-50 to-teal-50', border: 'border-blue-200', message: 'Strong performance. You demonstrate solid strategic instincts and understand the value of personalization. Deepen your use of AI tools to reach the next level of precision and consistency.' };
    if (pct >= 50) return { label: 'Emerging Strategist', color: 'text-amber-600', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', message: 'Good foundation. You\'re making defensible choices but sometimes defaulting to generic tactics. Focus on timing precision, deeper pre-call research, and proactive problem resolution to elevate your game.' };
    return { label: 'AI Learner', color: 'text-slate-600', bg: 'from-slate-50 to-gray-50', border: 'border-slate-200', message: 'Keep developing your AI-powered sales skills. Review the optimal choices — the key insight is that personalization, timing, and proactive problem-solving consistently outperform generic approaches in oncology sales.' };
  };

  // --- RESULTS VIEW ---
  if (view === 'results') {
    const rank = getRank();
    const pct = Math.round((totalScore / maxScore) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-7 md:p-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Challenge Complete!</h1>
            <p className="text-slate-500 text-sm">AI Sales Strategy Game</p>
          </div>

          {/* Score */}
          <div className={`bg-gradient-to-br ${rank.bg} border ${rank.border} rounded-2xl p-5 text-center mb-5`}>
            <div className={`text-4xl sm:text-5xl font-bold ${rank.color} mb-1`}>{totalScore}<span className="text-2xl text-slate-400">/{maxScore}</span></div>
            <div className="text-slate-500 text-sm mb-3">{pct}% Score</div>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border ${rank.border}`}>
              <Star className={`w-4 h-4 ${rank.color}`} />
              <span className={`font-bold text-sm ${rank.color}`}>{rank.label}</span>
            </div>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-sm mx-auto">{rank.message}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Target, label: 'Score', value: `${pct}%`, color: 'from-teal-500 to-emerald-500' },
              { icon: Users, label: 'Scenarios', value: `${scenarios.length}`, color: 'from-blue-500 to-teal-500' },
              { icon: Brain, label: 'AI Thinking', value: pct >= 70 ? 'Strong' : 'Growing', color: 'from-purple-500 to-teal-500' },
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

          <div className="flex gap-3">
            <button onClick={handleReset} className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={() => navigate('/')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ VIEW ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-3 sm:p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </button>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-white font-bold text-lg">{totalScore}</div>
                <div className="text-white/50 text-xs">/{scenarios.length * 3} pts</div>
              </div>
              <span className="text-white/60 text-sm">Scenario {currentScenario + 1} of {scenarios.length}</span>
            </div>
          </div>
          <div className="mt-3 bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-6 md:p-7 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Scenario {currentScenario + 1}</span>
            <h2 className="text-slate-900 font-bold text-base sm:text-lg">{scenario.title}</h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">{scenario.situation}</p>

          {/* Options */}
          <div className="space-y-3">
            {scenario.options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`border-2 rounded-xl transition-all ${getOptionStyle(idx)}`}
              >
                <div className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
                      ${selectedOption === idx ? opt.points === 3 ? 'border-emerald-500 bg-emerald-500 text-white' : opt.points >= 1 ? 'border-amber-500 bg-amber-500 text-white' : 'border-red-500 bg-red-500 text-white' : 'border-slate-300 text-slate-500'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <p className="text-slate-800 text-sm leading-relaxed flex-1">{opt.text}</p>
                    {selectedOption !== null && (
                      <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${getPointsStyle(opt.points)}`}>
                        {opt.points}pts
                      </span>
                    )}
                  </div>
                  {selectedOption === idx && (
                    <div className={`mt-3 rounded-lg p-3 border text-xs leading-relaxed
                      ${opt.points === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        opt.points === 2 ? 'bg-teal-50 border-teal-200 text-teal-700' :
                        opt.points === 1 ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        'bg-red-50 border-red-200 text-red-700'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {opt.points >= 2 ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="font-bold">{opt.points === 3 ? 'OPTIMAL CHOICE' : opt.points === 2 ? 'GOOD CHOICE' : opt.points === 1 ? 'PARTIAL CREDIT' : 'POOR CHOICE'}</span>
                      </div>
                      {opt.feedback}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Reveal Button */}
          {selectedOption !== null && !aiRevealed && (
            <button
              onClick={handleRevealAI}
              className="mt-4 w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Brain className="w-4 h-4" /> Reveal AI's Strategy <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AI Panel */}
        {aiRevealed && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-teal-500/30 shadow-xl p-5 sm:p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">AI Recommendation</h3>
                <p className="text-teal-400 text-xs">Data-driven optimal approach</p>
              </div>
            </div>
            <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-3 mb-4">
              <p className="text-teal-100 text-sm font-semibold leading-relaxed">{scenario.aiRecommendation}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">AI REASONING</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{scenario.aiReasoning}</p>
            </div>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {currentScenario < scenarios.length - 1 ? (
                <>Next Scenario <ChevronRight className="w-5 h-5" /></>
              ) : (
                <>See Results <Award className="w-5 h-5" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
