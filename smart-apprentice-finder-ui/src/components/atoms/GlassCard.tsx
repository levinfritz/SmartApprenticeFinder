'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
  float?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

const variants = {
  default: 'glass',
  strong: 'glass-strong', 
  subtle: 'bg-white/5 backdrop-blur-md border border-white/10'
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  float = false,
  gradient = false,
  onClick
}) => {
  const cardClass = cn(
    'rounded-xl transition-all duration-300',
    variants[variant],
    {
      'hover-lift cursor-pointer': hover && onClick,
      'hover:shadow-2xl hover:scale-[1.02]': hover && !onClick,
      'float': float,
      'shimmer': gradient
    },
    className
  );

  if (onClick) {
    return (
      <motion.div
        className={cardClass}
        onClick={onClick}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;