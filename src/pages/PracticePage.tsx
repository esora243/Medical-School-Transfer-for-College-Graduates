import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, BookOpen, PlayCircle, Clock, CheckCircle, ChevronDown, RefreshCw, Zap, X, ChevronRight } from 'lucide-react';

export function PracticePage() {
  const [activeTab, setActiveTab] = useState<'university' | 'field'>('university');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState<'question' | 'answer'>('question');

  const mockQuiz = {
    question: 'DNAの二重らせん構造において、アデニン(A)と相補的に結合する塩基はどれか？',
    answer: 'チミン(T)',
    explanation: 'DNAではA-T、G-Cが水素結合によって相補的に結合します。'
  };

  const universities = [
    { name: '大阪大学 医学部（学士編入）', years: ['2024', '2023', '2022'], progress: 30 },
    { name: '名古屋大学 医学部（学士編入）', years: ['2024', '2023'], progress: 15 },
    { name: '北海道大学 医学部（学士編入）', years: ['2023', '2022', '2021'], progress: 45 },
  ];

  const fields = [
    { name: '生命科学（分子生物学・生化学）', count: 250, mastery: 40 },
    { name: '生命科学（生理学・解剖学）', count: 180, mastery: 25 },
    { name: '医学英語', count: 120, mastery: 60 },
    { name: '物理・化学（医学部レベル）', count: 90, mastery: 15 },
    { name: '小論文（医療倫理・時事）', count: 50, mastery: 10 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif italic">演習・データベース</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">大学別・分野別の過去問演習と、忘却曲線に基づいた復習が可能です。</p>
      </header>

      {/* Quick Quiz - Mobile Optimized */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-5xl p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <Zap size={20} className="fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">1分クイズ（スキマ時間用）</span>
          </div>
          <h3 className="text-xl font-bold mb-6 font-serif italic">今日の基礎知識チェック</h3>
          <button 
            onClick={() => { setShowQuiz(true); setQuizStep('question'); }}
            className="bg-white text-teal-700 px-8 py-3 rounded-2xl font-bold text-sm hover:bg-teal-50 transition-all shadow-lg active:scale-95"
          >
            クイズを開始
          </button>
        </div>
        <Zap size={150} className="absolute -bottom-10 -right-10 text-white/10" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-teal-600 hover:bg-teal-700 transition-all rounded-4xl p-8 text-white shadow-lg shadow-teal-900/10 cursor-pointer flex items-center justify-between group">
          <div>
            <h3 className="text-xl font-bold mb-1 flex items-center font-serif italic">
              <RefreshCw size={22} className="mr-3" />
              忘却曲線 復習モード
            </h3>
            <p className="text-teal-100 text-sm">今日復習すべき問題が 12問 あります</p>
          </div>
          <PlayCircle size={48} className="text-teal-300 group-hover:text-white transition-all duration-300" />
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-4xl p-8 shadow-sm cursor-pointer hover:border-teal-500 transition-all flex items-center justify-between group">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center font-serif italic">
              <BookOpen size={22} className="mr-3 text-teal-500" />
              ランダム演習
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">全分野からランダムに10問出題します</p>
          </div>
          <PlayCircle size={48} className="text-slate-200 dark:text-slate-700 group-hover:text-teal-500 transition-all duration-300" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('university')}
            className={`flex-1 py-5 text-sm font-bold text-center transition-all ${
              activeTab === 'university' 
                ? 'text-teal-600 dark:text-teal-400 border-b-4 border-teal-600 dark:border-teal-400 bg-teal-50/30 dark:bg-teal-500/5' 
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'
            }`}
          >
            大学別アーカイブ
          </button>
          <button
            onClick={() => setActiveTab('field')}
            className={`flex-1 py-5 text-sm font-bold text-center transition-all ${
              activeTab === 'field' 
                ? 'text-teal-600 dark:text-teal-400 border-b-4 border-teal-600 dark:border-teal-400 bg-teal-50/30 dark:bg-teal-500/5' 
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'
            }`}
          >
            分野別クロス検索
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex space-x-4 bg-slate-50/30 dark:bg-slate-900/20">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={activeTab === 'university' ? "大学名で検索..." : "分野名やキーワードで検索..."}
              className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all shadow-sm"
            />
          </div>
          <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95">
            <Filter size={18} className="mr-2" />
            絞り込み
          </button>
        </div>

        {/* List Content */}
        <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
          {activeTab === 'university' ? (
            universities.map((uni, i) => (
              <div key={i} className="p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pr-4 font-serif italic">{uni.name}</h3>
                  <div className="flex items-center space-x-2 text-sm shrink-0">
                    <span className="text-slate-400 dark:text-slate-500 hidden sm:inline font-bold uppercase tracking-widest text-[10px]">進捗</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">{uni.progress}%</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 sm:h-2.5 mb-6">
                  <div className="bg-teal-500 h-full rounded-full shadow-sm shadow-teal-200" style={{ width: `${uni.progress}%` }}></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uni.years.map(year => (
                    <button key={year} className="px-5 py-2.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center min-h-[44px] shadow-sm active:scale-95">
                      {year}年度 <ChevronDown size={16} className="ml-2 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            fields.map((field, i) => (
              <div key={i} className="p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between space-y-6 sm:space-y-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 font-serif italic">{field.name}</h3>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500">収録問題数: {field.count}問</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">マスター度</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 sm:w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 sm:h-2">
                        <div className={`h-full rounded-full shadow-sm ${field.mastery >= 80 ? 'bg-emerald-500 shadow-emerald-100' : field.mastery >= 50 ? 'bg-orange-500 shadow-orange-100' : 'bg-red-500 shadow-red-100'}`} style={{ width: `${field.mastery}%` }}></div>
                      </div>
                      <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">{field.mastery}%</span>
                    </div>
                  </div>
                  <button className="px-8 py-3 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl text-sm font-bold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-all min-h-[48px] shadow-sm active:scale-95">
                    演習開始
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowQuiz(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-xs font-bold mb-4">
                  <Zap size={14} className="mr-1.5" /> QUIZ
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {quizStep === 'question' ? mockQuiz.question : '正解は...'}
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {quizStep === 'question' ? (
                  <motion.div 
                    key="q"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-4"
                  >
                    <button 
                      onClick={() => setQuizStep('answer')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
                    >
                      答えを表示
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="a"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{mockQuiz.answer}</p>
                      <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                        {mockQuiz.explanation}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowQuiz(false)}
                      className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
                    >
                      閉じる
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
