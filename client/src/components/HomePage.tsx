import { useNavigate } from 'react-router-dom';
import { Brain, Trophy, Gamepad2, Lightbulb, FileEdit, ArrowRight } from 'lucide-react';

const apps = [
  {
    id: 1,
    path: '/app1',
    title: 'Skeptical Oncologist',
    subtitle: 'AI Sales Simulator',
    description: 'Navigate a complex sales scenario with an evidence-driven oncologist. Use AI-powered research and personalization to craft the perfect approach.',
    icon: Brain,
    gradient: 'from-blue-600 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    tag: 'Sales Training',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    path: '/app2',
    title: 'AI Oncology Trivia',
    subtitle: 'Challenge',
    description: 'Test your knowledge of AstraZeneca oncology products. 10 timed questions, bonus points for speed, and a live global leaderboard.',
    icon: Trophy,
    gradient: 'from-purple-600 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    tag: 'Trivia Game',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 3,
    path: '/app3',
    title: 'AI Sales Strategy',
    subtitle: 'Oncology Game',
    description: 'Face 5 real-world oncology sales scenarios. Make strategic decisions and discover how AI-powered approaches outperform traditional tactics.',
    icon: Gamepad2,
    gradient: 'from-teal-600 to-emerald-500',
    bgGradient: 'from-teal-50 to-emerald-50',
    borderColor: 'border-teal-200',
    tag: 'Strategy Game',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    id: 4,
    path: '/app4',
    title: 'AI Customer Insight',
    subtitle: 'Generator',
    description: 'Select a cancer treatment site and oncologist to generate a comprehensive, AI-driven strategic engagement report with personalized call plans.',
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    tag: 'Insights Tool',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 5,
    path: '/app5',
    title: 'AI Content Creator',
    subtitle: 'Station',
    description: 'Transform raw call notes into compliant CRM records. Detect PhRMA/FDA violations, generate follow-up actions, and save time with AI assistance.',
    icon: FileEdit,
    gradient: 'from-rose-500 to-red-500',
    bgGradient: 'from-rose-50 to-red-50',
    borderColor: 'border-rose-200',
    tag: 'Content Tool',
    tagColor: 'bg-rose-100 text-rose-700',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header — light blue-purple gradient so the AZ logo is fully visible */}
      <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 border-b border-indigo-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/az-logo.png" alt="AstraZeneca" className="h-36 sm:h-44 lg:h-52 w-auto" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-slate-900">AI Applications </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Suite</span>
          </h1>
        </div>
      </div>

      {/* Apps Grid — dark section below */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-10 sm:pt-12 pb-16">
          {/* Single 6-col grid: all 5 cards span 2 cols each; card 4 uses col-start-2 to center bottom row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6">
            {apps.map((app, index) => {
              const Icon = app.icon;
              // Card 4 (index 3) starts at column 2 so the two bottom cards are centered
              const colClass = index === 3 ? 'lg:col-start-2 lg:col-span-2' : 'lg:col-span-2';
              return (
                <div
                  key={app.id}
                  onClick={() => navigate(app.path)}
                  className={`${colClass} group relative bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl border ${app.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative p-5 sm:p-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${app.tagColor} mb-3`}>
                      {app.tag}
                    </span>
                    <h2 className="text-slate-900 font-bold text-lg sm:text-xl leading-tight mb-1">
                      {app.title}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mb-3">{app.subtitle}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {app.description}
                    </p>
                    <div className={`flex items-center gap-2 bg-gradient-to-r ${app.gradient} text-white px-4 py-2.5 rounded-lg font-semibold text-sm group-hover:shadow-md transition-all duration-300`}>
                      <span>Launch App</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-slate-500 text-xs sm:text-sm">
              AstraZeneca AI Applications Suite &bull; Oncology Sales Excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
