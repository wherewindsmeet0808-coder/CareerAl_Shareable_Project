import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { CareerAssessmentPage } from './pages/CareerAssessmentPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { AIChatbotPage } from './pages/AIChatbotPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { JobSearchPage } from './pages/JobSearchPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Sync initial page based on auth status
  useEffect(() => {
    if (!loading) {
      if (user && currentPage === 'landing') {
        setCurrentPage('dashboard');
      }
    }
  }, [loading, user]);

  const handleNavigate = (page: string) => {
    // If not authenticated and trying to access private page, redirect to login
    const publicPages = ['landing', 'login', 'signup', 'forgot-password', 'reset-password', 'jobs'];
    if (!user && !publicPages.includes(page)) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <StudentDashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileSettingsPage onNavigate={handleNavigate} />;
      case 'assessment':
        return <CareerAssessmentPage onNavigate={handleNavigate} />;
      case 'skill-gap':
        return <SkillGapPage />;
      case 'roadmap':
        return <LearningRoadmapPage />;
      case 'resume':
        return <ResumeAnalyzerPage />;
      case 'chatbot':
        return <AIChatbotPage />;
      case 'interview':
        return <MockInterviewPage />;
      case 'jobs':
        return <JobSearchPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
