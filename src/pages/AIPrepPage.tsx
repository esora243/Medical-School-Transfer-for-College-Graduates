import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Mic, Upload, Play, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export function AIPrepPage() {
  const [activeTab, setActiveTab] = useState<'essay' | 'interview'>('essay');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif italic">AI 論文・面接対策</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">AIによる即時フィードバックで、論理構成や面接の受け答えをブラッシュアップします。</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-3xl w-full max-w-md mx-auto mb-10 shadow-inner">
        <button
          onClick={() => setActiveTab('essay')}
          className={`flex-1 py-3 text-sm font-bold text-center rounded-2xl transition-all ${
            activeTab === 'essay' 
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText size={18} className="inline-block mr-2" />
          小論文 AI添削
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`flex-1 py-3 text-sm font-bold text-center rounded-2xl transition-all ${
            activeTab === 'interview' 
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Mic size={18} className="inline-block mr-2" />
          AI 面接シミュレーター
        </button>
      </div>

      {activeTab === 'essay' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload Area */}
          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-10 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-teal-500 transition-all cursor-pointer group min-h-[450px] active:scale-[0.98]">
            <div className="w-24 h-24 bg-teal-50 dark:bg-teal-500/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
              <Upload size={36} className="text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-serif italic">答案をアップロード</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs font-medium">PDF、Word、またはテキスト形式でアップロードしてください。AIが即座に分析を開始します。</p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-teal-900/10">
              ファイルを選択
            </button>
            <p className="text-xs font-bold text-slate-400 mt-6 uppercase tracking-widest">または、ここにファイルをドラッグ＆ドロップ</p>
          </div>

          {/* Recent Feedback */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center font-serif italic">
              <CheckCircle size={22} className="mr-3 text-emerald-500" />
              最近の添削結果
            </h3>
            {[
              { title: '志望理由書（阪大医学部編入）v2', score: 85, date: '2026/02/20', status: '改善あり' },
              { title: '研究計画書 ドラフト', score: 60, date: '2026/02/15', status: '要修正' },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 hover:border-teal-300 transition-all cursor-pointer group active:scale-[0.98]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">{item.title}</h4>
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{item.date}</p>
                  </div>
                  <div className={`px-5 py-2 rounded-2xl text-xs font-bold shadow-sm ${
                    item.score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                  }`}>
                    スコア: {item.score}
                  </div>
                </div>
                <div className="flex items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  {item.score >= 80 ? <CheckCircle size={18} className="mr-2 text-emerald-500" /> : <AlertTriangle size={18} className="mr-2 text-orange-500" />}
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-12 text-center border-b border-slate-50 dark:border-slate-800/60 bg-gradient-to-b from-teal-50/50 to-white dark:from-teal-900/20 dark:to-slate-950">
            <div className="w-28 h-28 bg-teal-100 dark:bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative shadow-inner">
              <Mic size={48} className="text-teal-600 dark:text-teal-400" />
              <div className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-serif italic">AI 面接官（標準モード）</h2>
            <p className="text-slate-500 dark:text-slate-300 max-w-md mx-auto mb-10 font-medium leading-relaxed">
              実際の面接を想定した質問を音声で投げかけます。回答内容だけでなく、声のトーンや話すスピードも分析します。
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-teal-900/10 flex items-center mx-auto active:scale-95">
              <Play size={28} className="mr-3" />
              シミュレーションを開始
            </button>
          </div>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center font-serif italic">
                <MessageSquare size={22} className="mr-3 text-teal-500" />
                過去のフィードバックハイライト
              </h3>
            </div>
            {[
              { title: '志望動機の具体性', desc: '前職での経験と研究テーマの結びつきが弱いです。具体的なエピソードを追加しましょう。', type: 'warning' },
              { title: '話すスピード', desc: '緊張からか、早口になる傾向があります。1分間に300文字程度を意識してください。', type: 'info' },
              { title: '論理的構成', desc: 'PREP法（結論→理由→具体例→結論）がしっかりできており、非常に分かりやすいです。', type: 'success' },
            ].map((fb, i) => (
              <div key={i} className={`p-8 rounded-3xl border shadow-sm transition-all hover:scale-[1.02] ${
                fb.type === 'warning' ? 'bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/30' :
                fb.type === 'info' ? 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/30' :
                'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/30'
              }`}>
                <h4 className={`text-lg font-bold mb-3 ${
                  fb.type === 'warning' ? 'text-orange-800 dark:text-orange-300' :
                  fb.type === 'info' ? 'text-blue-800 dark:text-blue-300' :
                  'text-emerald-800 dark:text-emerald-300'
                }`}>{fb.title}</h4>
                <p className={`text-sm font-medium leading-relaxed ${
                  fb.type === 'warning' ? 'text-orange-700 dark:text-orange-400' :
                  fb.type === 'info' ? 'text-blue-700 dark:text-blue-400' :
                  'text-emerald-700 dark:text-emerald-400'
                }`}>{fb.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
