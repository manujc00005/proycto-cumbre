import Card from './ui/Card';
import Section from './ui/Section';

const products = [
  { name: "Camiseta técnica Proyecto Cumbre", desc: "Material transpirable de secado rápido", price: "35" },
  { name: "Sudadera premium", desc: "Algodón orgánico con logo bordado", price: "55" },
  { name: "Gorra outdoor", desc: "Protección UV con diseño minimalista", price: "25" },
  { name: "Buff multifunción", desc: "Perfecto para alta montaña", price: "18" },
  { name: "Botella térmica", desc: "Mantiene 24h frío / 12h caliente", price: "32" },
  { name: "Mochila técnica 20L", desc: "Ligera y resistente para rutas de un día", price: "85" }
];

export default function Merchant() {
  return (
    <Section id="merchant">
      <h2 className="text-4xl font-bold mb-4">Merchant</h2>
      <p className="text-zinc-400 mb-12">
        Merchandising exclusivo del club para miembros y amigos de Proyecto Cumbre.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product, i) => (
          <Card key={i} hover className="overflow-hidden p-0">
            <div className="h-64 bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-600">[Imagen producto]</span>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-zinc-400">{product.desc}</p>
              <p className="text-xs text-zinc-500">Tallas: S, M, L, XL</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-2xl font-bold text-orange-400">{product.price} €</span>
                <button className="text-sm text-zinc-400 hover:text-orange-400 transition">
                  Más info →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}