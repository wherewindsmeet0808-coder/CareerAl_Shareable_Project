import React, { useState } from 'react';
import {
  Compass,
  LayoutDashboard,
  FileText,
  Target,
  Map,
  Bot,
  Video,
  Briefcase,
  ShieldAlert,
  User,
  LogOut,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard, authRequired: true },
    { id: 'assessment', label: t.nav.assessment, icon: Compass, authRequired: true },
    { id: 'skill-gap', label: t.nav.skillGap, icon: Target, authRequired: true },
    { id: 'roadmap', label: t.nav.roadmap, icon: Map, authRequired: true },
    { id: 'resume', label: t.nav.resume, icon: FileText, authRequired: true },
    { id: 'chatbot', label: t.nav.chatbot, icon: Bot, authRequired: true },
    { id: 'interview', label: t.nav.interview, icon: Video, authRequired: true },
    { id: 'jobs', label: t.nav.jobs, icon: Briefcase, authRequired: false },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ id: 'admin', label: t.nav.admin, icon: ShieldAlert, authRequired: true });
  }

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/90 backdrop-blur-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-brand-200 bg-clip-text text-transparent">
                CareerAI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                2026 Edition
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Language Switcher & User Profile */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative flex items-center bg-navy-800 border border-navy-700 rounded-lg p-0.5">
              <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'ta'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Auth Buttons or User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 hover:border-slate-600 text-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-navy-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{t.nav.profile}</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        handleNavClick('landing');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-navy-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
                >
                  {t.nav.signup}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-navy-800 bg-navy-900 px-4 pt-2 pb-6 space-y-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between py-2 border-b border-navy-800 mb-2">
            <span className="text-xs text-slate-400">Language / மொழி:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  language === 'en' ? 'bg-brand-600 text-white' : 'bg-navy-800 text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  language === 'ta' ? 'bg-brand-600 text-white' : 'bg-navy-800 text-slate-400'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          {navLinks.map((link) => {
            if (link.authRequired && !user) return null;
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </button>
            );
          })}

          {user ? (
            <div className="pt-4 border-t border-navy-800 space-y-2">
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800"
              >
                <User className="w-5 h-5" />
                <span>{t.nav.profile}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  handleNavClick('landing');
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-5 h-5" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-navy-800 flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-200 bg-navy-800 rounded-lg"
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full py-2.5 text-center text-sm font-medium bg-brand-600 text-white rounded-lg shadow-lg"
              >
                {t.nav.signup}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
