import Button from './ui/Button';

export default function Hero() {
  return (
    <section id="inicio" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950 opacity-50"></div>
      
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            PROYECTO<br />CUMBRE
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            Club de montaña, vivacs y grandes rutas diseñado para quienes buscan algo más que llegar a la cima.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary">
              Únete al club
            </Button>
            <Button variant="ghost" href="#aventuras">
              Ver próximas aventuras →
            </Button>
          </div>
        </div>

        <div className="relative h-[500px] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-zinc-600">[Imagen: Silueta de montañistas]</span>
          </div>
        </div>
      </div>
    </section>
  );
}