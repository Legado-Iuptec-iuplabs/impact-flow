import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#FDB913] text-[#0A0F14] hover:bg-[#FDB913]/90 shadow-lg shadow-[#FDB913]/10',
    secondary: 'bg-[#2DD4BF] text-[#0A0F14] hover:bg-[#2DD4BF]/90',
    outline: 'bg-transparent border border-[#2DD4BF] text-[#2DD4BF] hover:bg-[#2DD4BF]/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mx-auto"></div>
      ) : (
        children
      )}
    </button>
  );
};