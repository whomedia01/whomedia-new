import React from 'react';
import { Bell, CheckCircle2, X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { InquiryLogItem } from '../types';

interface NotificationToastProps {
  inquiry: InquiryLogItem | null;
  onClose: () => void;
  onOpenAdmin: () => void;
  notificationPermission: NotificationPermission;
  onRequestNotificationPermission: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  inquiry,
  onClose,
  onOpenAdmin,
  notificationPermission,
  onRequestNotificationPermission,
}) => {
  if (!inquiry) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-bounce-once">
      <div className="bg-slate-900/95 border-2 border-red-500 text-white rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glowing Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="p-2 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/30">
                <Bell className="w-5 h-5 animate-wiggle" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black bg-red-600/30 text-red-400 px-2 py-0.5 rounded-md border border-red-500/30">
                  신규 문의 알림
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{inquiry.createdAt}</span>
              </div>
              <h4 className="text-sm font-black text-white mt-1">
                {inquiry.company} <span className="font-semibold text-slate-300">({inquiry.name})</span>
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-red-400">분야: {inquiry.category}</span>
            <span className="font-mono text-emerald-400">{inquiry.phone}</span>
          </div>
          <p className="line-clamp-2 text-slate-200 font-medium leading-relaxed pt-1 border-t border-slate-800/60">
            "{inquiry.message}"
          </p>
        </div>

        {/* Action Bar */}
        <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          {notificationPermission === 'default' ? (
            <button
              onClick={onRequestNotificationPermission}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>데스크톱 알림 켜기</span>
            </button>
          ) : notificationPermission === 'granted' ? (
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>데스크톱 알림 활성화됨</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-500">알림 차단됨</span>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 shadow-md ml-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>게시판 확인</span>
          </button>
        </div>
      </div>
    </div>
  );
};
