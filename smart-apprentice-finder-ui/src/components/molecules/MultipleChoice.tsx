'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

interface MultipleChoiceProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  title: string;
  subtitle?: string;
  maxSelections?: number;
  minSelections?: number;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  options,
  selectedValues,
  onChange,
  title,
  subtitle,
  maxSelections,
  minSelections = 0
}) => {
  const handleToggle = (optionId: string) => {
    const isSelected = selectedValues.includes(optionId);
    
    if (isSelected) {
      // Remove selection (but check minimum)
      const newValues = selectedValues.filter(id => id !== optionId);
      if (newValues.length >= minSelections) {
        onChange(newValues);
      }
    } else {
      // Add selection (but check maximum)
      if (!maxSelections || selectedValues.length < maxSelections) {
        onChange([...selectedValues, optionId]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        {subtitle && (
          <p className="text-white/70">
            {subtitle}
            {maxSelections && ` (Max. ${maxSelections} Auswahlen)`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.id);
          const isDisabled = !isSelected && maxSelections && selectedValues.length >= maxSelections;
          
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => !isDisabled && handleToggle(option.id)}
              disabled={isDisabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`
                relative p-4 rounded-lg border transition-all duration-200 text-left
                ${isSelected 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-3">
                {option.icon && (
                  <span className="text-2xl flex-shrink-0">{option.icon}</span>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{option.label}</h4>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  
                  {option.description && (
                    <p className="text-white/70 text-sm mt-1">{option.description}</p>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedValues.length > 0 && (
        <div className="text-center text-white/60 text-sm">
          {selectedValues.length} von {maxSelections || options.length} ausgewählt
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;