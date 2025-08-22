'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Check, X } from 'lucide-react';
import { SwissLocation, searchLocations } from '@/data/swissLocations';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: SwissLocation | null) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "PLZ oder Ort eingeben...",
  label,
  required = false,
  error
}) => {
  const [suggestions, setSuggestions] = useState<SwissLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SwissLocation | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (value.length >= 2) {
      const results = searchLocations(value);
      setSuggestions(results.slice(0, 6)); // Limitiere auf 6 Vorschläge
      setShowSuggestions(true);
      
      // Check if current value exactly matches a location
      const exactMatch = results.find(loc => 
        `${loc.postalCode} ${loc.city}`.toLowerCase() === value.toLowerCase() ||
        loc.city.toLowerCase() === value.toLowerCase() ||
        loc.postalCode === value
      );
      
      if (exactMatch) {
        if (exactMatch !== selectedLocation) {
          setSelectedLocation(exactMatch);
          setIsValidLocation(true);
          onLocationSelect(exactMatch);
        }
      } else {
        // Only set invalid if we don't have a previously selected location that matches
        const currentValueMatchesSelected = selectedLocation && 
          `${selectedLocation.postalCode} ${selectedLocation.city}`.toLowerCase() === value.toLowerCase();
        
        if (!currentValueMatchesSelected) {
          setSelectedLocation(null);
          setIsValidLocation(false);
          onLocationSelect(null);
        }
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedLocation(null);
      setIsValidLocation(null);
      onLocationSelect(null);
    }
    
    setHighlightedIndex(-1);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (location: SwissLocation) => {
    const displayValue = `${location.postalCode} ${location.city}`;
    onChange(displayValue);
    setSelectedLocation(location);
    setIsValidLocation(true);
    onLocationSelect(location);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    
    // Force validation state update immediately
    setTimeout(() => {
      setIsValidLocation(true);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else if (suggestions.length === 1) {
          // Auto-select if only one suggestion
          handleSuggestionClick(suggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBlur = () => {
    // Verzögere das Schließen, damit Klicks auf Vorschläge noch funktionieren
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 200);
  };

  const getValidationIcon = () => {
    if (isValidLocation === true) {
      return <Check className="w-5 h-5 text-green-400" />;
    }
    if (isValidLocation === false && value.length >= 2) {
      return <X className="w-5 h-5 text-red-400" />;
    }
    return <Search className="w-5 h-5 text-white/50" />;
  };

  const getInputBorderClass = () => {
    if (error) return 'border-red-500/50 focus:ring-red-500/50';
    if (isValidLocation === true) return 'border-green-500/50 focus:ring-green-500/50';
    if (isValidLocation === false) return 'border-red-500/50 focus:ring-red-500/50';
    return 'border-white/20 focus:ring-blue-500/50';
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-white font-medium mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border-2 text-white 
            placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-200
            ${getInputBorderClass()}`}
          autoComplete="off"
        />
        
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {getValidationIcon()}
        </div>

        {/* Location Info */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <div className="flex items-center gap-2 text-xs text-white/70">
              <MapPin className="w-3 h-3" />
              <span>{selectedLocation.canton}</span>
              <span>•</span>
              <span>{selectedLocation.region}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}

      {/* Validation Message */}
      {isValidLocation === false && value.length >= 2 && !error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-2"
        >
          Bitte wähle einen gültigen Schweizer Ort aus
        </motion.p>
      )}

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 
              rounded-lg shadow-2xl max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {suggestions.map((location, index) => (
                <motion.button
                  key={`${location.postalCode}-${location.city}`}
                  ref={(el) => { suggestionRefs.current[index] = el; }}
                  type="button"
                  onClick={() => handleSuggestionClick(location)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-150 
                    ${highlightedIndex === index 
                      ? 'bg-blue-500/30 text-white' 
                      : 'text-white/90 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {location.postalCode} {location.city}
                      </div>
                      <div className="text-sm text-white/60">
                        {location.canton} • {location.region}
                        {location.majorCity && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-500/20 rounded text-xs">
                            Hauptstadt
                          </span>
                        )}
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                  </div>
                </motion.button>
              ))}
              
              {value.length >= 2 && suggestions.length === 0 && (
                <div className="p-4 text-center text-white/60">
                  Keine passenden Orte gefunden
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationAutocomplete;