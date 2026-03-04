import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: format(new Date(), 'yyyy-MM-dd'), type: 'log' });

  const [events, setEvents] = useState([
    { id: 1, date: new Date(2026, 4, 15), title: '大阪大学 願書受付開始', type: 'deadline', color: 'bg-red-500' },
    { id: 2, date: new Date(2026, 5, 10), title: '大阪大学 第1次試験', type: 'exam', color: 'bg-indigo-600' },
    { id: 3, date: new Date(2026, 5, 25), title: '名古屋大学 第1次試験', type: 'exam', color: 'bg-indigo-600' },
    { id: 4, date: new Date(2026, 6, 5), title: '北海道大学 第1次試験', type: 'exam', color: 'bg-indigo-600' },
    { id: 5, date: new Date(2026, 1, 25), title: '学習ログ: 生命科学 3.5h', type: 'log', color: 'bg-emerald-500' },
    { id: 6, date: new Date(2026, 1, 26), title: '学習ログ: 医学英語 2.0h', type: 'log', color: 'bg-emerald-500' },
  ]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    
    const colorMap: Record<string, string> = {
      deadline: 'bg-red-500',
      info: 'bg-blue-500',
      exam: 'bg-indigo-600',
      log: 'bg-emerald-500'
    };

    const [year, month, day] = newEvent.date.split('-').map(Number);
    
    setEvents([...events, {
      id: Date.now(),
      date: new Date(year, month - 1, day),
      title: newEvent.type === 'log' && !newEvent.title.startsWith('学習ログ:') ? `学習ログ: ${newEvent.title}` : newEvent.title,
      type: newEvent.type,
      color: colorMap[newEvent.type]
    }]);
    setIsModalOpen(false);
    setNewEvent({ title: '', date: format(new Date(), 'yyyy-MM-dd'), type: 'log' });
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif italic">スケジュール管理</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">出願スケジュールと学習ログを管理します。</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center shadow-lg shadow-teal-900/10 active:scale-95"
        >
          <CalendarIcon size={18} className="mr-2" />
          予定を追加
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800/60 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center font-serif italic">
              {format(currentDate, 'yyyy年 M月', { locale: ja })}
            </h2>
            <div className="flex space-x-3">
              <button onClick={prevMonth} className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-teal-600 border border-transparent hover:border-teal-100">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextMonth} className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-teal-600 border border-transparent hover:border-teal-100">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-3">
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="h-16 sm:h-28 rounded-3xl bg-slate-50/30 dark:bg-slate-900/20 border border-transparent"></div>
              ))}
              
              {days.map((day, i) => {
                const dayEvents = events.filter(e => isSameDay(e.date, day));
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDate(day)}
                    className={`h-16 sm:h-28 rounded-3xl border p-1.5 sm:p-3 flex flex-col transition-all cursor-pointer group ${
                      isSelected
                        ? 'ring-4 ring-teal-500/20 border-teal-500 bg-teal-50/30'
                        : isToday(day) 
                          ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30' 
                          : 'bg-white dark:bg-slate-950 border-slate-50 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-500/50'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-bold mb-1.5 ${isToday(day) ? 'text-orange-600 dark:text-orange-400' : isSelected ? 'text-teal-700' : 'text-slate-700 dark:text-slate-300'}`}>
                      {format(day, dateFormat)}
                    </span>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {dayEvents.map(event => (
                        <div key={event.id} className={`text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-xl truncate text-white shadow-sm ${event.color}`}>
                          <span className="hidden sm:inline">{event.title}</span>
                          <span className="sm:hidden w-full h-1.5 block rounded-full bg-white/40"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Selected Date Events */}
          <div className="md:hidden p-8 border-t border-slate-50 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 font-serif italic">
              {format(selectedDate, 'M月d日', { locale: ja })} の予定
            </h3>
            <div className="space-y-3">
              {events.filter(e => isSameDay(e.date, selectedDate)).length > 0 ? (
                events.filter(e => isSameDay(e.date, selectedDate)).map(event => (
                  <div key={event.id} className="flex items-center space-x-4 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${event.color} shadow-sm`}></div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{event.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">予定はありません</p>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events & Logs */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center font-serif italic">
              <AlertCircle size={22} className="mr-3 text-red-500" />
              直近の重要日程
            </h3>
            <div className="space-y-5">
              {events.filter(e => e.type === 'deadline' || e.type === 'exam').slice(0, 3).map(event => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className={`w-3 h-3 mt-1.5 rounded-full ${event.color} shadow-sm`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{event.title}</p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{format(event.date, 'yyyy年M月d日', { locale: ja })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center font-serif italic">
              <Clock size={22} className="mr-3 text-emerald-500" />
              最近の学習ログ
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-3">
                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">今月の累計</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">42.5h</span>
              </div>
              {events.filter(e => e.type === 'log').slice(0, 3).map(event => (
                <div key={event.id} className="flex justify-between items-center text-sm">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{format(event.date, 'M/d', { locale: ja })}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{event.title.replace('学習ログ: ', '')}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">
              詳細を見る
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">予定・ログを追加</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">種類</label>
                <select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  <option value="log">学習ログ</option>
                  <option value="deadline">出願・締切</option>
                  <option value="exam">試験日</option>
                  <option value="info">その他情報</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">日付</label>
                <input 
                  type="date" 
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">タイトル / 内容</label>
                <input 
                  type="text" 
                  required
                  placeholder={newEvent.type === 'log' ? "例: 3.5h" : "例: 東大理学系 出願開始"}
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
                  追加する
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
