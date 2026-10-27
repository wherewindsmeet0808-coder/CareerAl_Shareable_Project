import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">CareerAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-Stack AI Career Guidance Platform for college students, freshers, and job seekers. Empowering careers with transparent algorithms and verified roadmaps.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-brand-400 transition-colors">Personalized Career Assessment</span></li>
              <li><span className="hover:text-brand-400 transition-colors">Skill Gap Visual Analysis</span></li>
              <li><span className="hover:text-brand-400 transition-colors">6-Phase Learning Roadmaps</span></li>
              <li><span className="hover:text-brand-400 transition-colors">AI Resume ATS Optimization</span></li>
            </ul>
          </div>

          {/* Preparation & Search */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Practice & Jobs</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-brand-400 transition-colors">Interactive Mock Interviews</span></li>
              <li><span className="hover:text-brand-400 transition-colors">Bilingual AI Career Coach (EN / தமிழ்)</span></li>
              <li><span className="hover:text-brand-400 transition-colors">Live Remote Job Listings</span></li>
              <li><span className="hover:text-brand-400 transition-colors">Application Tracker & Status</span></li>
            </ul>
          </div>

          {/* Security & Ethical AI */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Integrity & Security</h4>
            <div className="flex items-start space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                Row Level Security (RLS) protected data. Private resume text extraction without storage leaks. Honest AI status transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="border-t border-navy-800/80 pt-6 text-[11px] text-slate-500 text-center leading-normal">
          <p>
            Disclaimer: Career match scores, estimated learning durations, and ATS resume evaluations are algorithmic decision-support estimates designed to guide student preparation. They do not represent employment guarantees or binding hiring outcomes.
          </p>
          <p className="mt-2 flex items-center justify-center space-x-1">
            <span>© 2026 AI Career Guidance Platform. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for students and job seekers worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
