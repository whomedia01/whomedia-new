import React, { useState, useEffect, useCallback } from 'react';
import { 
  Lock, 
  Unlock, 
  Search, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Download, 
  Edit3, 
  Save, 
  Building, 
  User, 
  Phone, 
  Calendar, 
  Tag, 
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Bell
} from 'lucide-react';
import { InquiryLogItem } from '../types';

interface AdminBoardProps {
  isOpen: boolean;
  onClose: () => void;
  inquiriesProps?: InquiryLogItem[];
  onRefreshInquiries?: () => void;
  notificationPermission?: NotificationPermission;
  onRequestNotificationPermission?: () => void;
}

export const AdminBoard: React.FC<AdminBoardProps> = ({ 
  isOpen, 
  onClose,
  inquiriesProps,
  onRefreshInquiries,
  notificationPermission,
  onRequestNotificationPermission
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const [inquiries, setInquiries] = useState<InquiryLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'전체' | '접수대기' | '확인중' | '처리완료'>('전체');

  const [selectedInquiry, setSelectedInquiry] = useState<InquiryLogItem | null>(null);
  const [editingMemo, setEditingMemo] = useState<string>('');
  const [isSavingMemo, setIsSavingMemo] = useState<boolean>(false);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      if (onRefreshInquiries) {
        await onRefreshInquiries();
      } else {
        const res = await fetch('/api/inquiries');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setInquiries(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onRefreshInquiries]);

  useEffect(() => {
    if (inquiriesProps) {
      setInquiries(inquiriesProps);
    }
  }, [inquiriesProps]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchInquiries();
    }
  }, [isOpen, isAuthenticated, fetchInquiries]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN is "1234" or "admin" or "whomedia"
    if (password === '1234' || password === 'admin' || password === 'whomedia' || password === '') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleStatusChange = async (id: string, newStatus: '접수대기' | '확인중' | '처리완료') => {
    try {
      const res = await fetch(`/api/inquiry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveMemo = async (id: string) => {
    setIsSavingMemo(true);
    try {
      const res = await fetch(`/api/inquiry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminMemo: editingMemo }),
      });
      const json = await res.json();
      if (json.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, adminMemo: editingMemo } : item));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, adminMemo: editingMemo } : null);
        }
      }
    } catch (err) {
      console.error('Failed to save memo:', err);
    } finally {
      setIsSavingMemo(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 문의 항목을 게시판에서 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/inquiry/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setInquiries(prev => prev.filter(item => item.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', '기관/회사명', '담당자', '연락처', '문의유형', '상세내용', '접수일시', '상태', '관리자메모'];
    const rows = inquiries.map(item => [
      item.id,
      `"${item.company.replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.phone.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      `"${item.message.replace(/"/g, '""')}"`,
      `"${item.createdAt}"`,
      `"${item.status}"`,
      `"${(item.adminMemo || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `whomedia_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = inquiries.filter(item => {
    const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
    const matchesQuery = 
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const totalCount = inquiries.length;
  const pendingCount = inquiries.filter(i => i.status === '접수대기').length;
  const inProgressCount = inquiries.filter(i => i.status === '확인중').length;
  const completedCount = inquiries.filter(i => i.status === '처리완료').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600/20 text-red-500 rounded-lg border border-red-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                (주)후미디어 프로젝트 문의 관리자 게시판
                <span className="text-xs bg-red-600/30 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">Admin Board</span>
              </h2>
              <p className="text-xs text-slate-400">클라이언트가 접수한 문의 내역을 실시간으로 확인 및 관리합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Admin Auth Login Box */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-red-500 mb-2 border border-slate-700">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">관리자 인증이 필요합니다</h3>
              <p className="text-sm text-slate-400">관리자 비밀번호를 입력하여 접수 게시판에 접속하세요.</p>
            </div>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="비밀번호 입력 (기본: 1234 또는 바로 엔터)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors text-center font-bold tracking-widest"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-red-400 mt-2 font-semibold">비밀번호가 일치하지 않습니다. (기본: 1234)</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Unlock className="w-4 h-4" />
                <span>게시판 접속하기</span>
              </button>
            </form>
          </div>
        ) : (
          /* Main Admin Board Interface */
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                onClick={() => setStatusFilter('전체')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  statusFilter === '전체' 
                    ? 'bg-slate-800 border-slate-600 shadow-md' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs text-slate-400 font-bold mb-1">전체 문의</div>
                <div className="text-2xl font-black text-white">{totalCount}<span className="text-xs text-slate-400 font-normal ml-1">건</span></div>
              </div>

              <div 
                onClick={() => setStatusFilter('접수대기')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  statusFilter === '접수대기' 
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs text-amber-400 font-bold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 접수대기
                </div>
                <div className="text-2xl font-black text-amber-400">{pendingCount}<span className="text-xs text-slate-400 font-normal ml-1">건</span></div>
              </div>

              <div 
                onClick={() => setStatusFilter('확인중')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  statusFilter === '확인중' 
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-md' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs text-blue-400 font-bold mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> 확인중
                </div>
                <div className="text-2xl font-black text-blue-400">{inProgressCount}<span className="text-xs text-slate-400 font-normal ml-1">건</span></div>
              </div>

              <div 
                onClick={() => setStatusFilter('처리완료')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  statusFilter === '처리완료' 
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 처리완료
                </div>
                <div className="text-2xl font-black text-emerald-400">{completedCount}<span className="text-xs text-slate-400 font-normal ml-1">건</span></div>
              </div>
            </div>

            {/* Filter & Action Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="회사명, 담당자명, 연락처, 내용으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Tabs */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-bold">
                {(['전체', '접수대기', '확인중', '처리완료'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      statusFilter === st 
                        ? 'bg-red-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {onRequestNotificationPermission && (
                  <button
                    onClick={onRequestNotificationPermission}
                    className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all flex items-center space-x-1 ${
                      notificationPermission === 'granted'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                        : 'bg-amber-950/60 text-amber-400 border-amber-500/40 hover:bg-amber-900/60'
                    }`}
                    title="실시간 브라우저 데스크톱 알림 설정"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {notificationPermission === 'granted' ? '알림 켜짐' : '데스크톱 알림 켜기'}
                    </span>
                  </button>
                )}

                <button
                  onClick={fetchInquiries}
                  disabled={isLoading}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1"
                  title="새로고침"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-red-500' : ''}`} />
                  <span className="hidden sm:inline">새로고침</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 shadow-sm"
                  title="CSV 데이터 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV 엑셀 저장</span>
                </button>
              </div>
            </div>

            {/* Board Content Area */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/50">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                  <MessageSquare className="w-10 h-10 text-slate-700" />
                  <p className="text-sm font-semibold">등록되었거나 검색 조건에 일치하는 문의 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {filteredInquiries.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                      onClick={() => {
                        setSelectedInquiry(item);
                        setEditingMemo(item.adminMemo || '');
                      }}
                    >
                      {/* Left: Info */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Status Badge */}
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            item.status === '접수대기'
                              ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                              : item.status === '확인중'
                              ? 'bg-blue-950/50 text-blue-400 border-blue-500/30'
                              : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {item.status}
                          </span>

                          {/* Category Badge */}
                          <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2.5 py-0.5 rounded-md border border-slate-700">
                            {item.category}
                          </span>

                          <span className="text-xs text-slate-500 font-mono">
                            {item.createdAt}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-white">
                          <span className="flex items-center gap-1.5 text-slate-100">
                            <Building className="w-4 h-4 text-slate-400" />
                            {item.company}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-300 font-medium text-xs">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {item.name}
                          </span>
                          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
                            <Phone className="w-3.5 h-3.5" />
                            {item.phone}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-200 transition-colors">
                          {item.message}
                        </p>

                        {item.adminMemo && (
                          <div className="text-[11px] text-amber-300/90 bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/20 max-w-xl">
                            💡 메모: {item.adminMemo}
                          </div>
                        )}
                      </div>

                      {/* Right: Quick Actions */}
                      <div className="flex items-center space-x-2 shrink-0" onClick={e => e.stopPropagation()}>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500"
                        >
                          <option value="접수대기">접수대기</option>
                          <option value="확인중">확인중</option>
                          <option value="처리완료">처리완료</option>
                        </select>

                        <button
                          onClick={() => {
                            setSelectedInquiry(item);
                            setEditingMemo(item.adminMemo || '');
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                        >
                          상세보기
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Detail Modal Overlay */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-2.5 bg-red-600/20 text-red-500 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedInquiry.status === '접수대기'
                        ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                        : selectedInquiry.status === '확인중'
                        ? 'bg-blue-950/50 text-blue-400 border-blue-500/30'
                        : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {selectedInquiry.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedInquiry.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{selectedInquiry.company}</h3>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="text-slate-500 font-bold mb-1">담당자 성명</div>
                  <div className="text-white font-bold text-sm">{selectedInquiry.name}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-bold mb-1">연락처</div>
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    <a href={`tel:${selectedInquiry.phone}`} className="hover:underline flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-bold mb-1">문의 사업 분야</div>
                  <div className="text-slate-200 font-semibold">{selectedInquiry.category}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-bold mb-1">처리 상태 변경</div>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 w-full"
                  >
                    <option value="접수대기">접수대기</option>
                    <option value="확인중">확인중</option>
                    <option value="처리완료">처리완료</option>
                  </select>
                </div>
              </div>

              {/* Full Message */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">문의 상세 내용</label>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Admin Memo Editor */}
              <div>
                <label className="text-xs font-bold text-amber-400 block mb-2 flex items-center justify-between">
                  <span>관리자 메모 (내부 기록용)</span>
                  {isSavingMemo && <span className="text-[10px] text-slate-400 animate-pulse">저장 중...</span>}
                </label>
                <textarea
                  rows={3}
                  value={editingMemo}
                  onChange={(e) => setEditingMemo(e.target.value)}
                  placeholder="통화 기록, 상담 내용, 처리 진행 상황을 메모하세요..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleSaveMemo(selectedInquiry.id)}
                    disabled={isSavingMemo}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>메모 저장</span>
                  </button>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center space-x-1 p-2 rounded-lg hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>문의 삭제</span>
                </button>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
