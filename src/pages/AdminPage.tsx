import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Plus, Trash2, RefreshCw, Search, Filter, FileUp, Download, X, Cloud, ExternalLink, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Question {
  id: number;
  university: string;
  year: number;
  field: string;
  question_text: string;
  answer_text: string;
  explanation: string;
  created_at: string;
}

export function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    university: '',
    year: new Date().getFullYear(),
    field: '',
    question_text: '',
    answer_text: '',
    explanation: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/questions');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      } else {
        alert('問題データの取得に失敗しました。');
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      alert('通信エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    checkDriveStatus();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        checkDriveStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkDriveStatus = async () => {
    try {
      const res = await fetch('/api/auth/google/status');
      if (res.ok) {
        const { connected } = await res.json();
        setIsDriveConnected(connected);
      }
    } catch (error) {
      console.error('Failed to check drive status:', error);
    }
  };

  const handleConnectDrive = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, 'google_auth', 'width=600,height=700');
      }
    } catch (error) {
      console.error('Failed to get auth url:', error);
    }
  };

  const handleLogoutDrive = async () => {
    try {
      await fetch('/api/auth/google/logout', { method: 'POST' });
      setIsDriveConnected(false);
      setDriveFiles([]);
    } catch (error) {
      console.error('Failed to logout drive:', error);
    }
  };

  const fetchDriveFiles = async () => {
    setIsDriveLoading(true);
    setIsDriveModalOpen(true);
    try {
      const res = await fetch('/api/drive/files');
      if (res.ok) {
        const files = await res.json();
        setDriveFiles(files);
      } else if (res.status === 401) {
        setIsDriveConnected(false);
        setIsDriveModalOpen(false);
        alert('Google Driveの再連携が必要です。');
      }
    } catch (error) {
      console.error('Failed to fetch drive files:', error);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleDriveImport = async (fileId: string) => {
    if (!confirm('このファイルから問題をインポートしますか？')) return;
    
    setIsDriveLoading(true);
    try {
      const res = await fetch(`/api/drive/import/${fileId}`, { method: 'POST' });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const mappedData = data.map((row: any) => ({
          university: row['大学名'] || row['university'] || '',
          year: parseInt(row['年度'] || row['year']) || new Date().getFullYear(),
          field: row['分野'] || row['field'] || '',
          question_text: row['問題文'] || row['question_text'] || '',
          answer_text: row['解答'] || row['answer_text'] || '',
          explanation: row['解説'] || row['explanation'] || ''
        }));

        if (mappedData.length === 0) {
          alert('有効なデータが見つかりませんでした。');
          return;
        }

        const bulkRes = await fetch('/api/questions/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mappedData)
        });

        if (bulkRes.ok) {
          const result = await bulkRes.json();
          alert(`${result.count}件の問題をインポートしました。`);
          setIsDriveModalOpen(false);
          await fetchQuestions();
        } else {
          alert('インポートに失敗しました。');
        }
      }
    } catch (error) {
      console.error('Drive import error:', error);
      alert('インポート中にエラーが発生しました。');
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion)
      });
      
      if (res.ok) {
        await fetchQuestions();
        setIsModalOpen(false);
        setNewQuestion({
          university: '',
          year: new Date().getFullYear(),
          field: '',
          question_text: '',
          answer_text: '',
          explanation: ''
        });
      }
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchQuestions();
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Map Excel columns to database fields
        // Expected columns: 大学名, 年度, 分野, 問題文, 解答, 解説
        const mappedData = data.map((row: any) => ({
          university: row['大学名'] || row['university'] || '',
          year: parseInt(row['年度'] || row['year']) || new Date().getFullYear(),
          field: row['分野'] || row['field'] || '',
          question_text: row['問題文'] || row['question_text'] || '',
          answer_text: row['解答'] || row['answer_text'] || '',
          explanation: row['解説'] || row['explanation'] || ''
        }));

        if (mappedData.length === 0) {
          alert('有効なデータが見つかりませんでした。');
          return;
        }

        const res = await fetch('/api/questions/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mappedData)
        });

        if (res.ok) {
          const result = await res.json();
          alert(`${result.count}件の問題をインポートしました。`);
          await fetchQuestions();
        } else {
          alert('インポートに失敗しました。');
        }
      } catch (err) {
        console.error('Excel parse error:', err);
        alert('ファイルの読み込み中にエラーが発生しました。');
      }
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      { '大学名': '東京大学', '年度': 2024, '分野': '分子生物学', '問題文': '...', '解答': '...', '解説': '...' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "question_template.xlsx");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-6xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center font-serif italic">
            <Database className="mr-3 text-teal-500" />
            問題データベース管理
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">過去問データの追加・編集・削除を行います。</p>
        </div>
        <div className="flex space-x-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleExcelImport} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button 
            onClick={downloadTemplate}
            className="p-3 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-all bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex items-center active:scale-95"
            title="テンプレートをダウンロード"
          >
            <Download size={20} className="mr-2" />
            <span className="text-sm font-bold">テンプレート</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-all bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex items-center active:scale-95"
            title="Excelからインポート"
          >
            <FileUp size={20} className="mr-2" />
            <span className="text-sm font-bold">Excelインポート</span>
          </button>
          <button 
            onClick={isDriveConnected ? fetchDriveFiles : handleConnectDrive}
            className={`p-3 transition-all border rounded-2xl shadow-sm flex items-center active:scale-95 ${
              isDriveConnected 
                ? 'text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' 
                : 'text-slate-500 border-slate-100 bg-white hover:text-teal-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-teal-400'
            }`}
            title={isDriveConnected ? "Google Driveからインポート" : "Google Driveを連携"}
          >
            <Cloud size={20} className="mr-2" />
            <span className="text-sm font-bold">{isDriveConnected ? "Driveインポート" : "Drive連携"}</span>
          </button>
          <button 
            onClick={fetchQuestions}
            className="p-3 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-all bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm active:scale-95"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center shadow-lg shadow-teal-900/10 active:scale-95"
          >
            <Plus size={18} className="mr-2" />
            新規問題を追加
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-950 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex space-x-4 bg-slate-50/30 dark:bg-slate-900/20">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="問題文や大学名で検索..."
              className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all shadow-sm"
            />
          </div>
          <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95">
            <Filter size={18} className="mr-2" />
            絞り込み
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">大学・年度</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">分野</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">問題文</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">読み込み中...</td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">データがありません。</td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group">
                    <td className="p-6 text-sm font-bold text-slate-400 dark:text-slate-500">{q.id}</td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors font-serif italic">{q.university}</div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500">{q.year}年度</div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 shadow-sm">
                        {q.field}
                      </span>
                    </td>
                    <td className="p-6 text-sm font-medium text-slate-600 dark:text-slate-300 max-w-md truncate">
                      {q.question_text}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-3 text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">読み込み中...</div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">データがありません。</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{q.university}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{q.year}年度</div>
                  </div>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300">
                    {q.field}
                  </span>
                  <span className="text-xs text-slate-400">ID: {q.id}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                  {q.question_text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">新規問題を追加</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">大学名・研究科</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例: 東京大学大学院 理学系研究科"
                    value={newQuestion.university}
                    onChange={(e) => setNewQuestion({...newQuestion, university: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">年度</label>
                  <input 
                    type="number" 
                    required
                    value={newQuestion.year}
                    onChange={(e) => setNewQuestion({...newQuestion, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">分野</label>
                <input 
                  type="text" 
                  required
                  placeholder="例: 分子生物学"
                  value={newQuestion.field}
                  onChange={(e) => setNewQuestion({...newQuestion, field: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">問題文</label>
                <textarea 
                  required
                  rows={3}
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">解答</label>
                <textarea 
                  required
                  rows={3}
                  value={newQuestion.answer_text}
                  onChange={(e) => setNewQuestion({...newQuestion, answer_text: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">解説 (任意)</label>
                <textarea 
                  rows={3}
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  キャンセル
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  保存する
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Google Drive File Picker Modal */}
      <AnimatePresence>
        {isDriveModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Cloud className="text-indigo-500" size={24} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Google Driveから選択</h3>
                </div>
                <button 
                  onClick={() => setIsDriveModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {isDriveLoading ? (
                  <div className="py-12 text-center">
                    <RefreshCw className="animate-spin mx-auto text-indigo-500 mb-2" size={32} />
                    <p className="text-slate-500">読み込み中...</p>
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    Excelファイルが見つかりませんでした。
                  </div>
                ) : (
                  driveFiles.map((file) => (
                    <div 
                      key={file.id} 
                      onClick={() => handleDriveImport(file.id)}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{file.name}</p>
                          <p className="text-xs text-slate-500">更新日: {new Date(file.modifiedTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ExternalLink size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <button 
                  onClick={handleLogoutDrive}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Google Driveの連携を解除
                </button>
                <button 
                  onClick={() => setIsDriveModalOpen(false)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
