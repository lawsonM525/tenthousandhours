import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'text-white',
    secondary: 'text-[var(--text-primary)] border border-[var(--border-subtle)]',
    ghost: 'text-[var(--text-primary)]',
    danger: 'text-white',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const bgStyles = {
    primary: { background: 'var(--cta-pink)' },
    secondary: { background: 'var(--bg-elevated)' },
    ghost: { background: 'transparent' },
    danger: { background: 'var(--danger)' },
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={bgStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
