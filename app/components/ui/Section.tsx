interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function Section({ id, children, className = "", dark = false }: SectionProps) {
  return (
    <section 
      id={id} 
      className={`py-24 ${dark ? 'bg-zinc-900/50' : ''} ${className}`}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}