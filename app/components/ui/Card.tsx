interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div className={`
      bg-zinc-900 rounded-xl p-6 border border-zinc-800
      ${hover ? 'hover:border-orange-500 transition group' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}