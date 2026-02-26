import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, User, ChevronRight, ArrowLeft, CheckCircle2,
  Zap, Brain, Target, Clock, AlertTriangle, Phone,
  FileText, BarChart3, TrendingUp, Award, RotateCcw,
  MapPin, Users, FlaskConical, BookOpen, Star, Shield
} from 'lucide-react';

interface CancerSite {
  id: number;
  name: string;
  location: string;
  type: string;
  annualPatientVolume: number;
  specialtyFocus: string[];
  size: string;
  keyPrograms: string[];
}

interface Oncologist {
  id: number;
  name: string;
  specialty: string;
  institution: string;
  yearsExperience: number;
  annualPatientVolume: number;
  prescribingStyle: string;
  recentClinicalFocus: string;
  publications: number;
  trialInvolvement: string;
  trialCount: number;
  keyInterests: string[];
}

const cancerSites: CancerSite[] = [
  {
    id: 1,
    name: 'MD Anderson Cancer Center',
    location: 'Houston, TX',
    type: 'Academic Medical Center',
    annualPatientVolume: 150000,
    specialtyFocus: ['Lung Cancer', 'Breast Cancer', 'Leukemia', 'Melanoma'],
    size: 'Very Large',
    keyPrograms: ['Clinical Trials', 'Proton Therapy', 'CAR-T Therapy', 'Genetic Counseling', 'Precision Oncology'],
  },
  {
    id: 2,
    name: 'Memorial Sloan Kettering',
    location: 'New York, NY',
    type: 'Academic Medical Center',
    annualPatientVolume: 100000,
    specialtyFocus: ['Breast Cancer', 'GI Oncology', 'Lymphoma', 'Lung Cancer'],
    size: 'Very Large',
    keyPrograms: ['Immunotherapy Research', 'Liquid Biopsy Program', 'Clinical Trials', 'Precision Medicine'],
  },
  {
    id: 3,
    name: 'Mayo Clinic Cancer Center',
    location: 'Rochester, MN',
    type: 'Academic Medical Center',
    annualPatientVolume: 75000,
    specialtyFocus: ['Hematologic Malignancies', 'Lung Cancer', 'GI Cancers', 'Neuroendocrine Tumors'],
    size: 'Large',
    keyPrograms: ['Bone Marrow Transplant', 'Clinical Trials', 'Genomic Medicine', 'Multidisciplinary Care'],
  },
  {
    id: 4,
    name: 'Stanford Cancer Institute',
    location: 'Stanford, CA',
    type: 'Academic Medical Center',
    annualPatientVolume: 50000,
    specialtyFocus: ['Gynecologic Oncology', 'Lung Cancer', 'Blood Cancers', 'Brain Tumors'],
    size: 'Large',
    keyPrograms: ['CRISPR Research', 'CAR-T Therapy', 'Clinical Trials', 'Biomarker Research'],
  },
  {
    id: 5,
    name: 'Northwestern Memorial Cancer Center',
    location: 'Chicago, IL',
    type: 'Academic Medical Center',
    annualPatientVolume: 45000,
    specialtyFocus: ['Breast Cancer', 'Thoracic Oncology', 'GI Cancers', 'Head & Neck Cancers'],
    size: 'Large',
    keyPrograms: ['Clinical Trials', 'Multidisciplinary Tumor Boards', 'Survivorship Program', 'ADC Therapy Research'],
  },
  {
    id: 6,
    name: 'Cleveland Clinic Taussig Cancer Institute',
    location: 'Cleveland, OH',
    type: 'Academic Medical Center',
    annualPatientVolume: 40000,
    specialtyFocus: ['Hematology', 'Lung Cancer', 'GI Cancers', 'Urologic Cancers'],
    size: 'Large',
    keyPrograms: ['Stem Cell Transplant', 'Clinical Trials', 'Genomic Testing', 'BTK Inhibitor Research'],
  },
  {
    id: 7,
    name: 'Moffitt Cancer Center',
    location: 'Tampa, FL',
    type: 'Academic Medical Center',
    annualPatientVolume: 60000,
    specialtyFocus: ['Lung Cancer', 'Melanoma', 'Breast Cancer', 'Thoracic Oncology'],
    size: 'Large',
    keyPrograms: ['Immunotherapy Program', 'KRAS Research', 'Clinical Trials', 'Personalized Medicine'],
  },
  {
    id: 8,
    name: 'Dana-Farber Cancer Institute',
    location: 'Boston, MA',
    type: 'Academic Medical Center',
    annualPatientVolume: 55000,
    specialtyFocus: ['Breast Cancer', 'Hematologic Malignancies', 'Lung Cancer', 'Sarcoma'],
    size: 'Large',
    keyPrograms: ['PARP Inhibitor Research', 'Clinical Trials', 'Precision Medicine', 'BRCA Testing Program'],
  },
  {
    id: 9,
    name: 'City of Hope National Medical Center',
    location: 'Duarte, CA',
    type: 'Academic Medical Center',
    annualPatientVolume: 65000,
    specialtyFocus: ['Hematologic Cancers', 'GI Oncology', 'Breast Cancer', 'Diabetes & Cancer'],
    size: 'Large',
    keyPrograms: ['CAR-T Cell Therapy', 'Bone Marrow Transplant', 'Immunotherapy', 'Clinical Trials'],
  },
  {
    id: 10,
    name: 'Baptist Health South Florida Cancer Center',
    location: 'Miami, FL',
    type: 'Community Cancer Center',
    annualPatientVolume: 25000,
    specialtyFocus: ['Lung Cancer', 'Breast Cancer', 'Prostate Cancer', 'Colorectal Cancer'],
    size: 'Medium',
    keyPrograms: ['Radiation Oncology', 'Patient Navigation', 'Community Outreach', 'Genetic Counseling'],
  },
  {
    id: 11,
    name: 'OneOncology Network',
    location: 'Nashville, TN',
    type: 'Private Practice Network',
    annualPatientVolume: 35000,
    specialtyFocus: ['Hematology/Oncology', 'Breast Cancer', 'GI Cancers', 'Lung Cancer'],
    size: 'Large',
    keyPrograms: ['Value-Based Care', 'Biosimilar Programs', 'Patient Support Services', 'Clinical Trials'],
  },
  {
    id: 12,
    name: 'Sarah Cannon Cancer Institute',
    location: 'Nashville, TN',
    type: 'Community Cancer Center',
    annualPatientVolume: 30000,
    specialtyFocus: ['Thoracic Oncology', 'GI Cancers', 'Breast Cancer', 'Hematologic Malignancies'],
    size: 'Medium',
    keyPrograms: ['Phase I Trials', 'Oncology Pharmacy', 'Nurse Navigator Program', 'Digital Health'],
  },
];

const oncologists: Oncologist[] = [
  {
    id: 1,
    name: 'Dr. Sarah Martinez, MD PhD',
    specialty: 'Thoracic Oncology',
    institution: 'MD Anderson Cancer Center',
    yearsExperience: 20,
    annualPatientVolume: 400,
    prescribingStyle: 'early adopter of new therapies',
    recentClinicalFocus: 'HER2+ targeted therapies and osimertinib combinations',
    publications: 45,
    trialInvolvement: 'Principal Investigator',
    trialCount: 3,
    keyInterests: ['Precision Medicine', 'Biomarker Research', 'EGFR Resistance Mechanisms'],
  },
  {
    id: 2,
    name: 'Dr. James Chen, MD',
    specialty: 'Hematologic Oncology',
    institution: 'Memorial Sloan Kettering',
    yearsExperience: 15,
    annualPatientVolume: 350,
    prescribingStyle: 'conservative, prefers established guidelines',
    recentClinicalFocus: 'BTK inhibitor optimization in relapsed/refractory CLL',
    publications: 30,
    trialInvolvement: 'Sub-investigator',
    trialCount: 2,
    keyInterests: ['CLL Treatment Sequencing', 'Minimal Residual Disease', 'Quality of Life Outcomes'],
  },
  {
    id: 3,
    name: 'Dr. Emily Roberts, MD',
    specialty: 'Breast Oncology',
    institution: 'Dana-Farber Cancer Institute',
    yearsExperience: 12,
    annualPatientVolume: 500,
    prescribingStyle: 'patient-centered, shared decision making',
    recentClinicalFocus: 'PARP inhibitor use in BRCA+ metastatic breast cancer',
    publications: 25,
    trialInvolvement: 'Principal Investigator',
    trialCount: 2,
    keyInterests: ['BRCA Testing', 'HRD Testing', 'Patient Quality of Life', 'ADC Therapies'],
  },
  {
    id: 4,
    name: 'Dr. Michael Thompson, MD',
    specialty: 'Thoracic Oncology',
    institution: 'Mayo Clinic Cancer Center',
    yearsExperience: 18,
    annualPatientVolume: 380,
    prescribingStyle: 'cost-conscious, evidence-based',
    recentClinicalFocus: 'EGFR resistance mechanisms in stage IV NSCLC',
    publications: 55,
    trialInvolvement: 'Sub-investigator',
    trialCount: 5,
    keyInterests: ['Health Economics', 'Guideline Adherence', 'Resistance Mechanisms', 'Real-World Evidence'],
  },
  {
    id: 5,
    name: 'Dr. Lisa Patel, MD',
    specialty: 'Gynecologic Oncology',
    institution: 'Stanford Cancer Institute',
    yearsExperience: 10,
    annualPatientVolume: 280,
    prescribingStyle: 'innovative, data-driven',
    recentClinicalFocus: 'BRCA testing integration and PARP inhibitor selection strategies',
    publications: 18,
    trialInvolvement: 'Principal Investigator',
    trialCount: 1,
    keyInterests: ['Precision Medicine', 'Genomic Testing', 'Ovarian Cancer Maintenance', 'Biomarker Research'],
  },
  {
    id: 6,
    name: 'Dr. Robert Kim, MD',
    specialty: 'Hematologic Oncology',
    institution: 'Cleveland Clinic Taussig Cancer Institute',
    yearsExperience: 22,
    annualPatientVolume: 420,
    prescribingStyle: 'conservative, prefers established guidelines',
    recentClinicalFocus: 'CLL treatment sequencing and BTK inhibitor safety profiles',
    publications: 65,
    trialInvolvement: 'Principal Investigator',
    trialCount: 4,
    keyInterests: ['Treatment Sequencing', 'Cardiac Safety', 'Evidence-Based Medicine', 'Long-Term Outcomes'],
  },
  {
    id: 7,
    name: 'Dr. Jennifer Walsh, MD',
    specialty: 'Thoracic Oncology',
    institution: 'Moffitt Cancer Center',
    yearsExperience: 8,
    annualPatientVolume: 310,
    prescribingStyle: 'early adopter, innovative',
    recentClinicalFocus: 'KRAS G12C mutations and emerging targeted therapies in NSCLC',
    publications: 12,
    trialInvolvement: 'Sub-investigator',
    trialCount: 1,
    keyInterests: ['Novel Targets', 'Combination Strategies', 'Biomarker-Driven Therapy', 'Clinical Innovation'],
  },
  {
    id: 8,
    name: 'Dr. David Nguyen, MD',
    specialty: 'GI Oncology',
    institution: 'City of Hope National Medical Center',
    yearsExperience: 14,
    annualPatientVolume: 460,
    prescribingStyle: 'patient-centered, collaborative',
    recentClinicalFocus: 'Immunotherapy combinations in GI cancers and HER2+ gastric cancer',
    publications: 22,
    trialInvolvement: 'Referring Physician',
    trialCount: 3,
    keyInterests: ['Patient Support Programs', 'Multidisciplinary Care', 'Immunotherapy', 'Quality of Life'],
  },
  {
    id: 9,
    name: 'Dr. Rachel Cohen, MD',
    specialty: 'Breast Oncology',
    institution: 'Northwestern Memorial Cancer Center',
    yearsExperience: 16,
    annualPatientVolume: 520,
    prescribingStyle: 'cost-conscious, value-oriented',
    recentClinicalFocus: 'ADC therapy selection and sequencing in HER2+ metastatic breast cancer',
    publications: 38,
    trialInvolvement: 'Sub-investigator',
    trialCount: 3,
    keyInterests: ['Value-Based Care', 'Biosimilar Integration', 'Patient Access', 'ADC Mechanisms'],
  },
  {
    id: 10,
    name: 'Dr. Carlos Rivera, MD',
    specialty: 'Thoracic Oncology',
    institution: 'Baptist Health South Florida Cancer Center',
    yearsExperience: 9,
    annualPatientVolume: 220,
    prescribingStyle: 'innovative, early adopter',
    recentClinicalFocus: 'Osimertinib in early-stage resected EGFR-mutated NSCLC (ADAURA data)',
    publications: 8,
    trialInvolvement: 'Principal Investigator',
    trialCount: 1,
    keyInterests: ['Adjuvant Therapy', 'Early-Stage NSCLC', 'Patient Navigation', 'Community Oncology Innovation'],
  },
];

// --- INSIGHT GENERATION LOGIC ---
function generateOpportunityScore(doc: Oncologist, site: CancerSite): { score: number; rationale: string } {
  let score = 60;
  if (doc.annualPatientVolume > 400) score += 10;
  else if (doc.annualPatientVolume > 300) score += 7;
  else if (doc.annualPatientVolume > 200) score += 4;

  if (site.annualPatientVolume > 80000) score += 8;
  else if (site.annualPatientVolume > 40000) score += 5;
  else score += 2;

  if (doc.trialInvolvement === 'Principal Investigator') score += 7;
  else if (doc.trialInvolvement === 'Sub-investigator') score += 4;

  if (doc.prescribingStyle.includes('early adopter') || doc.prescribingStyle.includes('innovative')) score += 5;

  if (site.keyPrograms.some(p => p.toLowerCase().includes('clinical trial'))) score += 3;
  if (doc.recentClinicalFocus.toLowerCase().includes('egfr') || doc.recentClinicalFocus.toLowerCase().includes('her2') || doc.recentClinicalFocus.toLowerCase().includes('brca') || doc.recentClinicalFocus.toLowerCase().includes('btk')) score += 4;

  score = Math.min(98, Math.max(72, score));

  const rationale = `${doc.name} sees approximately ${doc.annualPatientVolume.toLocaleString()} patients annually at ${site.name} (${site.annualPatientVolume.toLocaleString()} total annual patients). ${doc.trialInvolvement === 'Principal Investigator' ? `As a PI on ${doc.trialCount} active trial${doc.trialCount > 1 ? 's' : ''}, they represent a high-influence node in the oncology network.` : `Their involvement in ${doc.trialCount} clinical trial${doc.trialCount > 1 ? 's' : ''} indicates research openness.`} Current focus on "${doc.recentClinicalFocus}" aligns with key institutional programs at ${site.name}, including ${site.keyPrograms.slice(0, 2).join(' and ')}.`;

  return { score, rationale };
}

function generateEngagementStrategy(doc: Oncologist, site: CancerSite) {
  const style = doc.prescribingStyle.toLowerCase();

  let primaryApproach: string;
  if (style.includes('early adopter') || style.includes('innovative')) {
    primaryApproach = `Lead with breakthrough mechanism data and novel clinical evidence. ${doc.name} is an early adopter who responds to differentiated science. Present cutting-edge trial data with a forward-looking perspective on emerging applications in ${doc.specialty}.`;
  } else if (style.includes('conservative') || style.includes('evidence-based')) {
    primaryApproach = `Emphasize robust safety profile, guideline alignment, and long-term outcome data. ${doc.name} requires comprehensive evidence before changing practice. Focus on Phase 3 data, real-world evidence, and established clinical guidelines relevant to ${doc.specialty}.`;
  } else if (style.includes('cost-conscious') || style.includes('value')) {
    primaryApproach = `Lead with health economics, total cost of care, and outcomes-based value. ${doc.name} will want to understand payer landscape, reimbursement predictability, and cost-effectiveness vs. alternatives in ${doc.specialty}.`;
  } else {
    primaryApproach = `Focus on patient outcomes, quality of life data, and shared decision-making tools. ${doc.name} prioritizes the patient experience. Bring patient-reported outcome data and support resources that align with the high-volume practice at ${site.name}.`;
  }

  const keyMessages: string[] = [
    `Connect directly to ${doc.name}'s active research in "${doc.recentClinicalFocus}" with relevant trial data from a similar patient population.`,
    `Reference ${site.name}'s ${site.keyPrograms[0]} program as a natural fit for deeper integration and collaborative data generation.`,
    site.type === 'Academic Medical Center'
      ? `Emphasize research collaboration opportunities and potential investigator-initiated study support given ${site.name}'s academic research infrastructure.`
      : site.type === 'Community Cancer Center'
      ? `Highlight ease of implementation, patient access programs, and community-specific support resources tailored to ${site.name}'s patient population.`
      : `Discuss value-based contracting options, GPO alignment, and practice efficiency tools suited to a network like ${site.name}.`,
  ];

  let optimalTiming: string;
  if (doc.trialInvolvement === 'Principal Investigator') {
    optimalTiming = `Approach during trial enrollment periods (typically Q1 and Q3) when ${doc.name} is actively discussing new therapies with patients. Pre-enrollment preparation cycles are ideal for formulary and data discussions.`;
  } else {
    optimalTiming = `Schedule around tumor board preparation cycles (typically Tuesday–Thursday) and avoid peak clinic hours. ${doc.name}'s ${doc.annualPatientVolume}-patient annual volume suggests ${Math.round(doc.annualPatientVolume / 52 / 5)}-${Math.round(doc.annualPatientVolume / 52 / 4)} patients per day — morning appointments before 8 AM or lunch slots work best.`;
  }

  let competitivePositioning: string;
  if (style.includes('cost-conscious') || style.includes('value')) {
    competitivePositioning = `For a cost-conscious physician like ${doc.name}, lead with total cost of care modeling, outcomes-per-dollar comparisons, and real-world evidence on hospitalization reduction and quality-adjusted life years (QALYs). Payer coverage predictability is a key differentiator.`;
  } else if (style.includes('early adopter') || style.includes('innovative')) {
    competitivePositioning = `Differentiate on mechanism novelty, trial design rigor, and first-in-class or best-in-class positioning vs. standard of care. ${doc.name} as an innovator wants to be an early adopter — position your product as the clinical frontier in ${doc.specialty}.`;
  } else {
    competitivePositioning = `Emphasize ease of use, patient preference data, and dosing flexibility. For ${doc.name}'s patient-centered practice, demonstrate how your product fits seamlessly into existing treatment pathways at ${site.name}.`;
  }

  return { primaryApproach, keyMessages, optimalTiming, competitivePositioning };
}

function generatePredictiveInsights(doc: Oncologist, site: CancerSite) {
  const style = doc.prescribingStyle.toLowerCase();
  const estRxPotential = Math.round(doc.annualPatientVolume * 0.25);

  let timeToFirstRx: string;
  if (style.includes('early adopter') || style.includes('innovative')) {
    timeToFirstRx = '2–3 months with consistent, science-driven engagement';
  } else {
    timeToFirstRx = '4–6 months with systematic evidence building and peer validation';
  }

  const likelyObjections: string[] = [
    style.includes('cost-conscious') || style.includes('value')
      ? `Reimbursement and formulary concerns: "What's the prior authorization burden? What's the payer coverage rate at ${site.name}?"`
      : `Long-term safety questions: "What does the 3-year safety follow-up data look like? How does it compare to standard of care?"`,
    `Competitor comparison: "How does this compare head-to-head to [leading ${doc.specialty} competitor] in terms of outcomes for my patient population?"`,
    site.type === 'Academic Medical Center'
      ? `Research collaboration interest: "Are there investigator-initiated study opportunities? Can we access biomarker samples from the trial?"` :
      `Practice support resources: "What kind of patient access support and reimbursement assistance do you provide to practices like ours?"`,
  ];

  const nextBestActions: string[] = [
    `Send a personalized email referencing ${doc.name}'s research on "${doc.recentClinicalFocus}" with a 1-2 page clinical evidence summary directly addressing their focus area.`,
    `Connect with ${site.name} pharmacy team to understand formulary status and initiate P&T committee review process for Q2 consideration.`,
    `Identify 2–3 peer advocates at comparable ${site.type} institutions who have presented their clinical experience to peer groups similar to ${doc.name}.`,
    `Prepare ${doc.specialty}-specific case examples showing patient journeys most similar to ${doc.name}'s practice patient mix at ${site.name}.`,
  ];

  return { estRxPotential, timeToFirstRx, likelyObjections, nextBestActions };
}

function generateCallPlan(doc: Oncologist, _site: CancerSite) {
  return [
    {
      visit: 1,
      title: 'Initial Engagement Meeting',
      objective: `Establish scientific credibility aligned with ${doc.name}'s expertise in ${doc.specialty}`,
      activities: [
        `Review and reference ${doc.name}'s recent publications on "${doc.recentClinicalFocus}"`,
        'Share pivotal clinical trial data with focus on endpoints relevant to specialty practice',
        'Listen: understand current treatment gaps and patient population challenges at this institution',
      ],
      materials: ['Clinical trial monograph', 'Key trial summary card', 'Formulary status overview'],
    },
    {
      visit: 2,
      title: 'Value Proposition Presentation',
      objective: `Present targeted clinical value proposition specific to ${doc.specialty} patient population`,
      activities: [
        `Present ${doc.specialty}-specific efficacy and safety data from your trial`,
        'Discuss 2–3 hypothetical patient case studies matching common clinical scenarios',
        doc.trialInvolvement !== 'Referring Physician' ? 'Explore investigator interest and trial collaboration opportunities' : 'Review patient support and access programs available at this institution',
      ],
      materials: ['Specialty case studies', 'Dosing and administration guide', 'Trial information packet'],
    },
    {
      visit: 3,
      title: 'Commitment and Support Activation',
      objective: 'Secure commitment to clinical trial or formulary inclusion / first prescription',
      activities: [
        'Review real-world outcome data and post-approval safety surveillance results',
        `Address remaining objections — likely focused on ${doc.prescribingStyle.includes('cost') ? 'reimbursement and total cost of care' : doc.prescribingStyle.includes('conservative') ? 'long-term safety and guideline integration' : 'patient support and access resources'}`,
        'Establish formal support plan: reimbursement specialist contact, MSL relationship, patient access program enrollment',
      ],
      materials: ['Real-world outcomes data', 'Patient support program guide', 'Quick reference card and dosing guide'],
    },
  ];
}

export default function App4CustomerInsight() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'select' | 'generating' | 'insights'>('select');
  const [selectedSite, setSelectedSite] = useState<CancerSite | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Oncologist | null>(null);
  const [activeTab, setActiveTab] = useState<'opportunity' | 'strategy' | 'predictive' | 'callplan'>('opportunity');
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    'Scanning EMR and claims data patterns...',
    'Analyzing publication history and research focus...',
    'Identifying optimal engagement strategies...',
    'Generating personalized call plan...',
    'Finalizing AI-powered insight report...',
  ];

  const canGenerate = !!selectedSite && !!selectedDoc;

  useEffect(() => {
    if (phase !== 'generating') return;
    if (processingStep < processingSteps.length) {
      const timer = setTimeout(() => setProcessingStep(s => s + 1), 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('insights'), 300);
      return () => clearTimeout(timer);
    }
  }, [phase, processingStep]);

  const handleGenerate = () => {
    setProcessingStep(0);
    setPhase('generating');
  };

  const handleReset = () => {
    setPhase('select');
    setSelectedSite(null);
    setSelectedDoc(null);
    setActiveTab('opportunity');
    setProcessingStep(0);
  };

  // ---- SELECTION PHASE ----
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 p-3 sm:p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <div className="text-center">
              <h1 className="text-white font-bold text-xl sm:text-2xl">AI Customer Insight Generator</h1>
              <p className="text-amber-400 text-sm">Select a cancer site and oncologist to generate your report</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedSite ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className="text-slate-400 text-xs">Site</span>
              <div className={`w-3 h-3 rounded-full ${selectedDoc ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className="text-slate-400 text-xs">Oncologist</span>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-3 mb-5 flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${selectedSite ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/50'}`}>
              {selectedSite ? <CheckCircle2 className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              {selectedSite ? selectedSite.name : 'Select Cancer Site'}
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${selectedDoc ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/50'}`}>
              {selectedDoc ? <CheckCircle2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {selectedDoc ? selectedDoc.name : 'Select Oncologist'}
            </div>
            <div className="flex-1" />
            {canGenerate && (
              <button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-lg text-sm"
              >
                <Zap className="w-4 h-4" /> Generate Insights
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Cancer Sites */}
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> Cancer Treatment Sites
              </h2>
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {cancerSites.map(site => (
                  <div
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className={`rounded-xl border-2 cursor-pointer transition-all p-3 sm:p-4
                      ${selectedSite?.id === site.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-white/10'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-sm truncate">{site.name}</h3>
                          {selectedSite?.id === site.id && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="flex items-center gap-1 text-slate-400 text-xs"><MapPin className="w-3 h-3" />{site.location}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-amber-400/80 text-xs">{site.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {site.specialtyFocus.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-white/10 text-white/60 text-xs px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-bold text-sm">{(site.annualPatientVolume / 1000).toFixed(0)}K</div>
                        <div className="text-slate-400 text-xs">pts/yr</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oncologists */}
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" /> Oncologists
              </h2>
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {oncologists.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`rounded-xl border-2 cursor-pointer transition-all p-3 sm:p-4
                      ${selectedDoc?.id === doc.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-white/10'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-sm">{doc.name}</h3>
                          {selectedDoc?.id === doc.id && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        </div>
                        <p className="text-amber-400/80 text-xs mb-1">{doc.specialty} • {doc.yearsExperience} yrs</p>
                        <p className="text-slate-400 text-xs mb-2 truncate">{doc.institution}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-white/10 text-white/60 text-xs px-1.5 py-0.5 rounded">{doc.prescribingStyle.split(',')[0]}</span>
                          <span className="bg-white/10 text-white/60 text-xs px-1.5 py-0.5 rounded">{doc.trialInvolvement}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-bold text-sm">{doc.annualPatientVolume}</div>
                        <div className="text-slate-400 text-xs">pts/yr</div>
                        <div className="text-slate-400 text-xs">{doc.publications} pubs</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- GENERATING PHASE ----
  if (phase === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Generating AI Insights</h2>
          <p className="text-slate-400 text-sm mb-6">Analyzing data for {selectedDoc?.name} at {selectedSite?.name}...</p>

          <div className="space-y-3 mb-6 text-left">
            {processingSteps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all ${i < processingStep ? 'opacity-100' : 'opacity-30'}`}>
                {i < processingStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 border-amber-400/50 flex-shrink-0 ${i === processingStep ? 'animate-pulse border-amber-400' : ''}`} />
                )}
                <span className={`text-sm ${i < processingStep ? 'text-emerald-400' : i === processingStep ? 'text-amber-300 animate-pulse' : 'text-slate-500'}`}>{step}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(processingStep / processingSteps.length) * 100}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs">{Math.round((processingStep / processingSteps.length) * 100)}% complete</p>
        </div>
      </div>
    );
  }

  // ---- INSIGHTS PHASE ----
  if (!selectedSite || !selectedDoc) return null;

  const opp = generateOpportunityScore(selectedDoc, selectedSite);
  const strategy = generateEngagementStrategy(selectedDoc, selectedSite);
  const predictive = generatePredictiveInsights(selectedDoc, selectedSite);
  const callPlan = generateCallPlan(selectedDoc, selectedSite);

  const tabs = [
    { id: 'opportunity', label: 'Opportunity', icon: BarChart3 },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'predictive', label: 'Predictive', icon: TrendingUp },
    { id: 'callplan', label: 'Call Plan', icon: Phone },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-4 mb-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-amber-400 font-semibold text-sm">AI Insight Report Generated</span>
              </div>
              <h2 className="text-white font-bold text-base sm:text-lg">{selectedDoc.name}</h2>
              <p className="text-slate-400 text-sm">{selectedSite.name} • {selectedSite.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-center px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                <div className="text-amber-400 font-bold text-2xl">{opp.score}</div>
                <div className="text-slate-400 text-xs">Opp. Score</div>
              </div>
              <button onClick={handleReset} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-lg transition-all">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-4 overflow-x-auto">
          {tabs.map(tab => {
            const TIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center
                  ${activeTab === tab.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <TIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-5 sm:p-6">

          {activeTab === 'opportunity' && (
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" /> Opportunity Score
              </h3>
              <div className="flex items-center gap-5 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#fde68a" strokeWidth="8" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#f59e0b" strokeWidth="8"
                      strokeDasharray={`${(opp.score / 100) * 251.2} 251.2`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-amber-600">{opp.score}</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{opp.rationale}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Patient Volume', value: `${selectedDoc.annualPatientVolume}/yr`, icon: Users },
                  { label: 'Experience', value: `${selectedDoc.yearsExperience} yrs`, icon: Award },
                  { label: 'Publications', value: selectedDoc.publications, icon: BookOpen },
                  { label: 'Trial Role', value: selectedDoc.trialInvolvement.split(' ')[0], icon: FlaskConical },
                ].map((stat, i) => {
                  const SIcon = stat.icon;
                  return (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <SIcon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <div className="font-bold text-slate-900 text-base">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" /> Engagement Strategy
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-1.5"><Star className="w-4 h-4" /> Primary Approach</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{strategy.primaryApproach}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">Key Messages (3)</h4>
                <div className="space-y-2">
                  {strategy.keyMessages.map((msg, i) => (
                    <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{msg}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <h4 className="font-bold text-teal-800 text-sm mb-2 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Optimal Timing</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{strategy.optimalTiming}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-bold text-purple-800 text-sm mb-2 flex items-center gap-1.5"><Shield className="w-4 h-4" /> Competitive Positioning</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{strategy.competitivePositioning}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictive' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" /> Predictive Insights
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">~{predictive.estRxPotential}</div>
                  <div className="text-sm text-emerald-600 font-medium">Est. Annual Rx Potential</div>
                  <div className="text-xs text-slate-500 mt-1">25% of {selectedDoc.annualPatientVolume} annual patients</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-emerald-700 font-bold text-base mb-1">{predictive.timeToFirstRx.split(' ')[0] + ' ' + predictive.timeToFirstRx.split(' ')[1]}</div>
                  <div className="text-sm text-blue-600 font-medium">Time to First Rx</div>
                  <div className="text-xs text-slate-500 mt-1">{predictive.timeToFirstRx.split('with')[1]?.trim() || 'with consistent engagement'}</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-600" /> Likely Objections</h4>
                <div className="space-y-2">
                  {predictive.likelyObjections.map((obj, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                      <span className="text-amber-600 font-bold text-xs flex-shrink-0 mt-0.5">#{i + 1}</span>
                      <p className="text-slate-700 text-sm">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-600" /> Next Best Actions</h4>
                <div className="space-y-2">
                  {predictive.nextBestActions.map((action, i) => (
                    <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 text-sm leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'callplan' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-600" /> AI-Generated 3-Visit Call Plan
              </h3>
              {callPlan.map((visit, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className={`px-4 py-3 flex items-center gap-3 ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-teal-600' : 'bg-emerald-600'}`}>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{visit.visit}</div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{visit.title}</h4>
                      <p className="text-white/80 text-xs">{visit.objective}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h5 className="text-slate-600 text-xs font-semibold uppercase tracking-wide mb-2">Activities</h5>
                      <ul className="space-y-1.5">
                        {visit.activities.map((a, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-slate-600 text-xs font-semibold uppercase tracking-wide mb-2">Materials</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {visit.materials.map((m, j) => (
                          <span key={j} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleReset} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
            <RotateCcw className="w-4 h-4" /> New Analysis
          </button>
          <button onClick={() => navigate('/')} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
