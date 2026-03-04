import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, Calendar as CalendarIcon, Bot, Users, User, Database } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { CalendarPage } from './pages/CalendarPage';
import { AIPrepPage } from './pages/AIPrepPage';
import { CommunityPage } from './pages/CommunityPage';
import { MyPage } from './pages/MyPage';
import { AdminPage } from './pages/AdminPage';

type Tab = 'home' | 'practice' | 'calendar' | 'ai_prep' | 'community' | 'mypage' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'practice', label: '問題演習', icon: BookOpen },
    { id: 'calendar', label: 'カレンダー', icon: CalendarIcon },
    { id: 'ai_prep', label: 'AI対策', icon: Bot },
    { id: 'community', label: 'コミュニティ', icon: Users },
    { id: 'mypage', label: 'マイページ', icon: User },
    { id: 'admin', label: '管理(DB)', icon: Database },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'practice': return <PracticePage />;
      case 'calendar': return <CalendarPage />;
      case 'ai_prep': return <AIPrepPage />;
      case 'community': return <CommunityPage />;
      case 'mypage': return <MyPage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCFB] dark:bg-slate-950 text-slate-800 dark:text-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400 leading-tight font-serif italic">
            学士編入対策<br/><span className="text-xs text-slate-400 dark:text-slate-500 font-sans not-italic font-normal tracking-wide uppercase">Companion App</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-semibold shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-teal-600'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 rounded-3xl flex justify-between items-center px-4 shadow-2xl shadow-teal-900/10 z-50">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center relative transition-all duration-300 ${
                isActive ? 'text-teal-600 dark:text-teal-400 scale-110' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-teal-600 dark:bg-teal-400 rounded-full"
                />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('mypage')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeTab === 'mypage' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          <User size={20} />
        </button>
      </nav>
    </div>
  );
}
