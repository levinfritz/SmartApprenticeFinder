'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showPercentage?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
  if (score >= 60) return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
  if (score >= 40) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
  return 'bg-red-500/20 text-red-700 border-red-500/30';
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return '🎯';
  if (score >= 60) return '👍';
  if (score >= 40) return '👌';
  return '🤔';
};

const sizeVariants = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2'
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label,
  size = 'md',
  animated = true,
  showPercentage = true
}) => {
  const normalizedScore = Math.round(score * (score <= 1 ? 100 : 1));
  const colorClass = getScoreColor(normalizedScore);
  const icon = getScoreIcon(normalizedScore);

  const badgeContent = (
    <div className="flex items-center gap-1.5">
      <span>{icon}</span>
      <span>
        {label && `${label}: `}
        {normalizedScore}{showPercentage ? '%' : ''}
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
      >
        <Badge 
          className={cn(
            'font-medium transition-all duration-200',
            colorClass,
            sizeVariants[size]
          )}
        >
          {badgeContent}
        </Badge>
      </motion.div>
    );
  }

  return (
    <Badge 
      className={cn(
        'font-medium',
        colorClass,
        sizeVariants[size]
      )}
    >
      {badgeContent}
    </Badge>
  );
};

export default ScoreBadge;