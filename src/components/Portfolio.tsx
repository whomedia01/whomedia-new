import React, { useState } from 'react';
import { PortfolioCategory, PortfolioItem } from '../types';
import { Play, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PORTFOLIO_CATEGORIES: { id: PortfolioCategory; name: string }[] = [
  { id: 'all', name: '전체 (All)' },
  { id: 'production', name: '4K 미디어 프로덕션' },
  { id: 'edu', name: '교육 콘텐츠 & 컨설팅' },
  { id: 'press', name: '디지털 언론 & PR' },
  { id: 'hucampus', name: '후캠퍼스 평생교육' },
];

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: '0kHSItVXKOU',
    title: '능률 고등 영어 교재 연계 스마트 강좌',
    cat: 'edu',
    tag: 'NE능률',
    label: '이러닝 콘텐츠 개발',
    duration: '04:30',
    year: '2024',
    description: 'NE능률 고등 영어 교재 연계 스마트 이러닝 강좌 프로덕션 및 고화질 마스터링',
    imageUrl: 'https://img.youtube.com/vi/0kHSItVXKOU/hqdefault.jpg'
  },
  {
    id: '6xb2GYInARg',
    title: '능률 중등 영어 맞춤형 학습 영상',
    cat: 'edu',
    tag: 'NE능률',
    label: '교육 콘텐츠',
    duration: '03:45',
    year: '2024',
    description: 'NE능률 중등 영어 교과 과정 맞춤형 인터랙티브 학습 영상 제작 및 교수설계',
    imageUrl: 'https://img.youtube.com/vi/6xb2GYInARg/hqdefault.jpg'
  },
  {
    id: 'rJ2U9T27WwU',
    title: '태진옥 브랜드 브랜딩 홍보영상',
    cat: 'production',
    tag: '태진옥',
    label: '홍보 영상 제작',
    duration: '02:50',
    year: '2024',
    description: '브랜드 가치 제고를 위한 시네마틱 4K 기업 및 스토어 시그니처 홍보 영상',
    imageUrl: 'https://img.youtube.com/vi/rJ2U9T27WwU/hqdefault.jpg'
  },
  {
    id: 'PTqpVR-yIKg',
    title: '경희사이버대학교 가상 크로마키 강좌',
    cat: 'production',
    tag: '경희사이버대학교',
    label: '크로마키 스튜디오',
    duration: '05:15',
    year: '2024',
    description: '경희사이버대학교 전용 가상 크로마키 세트 활용 고품질 대학 강의 프로덕션',
    imageUrl: 'https://img.youtube.com/vi/PTqpVR-yIKg/hqdefault.jpg'
  },
  {
    id: 'AbeWeusmjws',
    title: '86인치 4K 전자칠판 스마트 강의 스튜디오',
    cat: 'production',
    tag: 'WHOMEDIA 스튜디오',
    label: '전자칠판 강의',
    duration: '04:10',
    year: '2024',
    description: '86인치 4K UHD 전자칠판 및 최신 판서 시스템을 적용한 스마트 강좌 촬영',
    imageUrl: 'https://img.youtube.com/vi/AbeWeusmjws/hqdefault.jpg'
  },
  {
    id: 'PVVdU-CYowA',
    title: '웅진 스마트학습 연계 디지털 교재 강의',
    cat: 'edu',
    tag: '웅진',
    label: '이러닝 콘텐츠',
    duration: '03:55',
    year: '2024',
    description: '웅진 스마트학습 연계 86인치 전자칠판 활용 디지털 교재 동영상 강의 제작',
    imageUrl: 'https://img.youtube.com/vi/PVVdU-CYowA/hqdefault.jpg'
  },
  {
    id: 'PxAZYrpdowU',
    title: '웅진 블랙보드 세트 무반사 강의',
    cat: 'edu',
    tag: '웅진',
    label: '오프라인 교육/판서',
    duration: '04:05',
    year: '2024',
    description: '웅진 에듀테크 특수 무반사 블랙보드 세트 기반 프리미엄 강좌 시각화 구현',
    imageUrl: 'https://img.youtube.com/vi/PxAZYrpdowU/hqdefault.jpg'
  },
  {
    id: 'x4Cb5At6Z_M',
    title: '실시간 CG 인터랙티브 스마트 모션 강의',
    cat: 'production',
    tag: '인터랙티브 미디어',
    label: 'CG/인터랙티브',
    duration: '03:30',
    year: '2024',
    description: '실시간 CG 모션 그래픽 및 인터랙티브 효과를 결합한 차세대 학습 몰입형 강의',
    imageUrl: 'https://img.youtube.com/vi/x4Cb5At6Z_M/hqdefault.jpg'
  },
  {
    id: 'JwCrB4dKgDU',
    title: '후캠퍼스 모바일 태블릿 스마트 에듀 강의',
    cat: 'hucampus',
    tag: '후캠퍼스 평생교육원',
    label: '태블릿강의/평생교육',
    duration: '03:15',
    year: '2024',
    description: '고해상도 태블릿 판서 및 디지털 에듀테크 솔루션 결합 모바일 최적화 강의',
    imageUrl: 'https://img.youtube.com/vi/JwCrB4dKgDU/hqdefault.jpg'
  },
  {
    id: '-Is7q7qD9Rc',
    title: '한국AI교육신문 & 뉴미디어 PR 브랜딩',
    cat: 'press',
    tag: '한국AI교육신문',
    label: '디지털 언론 PR',
    duration: '00:45',
    year: '2024',
    description: '유튜브 뉴미디어 및 언론 포털 브랜딩 강화를 위한 트렌디한 시그니처 오프닝 및 PR',
    imageUrl: 'https://img.youtube.com/vi/-Is7q7qD9Rc/hqdefault.jpg'
  }
];

export const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PortfolioCategory>('all');
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredItems = activeTab === 'all' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.cat === activeTab);

  const displayedItems = filteredItems.slice(0, visibleCount);

  return (
    <section id="portfolio" className="h-[100dvh] min-h-[100dvh] snap-start snap-always flex-shrink-0 flex flex-col justify-center items-center py-12 sm:py-16 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 shadow-2xs">
            PORTFOLIO
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-3">
            콘텐츠 개발 &amp; 통합 미디어 포트폴리오
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            교육 컨설팅부터 4K 미디어 프로덕션, 후캠퍼스 평생교육, 디지털 언론 PR까지 (주)후미디어의 주요 수행 사례입니다.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`tab-${cat.id}`}
              onClick={() => {
                setActiveTab(cat.id);
                setVisibleCount(8);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Cards with Fade In/Out Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => setSelectedVideo(item)}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={item.imageUrl || `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                      alt={item.title}
                      onError={(e) => {
                        // Fallback image if youtube thumbnail fails
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    {/* Category Tag Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {item.label}
                    </div>

                    {/* Client Tag */}
                    <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {item.tag}
                    </div>

                    {/* Play Button Icon Overlay */}
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100/80">
                  <span className="font-semibold text-slate-700">{item.tag}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{item.duration || '03:30'}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {visibleCount < filteredItems.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + 4)}
              className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-full transition-colors border border-slate-300 shadow-xs"
            >
              <span>더보기</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {selectedVideo.label}
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {selectedVideo.description && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-white mb-1">고객사: {selectedVideo.tag}</p>
                <p>{selectedVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
