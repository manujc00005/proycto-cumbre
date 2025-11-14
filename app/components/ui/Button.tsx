interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  onClick?: () => void;
}

export default function Button({ children, variant = 'primary', href, onClick }: ButtonProps) {
  const baseStyles = "px-8 py-4 rounded-lg font-semibold transition";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white",
    ghost: "text-orange-400 hover:text-orange-300"
  };

  const className = `${baseStyles} ${variants[variant]}`;

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}