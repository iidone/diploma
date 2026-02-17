import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <main className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Рекламная компания</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <ProductCard name="Вывеска неоновая" price={5000} />
        <ProductCard name="Печать баннера" price={1200} />
        <ProductCard name="Визитки (100 шт)" price={800} />
      </div>
    </main>
  );
}