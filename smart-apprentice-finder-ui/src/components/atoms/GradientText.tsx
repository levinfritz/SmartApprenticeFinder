'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
  animate?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const gradientVariants = {
  primary: 'text-gradient-primary',
  secondary: 'text-gradient-secondary', 
  success: 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
};

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  variant = 'primary',
  animate = false,
  as: Component = 'span'
}) => {
  const textClass = cn(
    'font-bold',
    gradientVariants[variant],
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Component className={textClass}>
          {children}
        </Component>
      </motion.div>
    );
  }

  return (
    <Component className={textClass}>
      {children}
    </Component>
  );
};

export default GradientText;