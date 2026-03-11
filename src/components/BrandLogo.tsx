import React from 'react';
import { ElementType } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  showSubtitle?: boolean;
  className?: string;
  as?: ElementType;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  color = 'currentColor',
  showSubtitle = true,
  className = '',
  as: Component = 'div'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const BrandName = () => (
    <span className="brand-main">
      <span className="letter-a">A</span>
      Y SECR<span className="letter-e">E</span>T
    </span>
  );

  const Subtitle = () => (
    <span className="brand-subtitle">skin & beauty</span>
  );

  return (
    <Component 
      className={`brand-logo ${sizeClasses[size]} ${className}`}
      style={{ color }}
    >
      <BrandName />
      {showSubtitle && <Subtitle />}
    </Component>
  );
};

export default BrandLogo;
