"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";

interface PortfolioItem {
  id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
}

export const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sliderInstance = useRef<any>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch("/api/v1/portfolio_and_services/portfolio");
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }
        const data = await response.json();
        setPortfolioItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (!sliderRef.current || portfolioItems.length === 0) return;

    sliderInstance.current = new KeenSlider(sliderRef.current, {
      loop: true,
      slides: {
        perView: 5,
        spacing: 10,
      },
      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1, spacing: 10 },
        },
        "(max-width: 1024px)": {
          slides: { perView: 3, spacing: 10 },
        },
      },
    });

    return () => {
      if (sliderInstance.current) {
        sliderInstance.current.destroy();
      }
    };
  }, [portfolioItems.length]);

  const handleCardClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 300);
  };

  if (loading) {
    return (
      <section id="portfolio" className="min-h-screen bg-slate-400/95 rounded-4xl flex items-center justify-center">
        <div className="text-white text-2xl font-light">Загрузка...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="min-h-screen bg-slate-400/95 rounded-4xl flex items-center justify-center">
        <div className="text-red-300 text-xl">Ошибка: {error}</div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <section id="portfolio" className="min-h-screen bg-slate-400/95 rounded-4xl flex items-center justify-center">
        <div className="text-white text-xl">Пока нет работ в портфолио</div>
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-4xl relative overflow-hidden select-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative z-10 pt-12 pb-8 text-center">
          <h2 className="text-5xl select-none md:text-6xl font-bold text-white tracking-wider uppercase drop-shadow-lg">
            Наши <span className="text-amber-400">Работы</span>
          </h2>
          <p className="text-slate-300 mt-4 text-lg select-none font-light">Все наши клиенты остаются довольными.</p>
        </div>

        <div className="relative z-20 flex items-center justify-center px-4 md:px-20">
          <button
            onClick={() => sliderInstance.current?.prev()}
            className="absolute cursor-pointer left-0 md:left-4 z-30 w-12 h-12 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all duration-300"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={sliderRef}
            className="keen-slider flex items-center justify-center py-8 w-[70%] md:w-[50%] overflow-visible"
            style={{ minHeight: "500px" }}
          >
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="keen-slider__slide flex-shrink-0 select-none cursor-pointer"
                style={{
                  width: "20%",
                  minWidth: "180px",
                  height: "420px",
                }}
                onClick={() => handleCardClick(item)}
              >
                <PortfolioCard item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => sliderInstance.current?.next()}
            className="absolute cursor-pointer right-0 md:right-4 z-30 w-12 h-12 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all duration-300"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {selectedItem && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md ${
            isClosing ? 'animate-fade-out' : 'animate-fade-in'
          }`}
          onClick={closeModal}
        >
          <button 
            className="absolute cursor-pointer top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all z-10"
            onClick={closeModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className={`max-w-[95vw] max-h-[95vh] relative ${
              isClosing ? 'animate-scale-out' : 'animate-scale-in'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.photo_url ? `/api${selectedItem.photo_url}` : "/images/paper-texture.jpg"}
              alt={selectedItem.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <h3 className="text-3xl font-bold text-white mb-2">{selectedItem.name}</h3>
              {selectedItem.description && (
                <p className="text-slate-300">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PortfolioCard = ({ item }: { item: PortfolioItem }) => {
  const imageSrc = item.photo_url ? `/api${item.photo_url}` : "/images/paper-texture.jpg";

  return (
    <div
      className="group relative overflow-hidden rounded-3xl transition-all duration-500 shadow-xl w-full h-full select-none hover:shadow-2xl hover:shadow-amber-400/30"
    >
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <img 
          src={imageSrc} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 select-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 select-none opacity-60 group-hover:opacity-30" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 select-none">
        <h3 className="text-white mb-1 transition-all duration-500 select-none text-lg md:text-xl font-bold group-hover:-translate-y-2">
          {item.name}
        </h3>
        
        {item.description && (
          <p className="text-slate-300 text-xs line-clamp-2 transform translate-y-0 transition-all duration-500 delay-75 group-hover:-translate-y-2 select-none">
            {item.description}
          </p>
        )}

        <div className="mt-2 md:mt-3 opacity-0 transform translate-y-4 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0 select-none">
          <span className="inline-flex items-center gap-2 text-amber-400 font-medium text-xs md:text-sm select-none">
            Нажмите для просмотра
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </span>
        </div>
      </div>

      <div className="absolute inset-0 border-2 rounded-3xl transition-all duration-500 select-none border-white/0 group-hover:border-amber-400/50" />
    </div>
  );
};

export default Portfolio;
