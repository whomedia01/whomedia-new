// [정적 데이터 상수 강제 매핑 - API/DB 의존성 제거]
const PORTFOLIO_DATA = [
    { id: '0kHSItVXKOU', title: '능률 고등 영어 교재 연계 스마트 강좌', cat: 'edu', tag: 'NE능률', label: '이러닝 콘텐츠 개발' },
    { id: '6xb2GYInARg', title: '능률 중등 영어 맞춤형 학습 영상', cat: 'edu', tag: 'NE능률', label: '교육 콘텐츠' },
    { id: 'rJ2U9T27WwU', title: '태진옥 브랜드 시네마틱 4K 홍보영상', cat: 'press', tag: '태진옥', label: '홍보 영상 제작' },
    { id: 'PTqpVR-yIKg', title: '경희사이버대학교 가상 크로마키 강좌', cat: 'production', tag: '경희사이버대', label: '크로마키 스튜디오' },
    { id: 'AbeWeusmjws', title: '86인치 4K 전자칠판 스마트 강의 스튜디오', cat: 'production', tag: '전자칠판', label: '4K 프로덕션' },
    { id: 'PVVdU-CYowA', title: '웅진 스마트학습 연계 디지털 교재 강의', cat: 'edu', tag: '웅진씽크빅', label: '전자칠판' },
    { id: 'PxAZYrpdowU', title: '웅진 에듀테크 특수 무반사 블랙보드 강의', cat: 'edu', tag: '웅진씽크빅', label: '블랙보드' },
    { id: 'x4Cb5At6Z_M', title: '실시간 CG 인터랙티브 스마트 모션 강의', cat: 'production', tag: 'WHOMEDIA', label: 'CG/인터랙티브' },
    { id: 'JwCrB4dKgDU', title: '후캠퍼스 모바일 태블릿 에듀 강좌', cat: 'hucampus', tag: 'WHOMEDIA', label: '태블릿 강의' },
    { id: '54m2LENAo68', title: '4K 스튜디오 대형 크로마키 강좌 연출', cat: 'production', tag: 'WHOMEDIA', label: '크로마키' },
    { id: 'WaxhtAZLLV8', title: '교수진 맞춤형 방송용 크로마키 촬영', cat: 'production', tag: 'WHOMEDIA', label: '크로마키 촬영' },
    { id: 'paYW3d0MRqk', title: 'EBS 올쏘 핵심강좌 오프닝 모션그래픽', cat: 'production', tag: 'EBS', label: '모션그래픽' },
    { id: 'komXGh3TGSo', title: 'EBS 천일문 메인 타이틀 연출', cat: 'production', tag: 'EBS', label: '타이틀 연출' },
    { id: 'cF7i6m9apsE', title: 'EBS 포텐시리즈 4K 모션 오프닝', cat: 'production', tag: 'EBS', label: '모션그래픽' },
    { id: '-Is7q7qD9Rc', title: '한국AI교육신문 & 뉴미디어 PR 브랜딩', cat: 'press', tag: '유튜브PR', label: '디지털 언론 PR' }
];

const STUDIO_IMAGES = [
    '/DSCF0173.jpg',
    '/DSCF0231.jpg',
    '/DSCF0189.jpg',
    '/DSCF0194.jpg',
    '/DSCF0142.jpg',
    '/DSCF0224.jpg',
    '/DSCF0243.jpg'
];

const ORGANIZATION_DATA = [
    { id: 'div-rd', code: 'R&D CENTER', name: '기업부설연구소', desc: 'AI 에듀테크 · 미래 교육 미디어 연구 개발' },
    { id: 'div-1', code: 'DIVISION 01', name: '교육사업부', desc: '교육과정 맞춤 설계 및 사업 운영 총괄' },
    { id: 'div-2', code: 'DIVISION 02', name: '에듀테크부', desc: 'AI 교육 콘텐츠 및 UI/UX 디자인 개발' },
    { id: 'div-3', code: 'DIVISION 03', name: '영상미디어부', desc: '고품질 교육 영상 촬영, 편집 및 연출' },
    { id: 'div-4', code: 'DIVISION 04', name: '경영지원부', desc: '언론 홍보, PR 및 경영 행정 관리' }
];

document.addEventListener('alpine:init', () => {
    Alpine.data('whomediaApp', () => ({
        scrolled: false, 
        mobileMenuOpen: false, 
        refTab: 'all',
        portfolioLimit: 12,
        videoModalOpen: false,
        activeVideoId: '',
        activeVideoTitle: '',
        imageModalOpen: false,
        activeStudioImg: '',
        activeStudioTitle: '',
        keywords: ['교수설계 기반 맞춤형 이러닝 콘텐츠 기획·개발 (공공·기업·대학 전문)', '4K 고화질 미디어 프로덕션 & 크리에이티브', '에듀테크 기반 최신 디지털 학습 시스템', '4K 가상 크로마키 & 전자칠판 스튜디오', '오프라인 전문 교육 & 브랜드 PR 통합 솔루션'],
        currentKeywordIndex: 0,

        // [전체 포트폴리오 목록 - PORTFOLIO_DATA 상수로 100% 보장]
        portfolioItems: PORTFOLIO_DATA,
        studioImagesList: STUDIO_IMAGES,
        organizationDataList: ORGANIZATION_DATA,

        get filteredPortfolio() {
            if (this.refTab === 'all') return this.portfolioItems;
            return this.portfolioItems.filter(item => item.cat === this.refTab);
        },

        openModal(videoId, videoTitle) {
            this.activeVideoId = videoId;
            this.activeVideoTitle = videoTitle;
            this.videoModalOpen = true;
        },
        closeModal() {
            this.videoModalOpen = false;
            this.activeVideoId = '';
            this.activeVideoTitle = '';
        },
        openImageModal(imgUrl, title) {
            this.activeStudioImg = imgUrl;
            this.activeStudioTitle = title;
            this.imageModalOpen = true;
        },
        closeImageModal() {
            this.imageModalOpen = false;
            this.activeStudioImg = '';
            this.activeStudioTitle = '';
        },
        naverMapUrl: 'https://map.naver.com/p/search/%ED%9B%84%EB%AF%B8%EB%94%94%EC%96%B4/place/13314547',
        showMobileOrgModal: false,
        inquirySuccessModal: false,
        inquirySuccessMessage: '',
        inquirySubmitting: false,
        inquiryForm: {
            company: '',
            name: '',
            phone: '',
            category: '',
            message: '',
            consent: false
        },

        init() {
            try {
                setInterval(() => { this.currentKeywordIndex = (this.currentKeywordIndex + 1) % this.keywords.length; }, 2800);
                this.startServiceAutoPlay();
                this.startAboutAutoPlay();
                this.startStudioAutoPlay();
            } catch(e) {
                console.warn('Init non-blocking exception handled:', e);
            }
        },

        async submitInquiry() {
            if (!this.inquiryForm.company || !this.inquiryForm.name || !this.inquiryForm.phone || !this.inquiryForm.category || !this.inquiryForm.message) {
                alert('필수 문의 항목을 모두 작성해 주세요.');
                return;
            }
            if (!this.inquiryForm.consent) {
                alert('개인정보 수집 및 이용 동의에 체크해 주세요.');
                return;
            }
            this.inquirySubmitting = true;

            const createdAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

            // Dispatch to Express Backend (/api/inquiry)
            try {
                await fetch('/api/inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.inquiryForm)
                });
            } catch (err) {
                console.warn('Inquiry API dispatch fallback:', err);
            }

            // Direct client-side dispatch to FormSubmit API for target email list
            const targetEmails = ['whomedia03@gmail.com', 'james5183@naver.com', 'apark12321@gmail.com'];
            
            for (const email of targetEmails) {
                try {
                    await fetch('https://formsubmit.co/ajax/' + email, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json' 
                        },
                        body: JSON.stringify({
                            _subject: '[WHOMEDIA 신규 프로젝트 문의] ' + this.inquiryForm.company + ' - ' + this.inquiryForm.name + '님',
                            _template: 'table',
                            _captcha: 'false',
                            '기관/회사명': this.inquiryForm.company,
                            '담당자': this.inquiryForm.name,
                            '연락처': this.inquiryForm.phone,
                            '문의유형': this.inquiryForm.category,
                            '상세내용': this.inquiryForm.message,
                            '접수시각': createdAt
                        })
                    });
                } catch(e) {
                    console.warn('Client direct email dispatch exception for ' + email + ':', e);
                }
            }

            this.inquirySuccessMessage = '작성해주신 프로젝트/임대 문의가 담당자에게 성공적으로 접수되었습니다.';
            this.inquirySuccessModal = true;
            this.inquiryForm = { company: '', name: '', phone: '', category: '', message: '', consent: false };
            this.inquirySubmitting = false;
        },
        activeServiceIndex: 0,
        serviceAutoTimer: null,
        startServiceAutoPlay() {
            if (this.serviceAutoTimer) clearInterval(this.serviceAutoTimer);
            this.serviceAutoTimer = setInterval(() => {
                this.nextServiceCard();
            }, 3500);
        },
        stopServiceAutoPlay() {
            if (this.serviceAutoTimer) {
                clearInterval(this.serviceAutoTimer);
                this.serviceAutoTimer = null;
            }
        },
        nextServiceCard() {
            this.activeServiceIndex = (this.activeServiceIndex + 1) % 3;
            this.scrollToServiceCard();
        },
        prevServiceCard() {
            this.activeServiceIndex = (this.activeServiceIndex + 2) % 3;
            this.scrollToServiceCard();
        },
        selectServiceCard(index) {
            this.activeServiceIndex = index;
            this.scrollToServiceCard();
        },
        scrollToServiceCard() {
            const container = document.getElementById('services-cards-container');
            const targetCard = document.getElementById('service-card-' + this.activeServiceIndex);
            if (container && targetCard) {
                container.scrollTo({
                    left: targetCard.offsetLeft - container.offsetLeft - 16,
                    behavior: 'smooth'
                });
            }
        },
        aboutActiveIndex: 0,
        aboutAutoTimer: null,

        // [스튜디오 & 제작 환경 확장형 데이터 베이스 & 슬라이더 관리]
        activeStudioIndex: 0,
        studioAutoTimer: null,
        studioTouchStartX: 0,
        studioTouchEndX: 0,

        studioInfrastructure: [
            {
                id: 'smart_board_studio',
                tag: '전자칠판 스튜디오',
                tagColor: 'text-brand-mint border-brand-mint/30 bg-brand-mint/15',
                title: '86인치 UHD 스마트 전자칠판 스튜디오',
                imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'green_board_studio',
                tag: '녹색 칠판 스튜디오',
                tagColor: 'text-teal-300 border-teal-500/30 bg-teal-500/15',
                title: '특수 무반사 조명 판서 칠판 스튜디오',
                imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'chromakey_studio',
                tag: '크로마키 스튜디오',
                tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/15',
                title: '6.6m 대형 곡면 크로마키 세트',
                imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'camera_lighting',
                tag: '4K 방송 카메라 & 조명',
                tagColor: 'text-purple-400 border-purple-500/30 bg-purple-500/15',
                title: '4K 멀티 방송용 카메라 & 전문 조명 세팅',
                imageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'lecture_practice_studio',
                tag: '강의 및 실습 스튜디오',
                tagColor: 'text-blue-400 border-blue-500/30 bg-blue-500/15',
                title: '브랜딩 미디어 & 좌담회 촬영 세트',
                imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'control_room',
                tag: '방송용 부조정실',
                tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/15',
                title: '실시간 다채널 스위쳐 부조정실',
                imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'dressing_room',
                tag: '분장 & 대기실',
                tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/15',
                title: '출연진 프라이빗 분장실 & 파우더룸',
                imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
                thumbUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80'
            }
        ],

        startStudioAutoPlay() {
            if (this.studioAutoTimer) clearInterval(this.studioAutoTimer);
            this.studioAutoTimer = setInterval(() => {
                this.nextStudioSlide();
            }, 3800);
        },
        stopStudioAutoPlay() {
            if (this.studioAutoTimer) {
                clearInterval(this.studioAutoTimer);
                this.studioAutoTimer = null;
            }
        },
        nextStudioSlide() {
            if (!this.studioInfrastructure || this.studioInfrastructure.length === 0) return;
            this.activeStudioIndex = (this.activeStudioIndex + 1) % this.studioInfrastructure.length;
            this.scrollStudioThumbnail();
        },
        prevStudioSlide() {
            if (!this.studioInfrastructure || this.studioInfrastructure.length === 0) return;
            this.activeStudioIndex = (this.activeStudioIndex + this.studioInfrastructure.length - 1) % this.studioInfrastructure.length;
            this.scrollStudioThumbnail();
        },
        selectStudioSlide(index) {
            this.activeStudioIndex = index;
            this.scrollStudioThumbnail();
        },
        scrollStudioThumbnail() {
            const container = document.getElementById('studio-thumbs-container');
            const target = document.getElementById('studio-thumb-' + this.activeStudioIndex);
            if (container && target) {
                container.scrollTo({
                    left: target.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2),
                    behavior: 'smooth'
                });
            }
        },
        startAboutAutoPlay() {
            if (this.aboutAutoTimer) clearInterval(this.aboutAutoTimer);
            this.aboutAutoTimer = setInterval(() => {
                this.nextAboutCard();
            }, 4500);
        },
        stopAboutAutoPlay() {
            if (this.aboutAutoTimer) {
                clearInterval(this.aboutAutoTimer);
                this.aboutAutoTimer = null;
            }
        },
        nextAboutCard() {
            this.aboutActiveIndex = (this.aboutActiveIndex + 1) % 5;
            this.scrollToAboutCard();
        },
        prevAboutCard() {
            this.aboutActiveIndex = (this.aboutActiveIndex + 4) % 5;
            this.scrollToAboutCard();
        },
        selectAboutCard(index) {
            this.aboutActiveIndex = index;
            this.scrollToAboutCard();
        },
        scrollToAboutCard() {
            const container = document.getElementById('about-cards-container');
            const targetCard = document.getElementById('about-card-' + this.aboutActiveIndex);
            if (container && targetCard) {
                container.scrollTo({
                    left: targetCard.offsetLeft - container.offsetLeft - 16,
                    behavior: 'smooth'
                });
            }
        },
        loadMore() {
            this.portfolioLimit += 8;
        }
    }));
});
