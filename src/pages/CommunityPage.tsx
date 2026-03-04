import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Users, TrendingUp, ThumbsUp, MessageSquare, Clock, X, Plus } from 'lucide-react';

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'progress'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newPost, setNewPost] = useState({ uni: '東京大学大学院 理学系', title: '', content: '' });
  const [newProgress, setNewProgress] = useState({ task: '', duration: '', comment: '' });

  const [boardPosts, setBoardPosts] = useState([
    { uni: '東京大学大学院 理学系', title: '今年の面接の雰囲気について', author: '匿名希望', time: '2時間前', replies: 12, likes: 45 },
    { uni: '京都大学大学院 生命科学', title: '過去問の解答例（生化学）共有します', author: '研究員A', time: '5時間前', replies: 8, likes: 120 },
    { uni: '大阪大学大学院 理学', title: '出願書類の書き方で質問です', author: '社会人受験生', time: '1日前', replies: 3, likes: 15 },
  ]);

  const [progressPosts, setProgressPosts] = useState([
    { user: '匿名ユーザー_A', time: '10分前', task: '分子生物学 過去問演習', duration: '2.5h', comment: '今日は集中できた。明日も頑張る。', likes: 12 },
    { user: '匿名ユーザー_B', time: '30分前', task: '小論文作成', duration: '1.0h', comment: 'AI添削で指摘された論理構成を修正。', likes: 8 },
    { user: '匿名ユーザー_C', time: '1時間前', task: '英単語暗記', duration: '0.5h', comment: '通勤時間を利用して50単語。', likes: 24 },
    { user: '匿名ユーザー_D', time: '2時間前', task: '面接練習', duration: '1.5h', comment: '志望動機がまだ弱い。要改善。', likes: 5 },
  ]);

  const handleAddBoardPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title) return;
    setBoardPosts([{
      uni: newPost.uni,
      title: newPost.title,
      author: '自分',
      time: 'たった今',
      replies: 0,
      likes: 0
    }, ...boardPosts]);
    setIsModalOpen(false);
    setNewPost({ ...newPost, title: '', content: '' });
  };

  const handleAddProgressPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgress.task) return;
    setProgressPosts([{
      user: '自分',
      time: 'たった今',
      task: newProgress.task,
      duration: newProgress.duration || '0.5h',
      comment: newProgress.comment,
      likes: 0
    }, ...progressPosts]);
    setIsModalOpen(false);
    setNewProgress({ task: '', duration: '', comment: '' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif italic">受験生コミュニティ</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">同じ目標を持つ仲間と情報交換や進捗共有ができます。</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl w-full max-w-md mx-auto mb-8 backdrop-blur-sm border border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex-1 py-3 text-sm font-bold text-center rounded-xl transition-all ${
            activeTab === 'board' 
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <MessageCircle size={18} className="inline-block mr-2" />
          大学別掲示板
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-3 text-sm font-bold text-center rounded-xl transition-all ${
            activeTab === 'progress' 
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp size={18} className="inline-block mr-2" />
          勉強報告・進捗共有
        </button>
      </div>

      {activeTab === 'board' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Board Posts */}
            {boardPosts.map((post, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 hover:border-teal-200 dark:hover:border-teal-900/50 transition-all cursor-pointer group active:scale-[0.99]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                    {post.uni}
                  </span>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center">
                    <Clock size={14} className="mr-1.5" /> {post.time}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 transition-colors font-serif italic">{post.title}</h3>
                <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 mr-2 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {post.author[0]}
                    </div>
                    {post.author}
                  </span>
                  <div className="flex space-x-6">
                    <span className="flex items-center hover:text-teal-600 transition-colors"><MessageSquare size={18} className="mr-1.5" /> {post.replies}</span>
                    <span className="flex items-center hover:text-emerald-500 transition-colors"><ThumbsUp size={18} className="mr-1.5" /> {post.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center font-serif italic">
                <Users size={20} className="mr-3 text-teal-500" />
                人気の掲示板
              </h3>
              <div className="space-y-4">
                {['東京大学大学院 理学系', '京都大学大学院 生命科学', '大阪大学大学院 理学', '名古屋大学大学院 理学'].map((uni, i) => (
                  <div key={i} className="flex justify-between items-center text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 p-3 rounded-2xl cursor-pointer transition-all group">
                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600 transition-colors">{uni}</span>
                    <span className="text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold">{ (4-i)*120 }</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-teal-900/10 active:scale-95 flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              新規スレッド作成
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-teal-900/10 flex items-center active:scale-95"
            >
              <TrendingUp size={20} className="mr-2" />
              進捗を報告する
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Progress Posts */}
            {progressPosts.map((post, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 hover:shadow-xl hover:shadow-teal-900/5 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm transform group-hover:rotate-6 transition-transform">
                      {post.user.slice(-1)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{post.user}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{post.time}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 px-3 py-1 rounded-full text-[10px] font-bold border border-teal-100 dark:border-teal-900/30">
                      {post.task}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center border border-emerald-100 dark:border-emerald-900/30">
                      <Clock size={12} className="mr-1.5" /> {post.duration}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{post.comment}</p>
                </div>
                <div className="flex justify-end border-t border-slate-50 dark:border-slate-800/60 pt-5">
                  <button className="flex items-center text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 transition-all text-xs font-bold active:scale-95">
                    <ThumbsUp size={18} className="mr-2" /> いいね！ ({post.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'board' ? '新規スレッド作成' : '進捗を報告'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>

            {activeTab === 'board' ? (
              <form onSubmit={handleAddBoardPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">対象大学</label>
                  <select 
                    value={newPost.uni}
                    onChange={(e) => setNewPost({...newPost, uni: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="東京大学大学院 理学系">東京大学大学院 理学系</option>
                    <option value="京都大学大学院 生命科学">京都大学大学院 生命科学</option>
                    <option value="大阪大学大学院 理学">大阪大学大学院 理学</option>
                    <option value="名古屋大学大学院 理学">名古屋大学大学院 理学</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">タイトル</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例: 今年の面接の雰囲気について"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">内容</label>
                  <textarea 
                    rows={4}
                    placeholder="質問や共有したい情報を入力してください"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                  ></textarea>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
                    投稿する
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddProgressPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">学習内容</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例: 分子生物学 過去問演習"
                    value={newProgress.task}
                    onChange={(e) => setNewProgress({...newProgress, task: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">学習時間</label>
                  <input 
                    type="text" 
                    placeholder="例: 2.5h"
                    value={newProgress.duration}
                    onChange={(e) => setNewProgress({...newProgress, duration: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ひとこと</label>
                  <textarea 
                    rows={3}
                    placeholder="今日の振り返りや明日の目標など"
                    value={newProgress.comment}
                    onChange={(e) => setNewProgress({...newProgress, comment: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                  ></textarea>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
                    報告する
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
