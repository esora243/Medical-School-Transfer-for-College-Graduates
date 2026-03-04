import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Target, TrendingUp, ChevronRight, Bot, Play, Pause, RotateCcw, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';

import { GoogleGenAI } from '@google/genai';

export function HomePage() {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [aiInfo, setAiInfo] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    fetchAiInfo();
  }, []);

  const fetchAiInfo = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "医学部学士編入（2025-2026年度）の主要大学（阪大、名大、北大、千葉大、岡山大など）の試験日程、科目、倍率、および生命科学の頻出テーマを簡潔なMarkdown形式で教えてください。また、TOEIC/TOEFLの必要スコアの目安も。回答は日本語で。",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setAiInfo(response.text || '情報の取得に失敗しました。');
    } catch (error) {
      console.error('Failed to fetch AI info:', error);
      setAiInfo('通信エラーが発生しました。ネットワーク接続を確認してください。');
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (timerMode === 'work') {
        setTimerMode('break');
        setTimeLeft(5 * 60);
      } else {
        setTimerMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, timerMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const todos = [
    { id: 1, task: '生命科学：細胞周期とがん抑制遺伝子', time: '45分', done: true },
    { id: 2, task: '英語：医学論文アブストラクト読解', time: '30分', done: false },
    { id: 3, task: '物理：放射線と生体への影響', time: '20分', done: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif italic">お疲れ様です、佐藤さん</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">今日の学習目標まであと25分です 🌿</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">大阪大学 医学部（学士編入）</p>
          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">試験まで 84日</p>
        </div>
      </header>

      <div className="sm:hidden bg-teal-50 dark:bg-teal-500/10 p-5 rounded-3xl border border-teal-100 dark:border-teal-500/20">
        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">大阪大学 医学部（学士編入）</p>
        <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">試験まで 84日</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Study Timer - Gap Time Optimization */}
        <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-950 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${timerMode === 'work' ? 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'}`}>
              <Clock size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {timerMode === 'work' ? '集中タイム' : '休憩タイム'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {timerMode === 'work' ? 'スキマ時間を活用して集中しましょう' : 'リフレッシュして次の集中に備えましょう'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-10">
            <div className="text-5xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setTimerActive(!timerActive)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${timerActive ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-200'}`}
              >
                {timerActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button 
                onClick={() => { setTimerActive(false); setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60); }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
              >
                <RotateCcw size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Medical Transfer Insights */}
        <div className="col-span-1 md:col-span-3 bg-teal-50/50 dark:bg-teal-500/5 p-8 rounded-5xl border border-teal-100/50 dark:border-teal-500/20 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                  <Bot size={22} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif italic">AI 医学部学士編入コンシェルジュ</h3>
              </div>
              <button 
                onClick={fetchAiInfo}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-teal-100 dark:border-teal-800 shadow-sm transition-all active:scale-95"
              >
                <RotateCcw size={12} className="mr-1.5" /> 更新
              </button>
            </div>
            {isAiLoading ? (
              <div className="flex items-center space-x-3 text-slate-400 py-4">
                <RefreshCw className="animate-spin" size={18} />
                <span className="text-sm font-medium">最新情報を収集中...</span>
              </div>
            ) : (
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-white/50 dark:border-slate-800/50 prose prose-sm dark:prose-invert max-w-none prose-teal">
                {aiInfo ? (
                  <Markdown>{aiInfo}</Markdown>
                ) : (
                  '情報を取得できませんでした。'
                )}
              </div>
            )}
          </div>
          <Bot size={150} className="absolute -bottom-10 -right-10 text-teal-600/5 pointer-events-none" />
        </div>

        {/* Stats */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '今週の学習時間', value: '12.5', unit: 'h', icon: Clock, color: 'bg-blue-50 text-blue-600' },
            { label: '過去問正答率', value: '68', unit: '%', icon: Target, color: 'bg-emerald-50 text-emerald-600' },
            { label: '連続学習日数', value: '14', unit: '日', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
            { label: '完了タスク', value: '42', unit: '件', icon: CheckCircle2, color: 'bg-teal-50 text-teal-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`p-1.5 rounded-lg ${stat.color}`}>
                  <stat.icon size={16} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ToDo List */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800/60 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif italic">今日のToDo</h2>
            <button className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center bg-teal-50 dark:bg-teal-500/10 px-4 py-2 rounded-full transition-all active:scale-95">
              すべて見る <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {todos.map((todo) => (
              <div key={todo.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-5">
                  <button className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    todo.done 
                      ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-100' 
                      : 'border-slate-200 dark:border-slate-700 text-transparent hover:border-teal-500'
                  }`}>
                    <CheckCircle2 size={16} />
                  </button>
                  <span className={`font-semibold text-base ${todo.done ? 'text-slate-300 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                    {todo.task}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  <Clock size={14} />
                  <span>{todo.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-5xl p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 font-serif italic">AI 面接シミュレーター</h3>
              <p className="text-teal-50 text-sm mb-6 leading-relaxed">前回のフィードバックを元に、志望動機の深掘り練習をしましょう。</p>
              <span className="inline-flex items-center text-sm font-bold bg-white text-teal-700 px-5 py-2.5 rounded-2xl shadow-lg transition-all group-hover:translate-x-1 active:scale-95">
                開始する <ChevronRight size={18} className="ml-1" />
              </span>
            </div>
            <Bot size={140} className="absolute -bottom-8 -right-8 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-[#FFF9F2] dark:bg-slate-900 rounded-5xl p-8 border border-orange-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 dark:text-white mb-6 uppercase tracking-widest">忘却曲線アラート</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">統計学（仮説検定）</span>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-wider">復習推奨</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">生化学（代謝経路）</span>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-wider">復習推奨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
