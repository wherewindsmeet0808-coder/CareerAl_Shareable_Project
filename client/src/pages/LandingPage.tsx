import React from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Target,
  Map,
  FileText,
  Video,
  Briefcase,
  Bot,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleCTA = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      onNavigate('signup');
    }
  };

  const features = [
    {
      icon: Compass,
      title: 'Personalized Career Assessment',
      desc: 'Algorithmically evaluates your technical skills, degree, and interests across 10+ core engineering domains to generate transparent match scores.',
      page: 'assessment'
    },
    {
      icon: Target,
      title: 'Skill Gap Visual Analysis',
      desc: 'Compares your current abilities with employer requirements. Identifies missing high-priority technical skills and provides estimated learning durations.',
      page: 'skill-gap'
    },
    {
      icon: Map,
      title: '6-Phase Structured Roadmaps',
      desc: 'From computer science fundamentals to capstone projects, portfolio building, and job applications with credible links (freeCodeCamp, MDN, CS50).',
      page: 'roadmap'
    },
    {
      icon: FileText,
      title: 'AI Resume & ATS Analyzer',
      desc: 'Upload PDF/DOCX resumes for automated keyword auditing, ATS scoring, and bullet-point rewrites using the Google XYZ impact format.',
      page: 'resume'
    },
    {
      icon: Video,
      title: 'Mock Interview Practice',
      desc: 'Practice technical, HR, and behavioral questions with optional browser voice speech-to-text. Receive immediate AI scoring and STAR model answers.',
      page: 'interview'
    },
    {
      icon: Briefcase,
      title: 'Real-World Jobs & Application Tracker',
      desc: 'Search live remote tech vacancies and verified entry-level openings. Track application stages from bookmarked to offered.',
      page: 'jobs'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none animate-glow"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-brand-500/30 text-xs sm:text-sm font-semibold text-brand-300 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>{t.landing.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
            {t.landing.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.landing.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-brand-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <span>{t.landing.getStarted}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy-800/90 hover:bg-navy-700 text-slate-200 border border-navy-700 font-semibold text-base transition-colors"
            >
              {t.landing.exploreCareers}
            </button>
          </div>

          {/* Social Proof */}
          <p className="mt-12 text-xs text-slate-400 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-brand-400 inline" />
            <span>{t.landing.trustedBy}</span>
          </p>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-xl border border-navy-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-400">10+</span>
              <p className="text-xs text-slate-400 mt-1">Curated Tech Roles</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-navy-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-violet-400">100%</span>
              <p className="text-xs text-slate-400 mt-1">Transparent Score Breakdown</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-navy-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Bilingual</span>
              <p className="text-xs text-slate-400 mt-1">English & தமிழ் Support</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-navy-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">Live</span>
              <p className="text-xs text-slate-400 mt-1">Verified Job Search</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-navy-900/60 border-t border-navy-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.landing.featuresTitle}
            </h2>
            <p className="mt-4 text-base text-slate-400">
              {t.landing.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(user ? feature.page : 'login')}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-navy-800 glass-card-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.landing.howItWorksTitle}
            </h2>
            <p className="mt-4 text-base text-slate-400">
              {t.landing.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-navy-800 relative">
              <div className="text-3xl font-black text-brand-500/40 mb-2">01</div>
              <h4 className="text-base font-bold text-white mb-2">{t.landing.step1Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.landing.step1Desc}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-navy-800 relative">
              <div className="text-3xl font-black text-brand-500/40 mb-2">02</div>
              <h4 className="text-base font-bold text-white mb-2">{t.landing.step2Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.landing.step2Desc}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-navy-800 relative">
              <div className="text-3xl font-black text-brand-500/40 mb-2">03</div>
              <h4 className="text-base font-bold text-white mb-2">{t.landing.step3Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.landing.step3Desc}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-navy-800 relative">
              <div className="text-3xl font-black text-brand-500/40 mb-2">04</div>
              <h4 className="text-base font-bold text-white mb-2">{t.landing.step4Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.landing.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Students & Freshers */}
      <section className="py-20 bg-navy-900/40 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.landing.benefitsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-navy-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t.landing.benefit1Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.landing.benefit1Desc}</p>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-navy-800">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t.landing.benefit2Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.landing.benefit2Desc}</p>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-navy-800">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t.landing.benefit3Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.landing.benefit3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-900/80 via-navy-900/90 to-violet-950/80 border border-brand-500/30 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.landing.ctaTitle}
            </h2>
            <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto">
              {t.landing.ctaSubtitle}
            </p>
            <div className="mt-8">
              <button
                onClick={handleCTA}
                className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 transition-all hover:scale-105"
              >
                {t.landing.ctaButton}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
