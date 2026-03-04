import { motion } from 'motion/react';
import { User, Settings, Target, TrendingUp, Award, ChevronRight, Lock, Bot } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export function MyPage() {
  const radarData = [
    { subject: '分子生物学', A: 85, fullMark: 100 },
    { subject: '生化学', A: 65, fullMark: 100 },
    { subject: '細胞生物学', A: 75, fullMark: 100 },
    { subject: '統計学', A: 40, fullMark: 100 },
    { subject: '英語', A: 90, fullMark: 100 },
    { subject: '小論文', A: 70, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif italic">マイページ</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">志望校設定、成績履歴、会員ステータスを確認できます。</p>
        </div>
        <button className="p-3 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95">
          <Settings size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-10 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-teal-900/10 transform rotate-3">
              S
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 font-serif italic">佐藤 健太</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">社会人受験生（製薬メーカー勤務）</p>
            
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/10 border border-teal-100 dark:border-teal-800/50 px-6 py-2.5 rounded-full shadow-sm">
              <Award size={18} className="text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-bold text-teal-800 dark:text-teal-300">プレミアム会員</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center font-serif italic">
              <Target size={20} className="mr-3 text-teal-500" />
              志望校設定
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-teal-50/50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500"></div>
                <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mb-1 uppercase tracking-widest">第一志望</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">東京大学大学院 理学系研究科</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300 dark:bg-slate-700"></div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest">第二志望</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-600 transition-colors">京都大学大学院 生命科学研究科</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 text-teal-600 dark:text-teal-400 text-sm font-bold hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-2xl transition-all active:scale-95">
              志望校を変更する
            </button>
          </div>
        </div>

        {/* Stats & Radar Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center font-serif italic">
                <TrendingUp size={20} className="mr-3 text-emerald-500" />
                合格可能性・分野別バランス
              </h3>
              <div className="text-right">
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 font-serif">A判定</span>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Probability: 82%</p>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="現在の実力"
                    dataKey="A"
                    stroke="#0d9488"
                    strokeWidth={3}
                    fill="#0d9488"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 p-6 bg-teal-50/30 dark:bg-slate-900 rounded-3xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-teal-50 dark:border-slate-800">
              <p className="font-bold text-teal-700 dark:text-teal-400 mb-2 flex items-center">
                <Bot size={16} className="mr-2" />
                AIからのアドバイス：
              </p>
              <p className="leading-relaxed">分子生物学と英語は合格ラインに達しています。一方で、統計学の基礎問題で失点が目立ちます。今週は統計学の過去問演習を重点的に行うことをお勧めします。</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800/60">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif italic">オプションサービス</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
              <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm group-hover:scale-110 transition-transform">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">現役編入生による個別コーチング</h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">月2回のオンライン面談とチャットサポート</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
              </div>
              <div className="p-8 flex items-center justify-between opacity-60 cursor-not-allowed group">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">過去問フルアクセス（10年分）</h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">プレミアム会員限定の機能です</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">解放済</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
