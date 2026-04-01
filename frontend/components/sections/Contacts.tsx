"use client";

import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

export const Contacts = () => {
  const defaultCoords = [55.7558, 37.6173];

  return (
    <section id="contacts" className="min-h-screen bg-gradient-to-br from-slate-500/95 via-slate-400/95 to-slate-300/95 rounded-4xl relative overflow-hidden select-none py-12 md:py-20">
      <div className="relative z-10 text-center mb-16 md:mb-24 px-4">
        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-wider uppercase drop-shadow-2xl mb-6">
          <span className="text-slate-200">Свяжитесь</span> <span className="text-amber-400">с нами</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed">
          Готовы обсудить ваш проект? Оставьте заявку или позвоните!
        </p>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-16 md:mb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="group">
              <div className="flex items-center gap-4 mb-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-500 hover:bg-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-400/20 rounded-xl flex items-center justify-center backdrop-blur-sm border-2 border-amber-400/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">Телефон</h3>
                  <a href="tel:+79001234567" className="text-amber-300 hover:text-amber-200 text-lg md:text-xl font-semibold transition-colors block">+7 (900) 123-45-67</a>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center gap-4 mb-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-500 hover:bg-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-400/20 rounded-xl flex items-center justify-center backdrop-blur-sm border-2 border-amber-400/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-.4-7.946 4 4 0 00-.3 7.947z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">Email</h3>
                  <a href="mailto:info@craftsigns.ru" className="text-amber-300 hover:text-amber-200 text-lg md:text-xl font-semibold transition-colors block">info@craftsigns.ru</a>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-500 hover:bg-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-400/20 rounded-xl flex items-center justify-center backdrop-blur-sm border-2 border-amber-400/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">Адрес</h3>
                  <p className="text-slate-200 text-lg md:text-xl font-semibold">г. Москва, ул. Пушкина, д. 1</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-white font-bold text-xl mb-6">Мы в соцсетях</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 hover:bg-amber-400/20 border border-white/20 hover:border-amber-400/50 backdrop-blur-sm flex items-center justify-center text-white hover:text-amber-400 transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 hover:bg-amber-400/20 border border-white/20 hover:border-amber-400/50 backdrop-blur-sm flex items-center justify-center text-white hover:text-amber-400 transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.002z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 hover:bg-amber-400/20 border border-white/20 hover:border-amber-400/50 backdrop-blur-sm flex items-center justify-center text-white hover:text-amber-400 transition-all duration-300 hover:scale-110">
                  TG
                </a>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="p-8 md:p-12 bg-white/5 backdrop-blur-md rounded-3xl border-2 border-white/10 hover:border-amber-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-400/20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Оставить заявку</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Ваше имя" className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:border-amber-400 focus:outline-none transition-all duration-300 text-lg" />
                <input type="tel" placeholder="+7 (___) ___-__-__" className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:border-amber-400 focus:outline-none transition-all duration-300 text-lg" />
                <textarea placeholder="Расскажите о проекте" rows={4} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:border-amber-400 focus:outline-none transition-all duration-300 resize-vertical text-lg" />
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/50 transform hover:-translate-y-1">
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">Наше расположение</h3>
        <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 backdrop-blur-sm bg-gradient-to-b from-white/5 to-transparent">
          <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY || "demo" }}>
            <Map 
              state={{ center: defaultCoords, zoom: 12 }} 
              modules={["templateLayoutFactory"]}
              className="w-full h-full rounded-2xl"
            >
              <Placemark 
                geometry={defaultCoords}
                properties={{
                  iconCaption: "CraftSigns",
                  hintContent: "Офис CraftSigns",
                  balloonContent: "CraftSigns<br/>г. Москва, ул. Пушкина, д. 1<br/>Звоните: +7 (900) 123-45-67"
                }}
                options={{
                  preset: "islands#icon",
                  iconColor: "#FBBF24"
                }}
              />
            </Map>
          </YMaps>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
    </section>
  );
};
