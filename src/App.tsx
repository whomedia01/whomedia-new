import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Organization } from './components/Organization';
import { BusinessAreas } from './components/BusinessAreas';
import { StudioRental } from './components/StudioRental';
import { StudioGallery } from './components/StudioGallery';
import { Portfolio } from './components/Portfolio';
import { Clients } from './components/Clients';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminBoard } from './components/AdminBoard';
import { NotificationToast } from './components/NotificationToast';
import { playNotificationSound } from './utils/sound';
import { InquiryLogItem } from './types';

export function App() {
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const [inquiries, setInquiries] = useState<InquiryLogItem[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [latestToastInquiry, setLatestToastInquiry] = useState<InquiryLogItem | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const previousInquiryIdsRef = useRef<Set<string>>(new Set());
  const isFirstFetchRef = useRef<boolean>(true);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/inquiries');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const fetchedList: InquiryLogItem[] = json.data;
        setInquiries(fetchedList);

        const pending = fetchedList.filter(i => i.status === '접수대기').length;
        setPendingCount(pending);

        // Detect new incoming inquiries
        if (!isFirstFetchRef.current) {
          const newItems = fetchedList.filter(item => !previousInquiryIdsRef.current.has(item.id));
          if (newItems.length > 0) {
            const newest = newItems[0];
            setLatestToastInquiry(newest);
            playNotificationSound();

            // Native Desktop Browser Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('🚨 [후미디어] 신규 프로젝트 문의 접수!', {
                  body: `[${newest.company}] ${newest.name}님: ${newest.category}`,
                  tag: newest.id,
                });
              } catch (err) {
                console.error('Browser Notification error:', err);
              }
            }
          }
        } else {
          isFirstFetchRef.current = false;
        }

        // Update tracking ref
        previousInquiryIdsRef.current = new Set(fetchedList.map(i => i.id));
      }
    } catch (err) {
      console.error('Failed to poll inquiries:', err);
    }
  }, []);

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('🚨 [후미디어] 데스크톱 알림이 설정되었습니다.', {
          body: '새로운 프로젝트 문의가 접수될 경우 실시간 브라우저 알림이 발송됩니다.',
        });
      }
    }
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 5000);
    return () => clearInterval(interval);
  }, [fetchInquiries]);

  const handleStudioSelect = (title: string) => {
    setSelectedStudio(title);
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white relative">
      {/* Real-time Floating Toast Notification */}
      <NotificationToast
        inquiry={latestToastInquiry}
        onClose={() => setLatestToastInquiry(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        notificationPermission={notificationPermission}
        onRequestNotificationPermission={handleRequestNotificationPermission}
      />

      {/* Navigation Bar */}
      <Header 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        pendingCount={pendingCount} 
      />

      {/* Main Content Layout matching video sequence */}
      <main ref={mainRef} className="h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth w-full">
        {/* 0. Hero (회사소개) */}
        <Hero />

        {/* 1. Organization (핵심역량 / CORE EXPERTISE & COMPETENCY) */}
        <Organization />

        {/* 2. Business Areas (사업영역 / 디지털 통합 미디어 비즈니스 허브) */}
        <BusinessAreas />

        {/* 3. Studio Rental (스튜디오 임대) */}
        <StudioRental onSelectStudio={handleStudioSelect} />

        {/* 4. Studio Gallery (스튜디오 갤러리) */}
        <StudioGallery />

        {/* 5. Portfolio (포트폴리오) */}
        <Portfolio />

        {/* 6. Clients & Partners (주요 파트너사) */}
        <Clients />

        {/* 7. FAQ (자주 묻는 질문 - AEO & GEO) */}
        <Faq />

        {/* 8. Contact & Estimate (제작 문의 및 견적) */}
        <Contact 
          initialStudioSelect={selectedStudio} 
          onInquirySubmitted={fetchInquiries}
        />
      </main>

      {/* Floating Scroll to Top Button */}
      <ScrollToTop scrollContainerRef={mainRef} />

      {/* Footer */}
      <Footer 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        pendingCount={pendingCount} 
      />

      {/* Admin Board Modal */}
      <AdminBoard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        inquiriesProps={inquiries}
        onRefreshInquiries={fetchInquiries}
        notificationPermission={notificationPermission}
        onRequestNotificationPermission={handleRequestNotificationPermission}
      />
    </div>
  );
}

export default App;
