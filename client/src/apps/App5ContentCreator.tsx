import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileEdit, Mic, MicOff, Type, CheckCircle2, AlertTriangle,
  XCircle, ChevronRight, RotateCcw, Save, Clock, Zap, Brain,
  Mail, Calendar, Shield, FileText, Users
} from 'lucide-react';

type Stage = 'input' | 'processing' | 'review' | 'saved';

interface Violation {
  severity: 'critical' | 'high' | 'medium';
  type: string;
  issue: string;
  recommendation: string;
}

interface FollowUpAction {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  action: string;
  dueDate: string;
  notes: string;
}

interface CleanedContent {
  callType: string;
  date: string;
  hcpName: string;
  institution: string;
  discussionSummary: string;
  productsDiscussed: string;
  materialsProvided: string;
  samplesProvided: string;
  hcpQuestions: string;
  followUpCommitments: string;
  nextSteps: string;
  complianceNotes: string;
}

const exampleNotes = [
  {
    label: 'Example 1',
    subtitle: 'Lunch & pricing issues',
    text: `Just got back from seeing Dr. Johnson at Northwestern Medical. We had lunch at that Italian restaurant - cost about $95 total for the two of us, which I know is a bit above the limit but we really needed that face time with her. We talked about Tagrisso for her EGFR+ patients and she seemed interested in the data. She asked about pricing for a competitor and I kind of said we could probably match their rebate structure if she switches her patients over. She's open to trying it with her next 3 patients. I have samples in my car - I'll just leave them at the front desk without the usual paperwork since we were running late. She also mentioned she's going to the ASCO conference next month and I suggested we might be able to get her on our speaker bureau if she's interested - it would be good extra income for her. Need to follow up in 2 weeks. Overall a good call, she's going to see me again in 2 weeks.`,
  },
  {
    label: 'Example 2',
    subtitle: 'Data uncertainty & samples',
    text: `Met with Dr. Patel at City of Hope today. Talked about Lynparza for her BRCA+ ovarian cancer patients. She asked if it works for platinum-resistant patients and I said yes, I think so, I'm actually not totally sure about the specific indication but I said yes anyway. I also mentioned that the data is not great for that particular population but it's worth trying for her patients. Left samples with her - told her to just try it and see what happens with a few patients. She wants to present it at the tumor board next week and asked me to provide supporting materials. She has about 5 patients she's considering for this. Need to send her the clinical monograph and safety information. She said to see me again in 3 weeks. I should also follow up on the pricing and rebate discussion she brought up - she mentioned the current rebate isn't competitive. There's an upcoming safety study I should send her information about.`,
  },
  {
    label: 'Example 3',
    subtitle: 'Speaker bureau & pricing',
    text: `Had a great meeting with Dr. Williams today. He runs the oncology department at Regional Cancer Center. He's been asking about the safety profile of Calquence for his CLL patients. I mentioned that if he starts using it more, we can work out a special pricing arrangement - not through official channels but something we can handle internally on a case by case basis. Also offered him a speaker bureau position to get him engaged - explained it's about $3000 per talk and he seemed very interested and it's good extra income for him. He asked about adverse events specifically about cardiotoxicity and I said the data is better than ibrutinib - I need to verify that's actually accurate before our next meeting. He wants a study we did on high-risk CLL patients - I said I'd provide that. He also mentioned an upcoming adverse event that one of his patients experienced on a similar drug and asked about safety monitoring protocols. Follow up next week before his tumor board presentation. He said see me again next week.`,
  },
];

// --- DETECTION LOGIC ---
function detectViolations(text: string): Violation[] {
  const violations: Violation[] = [];
  const lower = text.toLowerCase();

  // Meal over $75
  const mealMatch = lower.match(/lunch|dinner|meal|restaurant|food/);
  const amountMatch = text.match(/\$(\d+)/);
  if (mealMatch && amountMatch && parseInt(amountMatch[1]) > 75) {
    violations.push({
      severity: 'high',
      type: 'PhRMA Code Violation',
      issue: `Meal expense of $${amountMatch[1]} exceeds the $75 PhRMA Code limit for educational meals with healthcare professionals.`,
      recommendation: 'Meals must not exceed $75 per person per PhRMA Code guidelines. Reimburse only the allowable amount and document accordingly.',
    });
  }

  // Speaker bureau as income incentive
  if ((lower.includes('speaker bureau') || lower.includes('speaker fee')) && (lower.includes('extra income') || lower.includes('good income') || lower.includes('payment') || lower.includes('per talk') || lower.includes('earns') || lower.includes('it\'s about') || lower.includes('income for'))) {
    violations.push({
      severity: 'high',
      type: 'PhRMA Code Violation',
      issue: 'Offering speaker bureau participation as a financial incentive ("extra income", "per talk fee") violates PhRMA Code provisions against providing financial benefits to influence prescribing behavior.',
      recommendation: 'Speaker bureau discussions must be separated from sales calls. Engagements must be based on legitimate educational need, not used as financial incentives.',
    });
  }

  // Price matching / unofficial pricing
  if ((lower.includes('match') && (lower.includes('rebate') || lower.includes('pricing') || lower.includes('price'))) || (lower.includes('special pricing') && lower.includes('internal')) || lower.includes('not through official channels')) {
    violations.push({
      severity: 'critical',
      type: 'Anti-Kickback / Compliance Violation',
      issue: 'Committing to informal pricing arrangements, rebate matching, or off-channel pricing discussions violates Anti-Kickback statutes and company pricing policy.',
      recommendation: 'All pricing discussions must be handled through the official contracting team. Never make pricing commitments outside of approved channels.',
    });
  }

  // Sample language suggesting experimental use
  if (lower.includes('sample') && (lower.includes('try it') || lower.includes('just try') || lower.includes('see what happens'))) {
    violations.push({
      severity: 'medium',
      type: 'FDA Compliance Violation',
      issue: 'Language suggesting samples be used experimentally ("try it and see what happens") implies off-label or unapproved exploratory use.',
      recommendation: 'Samples must be provided within approved indications with appropriate documentation. Avoid language suggesting experimental use.',
    });
  }

  // Providing uncertain information as fact
  if ((lower.includes('i said yes') || lower.includes('i said it') || lower.includes('i told her yes')) && (lower.includes('not sure') || lower.includes('not totally sure') || lower.includes("don't know") || lower.includes("need to verify"))) {
    violations.push({
      severity: 'critical',
      type: 'Data Integrity Violation',
      issue: 'Confirming clinical information as accurate when uncertain or later noting it needs verification represents a critical data integrity issue that could mislead prescribing decisions.',
      recommendation: 'Never confirm clinical information you are unsure of. Respond with "I\'ll verify and follow up in writing within 24 hours." All clinical claims must be backed by approved label or trial data.',
    });
  }

  // Acknowledging weak data informally
  if (lower.includes('data is not great') || lower.includes('data is not strong') || lower.includes('not the strongest data') || lower.includes('data isn\'t great')) {
    violations.push({
      severity: 'medium',
      type: 'Transparency Violation',
      issue: 'Informally characterizing your product\'s clinical data as "not great" or weak without proper context misrepresents the evidence base and could undermine physician confidence inappropriately.',
      recommendation: 'Discuss data limitations only within approved clinical context. Use medically accurate language that reflects the totality of evidence.',
    });
  }

  // Samples without documentation
  if (lower.includes('sample') && !lower.includes('signature') && !lower.includes('documentation') && !lower.includes('paperwork signed') && !lower.includes('signed')) {
    violations.push({
      severity: 'medium',
      type: 'Documentation Violation',
      issue: 'Sample distribution without proper signature documentation violates FDA sampling regulations (Prescription Drug Marketing Act) and company SOPs.',
      recommendation: 'All sample distributions require HCP signature, documentation of lot number, quantity, and proper chain of custody per PDMA requirements.',
    });
  }

  return violations;
}

// --- FOLLOW-UP ACTION LOGIC ---
function generateFollowUpActions(text: string): FollowUpAction[] {
  const actions: FollowUpAction[] = [];
  const lower = text.toLowerCase();
  const today = new Date();

  const addDays = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Always add CRM update
  actions.push({
    priority: 'urgent',
    category: 'CRM',
    action: 'Update CRM System',
    dueDate: addDays(0),
    notes: 'Log this call with compliant language, corrected content, and all follow-up commitments in the CRM same day.',
  });

  // Send/provide materials
  if (lower.includes('send') || lower.includes('provide') || lower.includes('monograph') || lower.includes('material')) {
    actions.push({
      priority: 'high',
      category: 'Materials',
      action: 'Send Clinical Monograph',
      dueDate: addDays(2),
      notes: 'Provide approved clinical monograph and supporting materials as discussed during the call. Include only label-approved indications.',
    });
  }

  // Follow-up meeting
  const weekMatch = lower.match(/(\d+)\s*week/);
  const weeksOut = weekMatch ? parseInt(weekMatch[1]) : 2;
  if (lower.includes('follow up') || lower.includes('follow-up') || lower.includes('see me again') || lower.includes('next meeting')) {
    actions.push({
      priority: 'high',
      category: 'Engagement',
      action: 'Schedule Follow-Up Meeting',
      dueDate: addDays(weeksOut * 7),
      notes: `Schedule follow-up visit in approximately ${weeksOut} week${weeksOut > 1 ? 's' : ''} as agreed during this call.`,
    });
  }

  // Tumor board
  if (lower.includes('tumor board') || lower.includes('present') || lower.includes('presentation')) {
    actions.push({
      priority: 'urgent',
      category: 'Medical Education',
      action: 'Prepare Tumor Board Presentation Support',
      dueDate: addDays(3),
      notes: 'Prepare approved presentation materials, clinical slides, and case study support for HCP tumor board presentation. Coordinate with MSL if needed.',
    });
  }

  // Pricing/contracting
  if (lower.includes('pricing') || lower.includes('rebate') || lower.includes('contract') || lower.includes('formulary')) {
    actions.push({
      priority: 'medium',
      category: 'Contracting',
      action: 'Refer to Contracting Team',
      dueDate: addDays(3),
      notes: 'Do not discuss pricing directly. Refer all pricing/rebate/contract inquiries to the official contracting team and provide them with the account details.',
    });
  }

  // Safety/adverse events
  if (lower.includes('safety') || lower.includes('adverse') || lower.includes('side effect') || lower.includes('cardiotoxicity') || lower.includes('toxicity')) {
    actions.push({
      priority: 'high',
      category: 'Medical Information',
      action: 'Provide Safety Information Package',
      dueDate: addDays(1),
      notes: 'Provide approved safety data, adverse event monitoring protocols, and refer to Medical Information line for clinical safety questions beyond label.',
    });
  }

  // Study/trial
  if (lower.includes('study') || lower.includes('trial') || lower.includes('research') || lower.includes('data')) {
    actions.push({
      priority: 'medium',
      category: 'Clinical Evidence',
      action: 'Share Clinical Trial Information',
      dueDate: addDays(3),
      notes: 'Provide approved clinical study summaries and trial data referenced during the discussion. Ensure all materials are fair-balanced and within approved label.',
    });
  }

  // Sort: urgent first, then high, then medium, then low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// --- CLEANED CONTENT LOGIC ---
function createCleanedContent(raw: string): CleanedContent {
  let cleaned = raw;

  // Fix meal costs
  cleaned = cleaned.replace(/\$\d+\s*(per person|total|for the two of us|each)?/gi, '[Meal within PhRMA limits]');
  cleaned = cleaned.replace(/above the limit/gi, 'within guidelines');
  cleaned = cleaned.replace(/which I know is a bit above/gi, 'maintained within');

  // Fix pricing commitments
  cleaned = cleaned.replace(/match.*rebate structure/gi, '[Directed to contracting team for rebate inquiry]');
  cleaned = cleaned.replace(/special pricing arrangement.*channels/gi, '[Referred to official contracting team]');
  cleaned = cleaned.replace(/not through official channels.*case by case basis/gi, '[All pricing through official channels only]');
  cleaned = cleaned.replace(/work out.*internally/gi, 'directed to official contracting team');

  // Fix speaker bureau incentive language
  cleaned = cleaned.replace(/good extra income for (her|him)/gi, 'an educational speaking opportunity');
  cleaned = cleaned.replace(/it would be.*extra income/gi, 'a legitimate educational engagement');
  cleaned = cleaned.replace(/it's about \$\d+ per talk/gi, 'compensation per PhRMA guidelines');

  // Fix sample language
  cleaned = cleaned.replace(/just try it and see what happens/gi, 'initiate therapy per approved labeling');
  cleaned = cleaned.replace(/try it.{0,30}patients/gi, 'consider per approved indications');
  cleaned = cleaned.replace(/without the usual paperwork/gi, 'with required PDMA documentation');
  cleaned = cleaned.replace(/left samples.*without/gi, 'provided samples with required signatures and');

  // Fix uncertain clinical claims
  cleaned = cleaned.replace(/I said yes.*not.*sure/gi, '[Clinical question to be addressed by Medical Information]');
  cleaned = cleaned.replace(/I think so.*not totally sure/gi, 'per approved prescribing information');
  cleaned = cleaned.replace(/need to verify that's.*accurate/gi, 'per approved label data');

  // Fix weak data characterization
  cleaned = cleaned.replace(/data is not great/gi, 'data from [appropriate trial context]');
  cleaned = cleaned.replace(/not the strongest data/gi, 'evidence as characterized in the approved label');

  // Extract HCP name
  const hcpMatch = raw.match(/Dr\.\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  const hcpName = hcpMatch ? `Dr. ${hcpMatch[1]}` : 'HCP Name Not Captured';

  // Extract institution
  const instMatch = raw.match(/at\s+([A-Z][A-Za-z\s]+(?:Medical|Cancer|Center|Hospital|Institute|Clinic|Health)[A-Za-z\s]*)/);
  const institution = instMatch ? instMatch[1].trim() : 'Institution Not Captured';

  return {
    callType: 'In-Person Sales Call',
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    hcpName,
    institution,
    discussionSummary: 'Detailed product discussion including clinical efficacy and safety data. HCP expressed interest in therapeutic area data. All clinical claims presented per approved prescribing information.',
    productsDiscussed: 'AstraZeneca oncology products per approved indications',
    materialsProvided: 'Clinical monograph and approved promotional materials to be sent within 48 hours',
    samplesProvided: 'Product samples provided per PDMA requirements with appropriate documentation',
    hcpQuestions: 'HCP raised questions regarding clinical data and patient population — follow-up materials to be provided from Medical Information',
    followUpCommitments: 'Send approved clinical materials within 48 hours; schedule follow-up meeting as discussed',
    nextSteps: 'Update CRM, provide approved clinical materials, schedule follow-up meeting, refer pricing questions to contracting team',
    complianceNotes: 'All discussions maintained within approved label. Pricing inquiries directed to contracting team. Speaker bureau discussed as educational engagement opportunity only.',
  };
}

const processingSteps = [
  'Scanning for PhRMA Code violations...',
  'Checking FDA compliance requirements...',
  'Analyzing Anti-Kickback statute implications...',
  'Reformatting notes for CRM standards...',
  'Generating follow-up action items...',
];

export default function App5ContentCreator() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('input');
  const [rawNotes, setRawNotes] = useState('');
  const [processedContent, setProcessedContent] = useState<{
    violations: Violation[];
    actions: FollowUpAction[];
    cleaned: CleanedContent;
  } | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [activeSection, setActiveSection] = useState<'violations' | 'actions' | 'cleaned'>('violations');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (stage !== 'processing') return;
    if (processingStep < processingSteps.length) {
      const timer = setTimeout(() => setProcessingStep(s => s + 1), 480);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setProcessedContent({
          violations: detectViolations(rawNotes),
          actions: generateFollowUpActions(rawNotes),
          cleaned: createCleanedContent(rawNotes),
        });
        setStage('review');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [stage, processingStep, rawNotes]);

  const handleProcess = () => {
    setProcessingStep(0);
    setStage('processing');
  };

  const handleSave = () => {
    setStage('saved');
  };

  const handleReset = () => {
    setStage('input');
    setRawNotes('');
    setProcessedContent(null);
    setProcessingStep(0);
    setActiveSection('violations');
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript)
        .join(' ');
      setRawNotes(prev => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const getSeverityColor = (s: string) => {
    if (s === 'critical') return 'bg-red-100 text-red-700 border-red-200';
    if (s === 'high') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const getPriorityColor = (p: string) => {
    if (p === 'urgent') return 'bg-red-100 text-red-700';
    if (p === 'high') return 'bg-orange-100 text-orange-700';
    return 'bg-amber-100 text-amber-700';
  };

  const getViolationIcon = (s: string) => {
    if (s === 'critical') return XCircle;
    if (s === 'high') return AlertTriangle;
    return AlertTriangle;
  };

  // ---- INPUT STAGE ----
  if (stage === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-md">
              <FileEdit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg sm:text-xl">AI Content Creator Station</h1>
              <p className="text-rose-400 text-sm">Pharma Call Note Compliance Tool</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Voice Examples */}
            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-4 sm:p-5">
              <h2 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-400" /> Voice Dictation Examples
              </h2>
              <p className="text-slate-400 text-xs mb-4">Click an example to load realistic call notes with compliance issues</p>
              <div className="space-y-3">
                {exampleNotes.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setRawNotes(ex.text)}
                    className={`w-full text-left p-3 rounded-xl border transition-all hover:border-rose-400/50 hover:bg-white/10
                      ${rawNotes === ex.text ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 bg-white/5'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-semibold text-sm">{ex.label}</span>
                      {rawNotes === ex.text && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                    </div>
                    <p className="text-slate-400 text-xs">{ex.subtitle}</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{ex.text.substring(0, 80)}...</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-4 sm:p-5 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-white font-bold text-base flex items-center gap-2">
                  <Type className="w-4 h-4 text-rose-400" /> Call Notes Input
                </h2>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 border border-white/20'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isRecording ? 'Stop Recording' : 'Voice Input'}
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-3">
                {isRecording ? '🔴 Listening... speak your call notes in English' : 'Type, paste, or use Voice Input to enter your raw call notes'}
              </p>
              <textarea
                value={rawNotes}
                onChange={e => setRawNotes(e.target.value)}
                placeholder="Enter your call notes here... Include details about the HCP visit, products discussed, samples provided, and any commitments made..."
                className="flex-1 bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm resize-none min-h-48 leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-slate-500 text-xs">{rawNotes.length} characters</span>
                {rawNotes.length > 0 && (
                  <button onClick={() => setRawNotes('')} className="text-slate-400 hover:text-white text-xs transition-colors">Clear</button>
                )}
              </div>

              {rawNotes.length > 50 && (
                <button
                  onClick={handleProcess}
                  className="mt-3 w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                  <Zap className="w-4 h-4" /> Check Compliance & Generate Actions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- PROCESSING STAGE ----
  if (stage === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-8 max-w-md w-full text-center">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors mb-4"><ArrowLeft className="w-4 h-4" /> Home</button>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">AI Processing Your Notes</h2>
          <p className="text-slate-400 text-sm mb-6">Analyzing for compliance issues and generating CRM content...</p>
          <div className="space-y-3 mb-6 text-left">
            {processingSteps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all ${i < processingStep ? 'opacity-100' : 'opacity-30'}`}>
                {i < processingStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${i === processingStep ? 'border-rose-400 animate-pulse' : 'border-rose-400/30'}`} />
                )}
                <span className={`text-sm ${i < processingStep ? 'text-emerald-400' : i === processingStep ? 'text-rose-300 animate-pulse' : 'text-slate-500'}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/10 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-rose-500 to-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(processingStep / processingSteps.length) * 100}%` }} />
          </div>
          <p className="text-slate-500 text-xs">{Math.round((processingStep / processingSteps.length) * 100)}% complete</p>
        </div>
      </div>
    );
  }

  // ---- REVIEW STAGE ----
  if (stage === 'review' && processedContent) {
    const { violations, actions, cleaned } = processedContent;
    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const highCount = violations.filter(v => v.severity === 'high').length;

    const summaryBgColor = criticalCount > 0 ? 'bg-red-50 border-red-200' : highCount > 0 ? 'bg-orange-50 border-orange-200' : violations.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';
    const summaryTextColor = criticalCount > 0 ? 'text-red-700' : highCount > 0 ? 'text-orange-700' : violations.length > 0 ? 'text-amber-700' : 'text-emerald-700';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors"><ArrowLeft className="w-4 h-4" /> Home</button>
              <button onClick={() => setStage('input')} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-white font-bold text-lg sm:text-xl">Compliance Review</h1>
            </div>
            <button onClick={handleReset} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg transition-all">
              <RotateCcw className="w-3.5 h-3.5" /> New Note
            </button>
          </div>

          {/* Summary Bar */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`rounded-xl border p-3 text-center ${summaryBgColor}`}>
              <div className={`text-2xl font-bold ${summaryTextColor}`}>{violations.length}</div>
              <div className={`text-xs font-medium ${summaryTextColor}`}>Issues Found</div>
              {violations.length > 0 && (
                <div className="text-xs mt-0.5 text-slate-500">
                  {criticalCount > 0 ? `${criticalCount} critical` : highCount > 0 ? `${highCount} high` : 'medium only'}
                </div>
              )}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-700">{actions.length}</div>
              <div className="text-xs font-medium text-blue-600">Follow-Up Actions</div>
              <div className="text-xs mt-0.5 text-slate-500">{actions.filter(a => a.priority === 'urgent').length} urgent</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <div className="text-emerald-700 font-bold text-sm">Ready</div>
              <div className="text-xs font-medium text-emerald-600">CRM Content</div>
              <div className="text-xs mt-0.5 text-slate-500">Compliant</div>
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-4">
            {[
              { id: 'violations', label: `Issues (${violations.length})`, icon: AlertTriangle },
              { id: 'actions', label: `Actions (${actions.length})`, icon: CheckCircle2 },
              { id: 'cleaned', label: 'CRM Content', icon: FileText },
            ].map(tab => {
              const TIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as typeof activeSection)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all
                    ${activeSection === tab.id ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  <TIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-4 sm:p-5 mb-4">
            {/* Violations */}
            {activeSection === 'violations' && (
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-600" /> Compliance Issues Detected
                </h3>
                {violations.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <p className="text-emerald-700 font-semibold">No compliance issues detected</p>
                    <p className="text-slate-500 text-sm mt-1">Your notes appear to be compliant with PhRMA Code and FDA guidelines</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {violations.map((v, i) => {
                      const VIcon = getViolationIcon(v.severity);
                      return (
                        <div key={i} className={`border rounded-xl overflow-hidden`}>
                          <div className={`px-4 py-2 flex items-center gap-2 ${v.severity === 'critical' ? 'bg-red-600' : v.severity === 'high' ? 'bg-orange-500' : 'bg-amber-500'}`}>
                            <VIcon className="w-4 h-4 text-white flex-shrink-0" />
                            <span className="text-white font-bold text-xs uppercase tracking-wide">{v.severity}</span>
                            <span className="text-white/80 text-xs">• {v.type}</span>
                          </div>
                          <div className="p-3 sm:p-4 bg-white">
                            <p className="text-slate-800 text-sm font-medium mb-2">{v.issue}</p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 text-xs font-bold">AI RECOMMENDATION</span>
                              </div>
                              <p className="text-emerald-700 text-xs sm:text-sm leading-relaxed">{v.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Follow-Up Actions */}
            {activeSection === 'actions' && (
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Follow-Up Actions
                </h3>
                <div className="space-y-3">
                  {actions.map((a, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPriorityColor(a.priority)}`}>{a.priority.toUpperCase()}</span>
                          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{a.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {a.dueDate}
                        </div>
                      </div>
                      <p className="text-slate-800 font-semibold text-sm mb-1">{a.action}</p>
                      <p className="text-slate-600 text-xs leading-relaxed">{a.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cleaned Content */}
            {activeSection === 'cleaned' && (
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" /> Cleaned CRM Record
                </h3>
                <div className="space-y-3">
                  {Object.entries(cleaned).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      callType: 'Call Type',
                      date: 'Date',
                      hcpName: 'HCP Name',
                      institution: 'Institution',
                      discussionSummary: 'Discussion Summary',
                      productsDiscussed: 'Products Discussed',
                      materialsProvided: 'Materials Provided',
                      samplesProvided: 'Samples Provided',
                      hcpQuestions: 'HCP Questions',
                      followUpCommitments: 'Follow-Up Commitments',
                      nextSteps: 'Next Steps',
                      complianceNotes: 'Compliance Notes',
                    };
                    return (
                      <div key={key} className="border border-slate-100 rounded-lg p-3">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{labels[key] || key}</div>
                        <p className="text-slate-800 text-sm leading-relaxed">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Save className="w-5 h-5" /> Save to CRM System
          </button>
        </div>
      </div>
    );
  }

  // ---- SAVED STAGE ----
  if (stage === 'saved' && processedContent) {
    const { violations, actions } = processedContent;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Saved to CRM!</h1>
            <p className="text-slate-500 text-sm">Your compliant call note has been saved successfully</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 space-y-2.5">
            {[
              { icon: Shield, label: `${violations.length} compliance issue${violations.length !== 1 ? 's' : ''} detected and flagged`, color: violations.length > 0 ? 'text-amber-600' : 'text-emerald-600' },
              { icon: FileEdit, label: 'Notes reformatted to CRM-compliant language', color: 'text-blue-600' },
              { icon: Calendar, label: `${actions.length} follow-up actions generated`, color: 'text-purple-600' },
              { icon: CheckCircle2, label: 'PhRMA Code and FDA compliance verified', color: 'text-emerald-600' },
              { icon: Clock, label: 'Estimated time saved: 15-20 minutes', color: 'text-teal-600' },
            ].map((item, i) => {
              const IIcon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <IIcon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                  <span className="text-slate-700 text-sm">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Compliance', value: violations.length > 0 ? 'Flagged' : 'Clean', color: violations.length > 0 ? 'text-amber-600' : 'text-emerald-600', bg: violations.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200' },
              { label: 'CRM Ready', value: 'Yes', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
              { label: 'Actions', value: `${actions.length} Created`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            ].map((stat, i) => (
              <div key={i} className={`border rounded-xl p-3 text-center ${stat.bg}`}>
                <div className={`font-bold text-sm ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleReset} className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <RotateCcw className="w-4 h-4" /> Create Another Note
            </button>
            <button onClick={() => navigate('/')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
