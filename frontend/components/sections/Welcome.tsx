import Link from "next/link";

export const Welcome = () => (
  <section id="welcome" className="h-screen-2 bg-slate-800/90 rounded-4xl flex flex-col justify-center">
    <div className="select-none p-16 flex gap-12">
      <div className="flex-1">
        <div className="flex items-center gap-0 group cursor-default">
          <h1 className="font-bold text-slate-400 text-6xl transition-colors duration-300 group-hover:text-slate-500">
            CRAFT
          </h1>
          <h1 className="font-bold text-white text-6xl transition-colors duration-300 group-hover:text-slate-300">
            SIGNS
          </h1>
        </div>

        <div className="max-w-3xl my-6">
          <p className="text-xl text-slate-300 leading-relaxed">
            Мы — рекламная производственная компания <span className="text-white font-medium">CraftSigns</span>, 
            которая изготавливает красивые баннеры, объёмные буквы, неоновые вывески и многое другое.
          </p>
        </div>

        <div className="max-w-4xl mt-10">
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
            ПОЧЕМУ ИМЕННО МЫ:
          </p>

          <ul className="grid grid-cols-2 gap-y-6 gap-x-12">
            {[
              "Надежность и качество",
              "Быстрое выполнение заказов",
              "Приятная и доступная цена",
              "Уважительное отношение к клиентам"
            ].map((text, index) => (
              <li key={index} className="flex items-center gap-3 text-white text-lg">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mr-30">
        <Link 
          href="#services" 
          className="px-8 py-4 bg-yellow-500 hover:bg-yellow-300 hover:scale-102 text-slate-900 font-bold text-lg rounded-lg transition-all duration-300 shadow-[0_4px_15px_rgba(250,204,21,0.4)]"
        >
          Посмотреть услуги
        </Link>
      </div>
    </div>
  </section>
);
