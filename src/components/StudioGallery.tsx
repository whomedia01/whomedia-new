'use client';

import React, { useState, useEffect } from 'react';
import { StudioGalleryItem } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const STUDIO_IMAGES = [
  '/DSCF0173.jpg',
  '/DSCF0231.jpg',
  '/DSCF0189.jpg',
  '/DSCF0194.jpg',
  '/DSCF0142.jpg',
  '/DSCF0224.jpg',
  '/DSCF0243.jpg'
];

const FALLBACK_STUDIO_ITEMS: StudioGalleryItem[] = [
  {
    id: 'sg-1',
    title: '스튜디오 1 (86인치 4K 전자칠판)',
    tag: '전자칠판 스튜디오',
    url: '/DSCF0173.jpg',
    description: '86인치 4K UHD 전자칠판 및 최첨단 무반사 LED 조명 판서 세트'
  },
  {
    id: 'sg-2',
    title: '스튜디오 2 (대형 크로마키 세트)',
    tag: '크로마키 스튜디오',
    url: '/DSCF0231.jpg',
    description: '초대형 벽면 그린 스크린 가상 배경 크로마키 연출 세트'
  },
  {
    id: 'sg-3',
    title: '스튜디오 3 (무반사 블랙보드)',
    tag: '판서 스튜디오',
    url: '/DSCF0189.jpg',
    description: '5.6m x 4.0m 대형 아크릴/칠판 세트 및 방송용 프롬프터 인프라'
  },
  {
    id: 'sg-4',
    title: '4K 방송 스위칭 조정실',
    tag: '부조정실 / 편집실',
    url: '/DSCF0194.jpg',
    description: '실시간 4K 멀티 카메라 스위칭 및 음향 컨트롤 스위트'
  },
  {
    id: 'sg-5',
    title: '메이크업실 & 분장 휴게실',
    tag: '편의 시설',
    url: '/DSCF0142.jpg',
    description: '출연진 프라이빗 의상실, 메이크업 조명 파우더룸 및 대기실'
  },
  {
    id: 'sg-6',
    title: '스튜디오 4 (인터랙티브 세트)',
    tag: '멀티 강좌 스튜디오',
    url: '/DSCF0224.jpg',
    description: 'CG 모션 그래픽 및 태블릿 연동 모바일 에듀테크 스튜디오'
  },
  {
    id: 'sg-7',
    title: 'HOOMEDIA 메인 로비 & 라운지',
    tag: '메인 인프라',
    url: '/DSCF0243.jpg',
    description: '160평 전용 메인 입구 라운지 및 피팅 라운지'
  }
];

export const StudioGallery: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState<StudioGalleryItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const scrollToContact = () => {
    const elem = document.getElementById('contact');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const nextImage = () => {
    if (!activeItem) return;
    const idx = FALLBACK_STUDIO_ITEMS.findIndex(g => g.id === activeItem.id);
    const nextIdx = (idx + 1) % FALLBACK_STUDIO_ITEMS.length;
    setActiveItem(FALLBACK_STUDIO_ITEMS[nextIdx]);
  };

  const prevImage = () => {
    if (!activeItem) return;
    const idx = FALLBACK_STUDIO_ITEMS.findIndex(g => g.id === activeItem.id);
    const prevIdx = (idx - 1 + FALLBACK_STUDIO_ITEMS.length) % FALLBACK_STUDIO_ITEMS.length;
    setActiveItem(FALLBACK_STUDIO_ITEMS[prevIdx]);
  };

  return (
    <section id="gallery" className="h-[100dvh] min-h-[100dvh] snap-start snap-always flex-shrink-0 flex flex-col justify-center items-center py-12 sm:py-16 bg-slate-900 text-white border-b border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-wider uppercase bg-red-950/60 border border-red-800/40 px-3 py-1 rounded-full">
              STUDIO / RENT GALLERY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
              160평 최첨단 스튜디오 &amp; 제작 환경 갤러리
            </h2>
          </div>

          <button
            onClick={scrollToContact}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center space-x-2 shadow-lg flex-shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>스튜디오 임대 문의</span>
          </button>
        </div>

        {/* Studio Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {FALLBACK_STUDIO_ITEMS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 cursor-pointer aspect-video hover:border-red-500 transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.title}
                onError={(e) => {
                  // Fallback unsplash image if local DSCF image is not in public/
                  const fallbackUrls = [
                    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
                  ];
                  (e.target as HTMLImageElement).src = fallbackUrls[index % fallbackUrls.length];
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                {item.tag}
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate pr-2">
                  {item.title}
                </span>
                <span className="p-1 rounded-full bg-slate-800/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-2 rounded-full bg-slate-800/80"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-2 rounded-full bg-slate-800/80"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="relative aspect-video max-h-[70vh] bg-black">
              <img
                src={activeItem.url}
                alt={activeItem.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800">
              <div>
                <span className="text-xs font-bold text-red-400 bg-red-950 px-2.5 py-1 rounded border border-red-800/50">
                  {activeItem.tag}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{activeItem.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeItem.description}</p>
              </div>

              <button
                onClick={() => {
                  setActiveItem(null);
                  scrollToContact();
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                이 스튜디오 대여 문의
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
