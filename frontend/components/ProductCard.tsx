interface ProductProps {
  name: string;
  price: number;
}

export const ProductCard = ({ name, price }: ProductProps) => {
  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm hover:border-blue-500 transition-colors">
      <h3 className="text-lg font-medium text-slate-900">{name}</h3>
      <p className="text-blue-600 font-bold">{price} ₽</p>
      <button className="mt-3 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800">
        Заказать
      </button>
    </div>
  );
};