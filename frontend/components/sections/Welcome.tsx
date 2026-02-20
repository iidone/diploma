export const Welcome = () => (
  <section id="welcome" className="h-screen bg-slate-800 rounded-4xl flex flex-col justify-center">
    <div className="select-none p-16">
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
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-6">
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
  </section>
);