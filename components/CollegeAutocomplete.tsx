'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Loader2 } from 'lucide-react';

interface CollegeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

export default function CollegeAutocomplete({
  value,
  onChange,
  placeholder = "College/University Name",
  className = "",
  inputClassName,
  required = false
}: CollegeAutocompleteProps) {
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [collegeSearchLoading, setCollegeSearchLoading] = useState(false);
  const [showAddCollegeOption, setShowAddCollegeOption] = useState(false);
  const [addingCollege, setAddingCollege] = useState(false);
  const [status, setStatus] = useState('');
  const collegeContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside college suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        collegeContainerRef.current &&
        !collegeContainerRef.current.contains(event.target as Node)
      ) {
        setShowCollegeSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle college name input and search
  const handleCollegeNameChange = async (inputValue: string) => {
    onChange(inputValue);
    setShowAddCollegeOption(false);
    setStatus('');

    if (inputValue.length >= 2) {
      setCollegeSearchLoading(true);
      try {
        const response = await fetch(`/api/colleges/search?q=${encodeURIComponent(inputValue)}`);
        const data = await response.json();

        if (data.colleges && data.colleges.length > 0) {
          setCollegeSuggestions(data.colleges);
          setShowCollegeSuggestions(true);
          setShowAddCollegeOption(false);
        } else {
          setCollegeSuggestions([]);
          setShowCollegeSuggestions(false);
          setShowAddCollegeOption(inputValue.length >= 3); // Show "Add college" option if no results and name is long enough
        }
      } catch (error) {
        console.error('Error searching colleges:', error);
        setCollegeSuggestions([]);
        setShowCollegeSuggestions(false);
        setShowAddCollegeOption(inputValue.length >= 3);
      } finally {
        setCollegeSearchLoading(false);
      }
    } else {
      setCollegeSuggestions([]);
      setShowCollegeSuggestions(false);
      setShowAddCollegeOption(false);
    }
  };

  // Handle college suggestion selection
  const handleCollegeSuggestionClick = (college: string) => {
    onChange(college);
    setCollegeSuggestions([]);
    setShowCollegeSuggestions(false);
    setShowAddCollegeOption(false);
    setStatus('');
  };

  // Handle adding a new college
  const handleAddNewCollege = async () => {
    if (!value.trim() || value.trim().length < 3) {
      setStatus('❌ College name must be at least 3 characters long');
      return;
    }

    setAddingCollege(true);
    setStatus('Adding your college to our database...');

    try {
      const response = await fetch('/api/colleges/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeName: value.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.existed) {
          setStatus('✅ College found and selected!');
          onChange(data.collegeName);
        } else {
          setStatus('✅ College added successfully! Other users can now find it too.');
        }
        setShowAddCollegeOption(false);
        setShowCollegeSuggestions(false);
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding college:', error);
      setStatus('❌ Failed to add college. Please try again.');
    } finally {
      setAddingCollege(false);
    }
  };

  return (
    <div ref={collegeContainerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleCollegeNameChange(e.target.value)}
          onFocus={() => {
            if (collegeSuggestions.length > 0) {
              setShowCollegeSuggestions(true);
            }
          }}
          required={required}
          className={inputClassName || "w-full px-4 py-3 rounded-xl bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow placeholder-[#a78bfa] font-medium transition pr-10"}
        />
        {collegeSearchLoading ? (
          <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />
        ) : (
          <GraduationCap size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
        )}
      </div>

      {/* College Suggestions Dropdown */}
      {showCollegeSuggestions && collegeSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl z-50 max-h-60 overflow-y-auto mt-2 border-2 border-[#E0D5FA]"
        >
          {collegeSuggestions.map((college, index) => (
            <div
              key={index}
              className="px-5 py-3 hover:bg-[#E0D5FA] cursor-pointer transition-colors text-[#23185B] font-medium border-b border-gray-100 last:border-b-0"
              onClick={() => handleCollegeSuggestionClick(college)}
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-[#5B3DF6]" />
                <span className="text-sm">{college}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Add College Option */}
      {showAddCollegeOption && value.trim().length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl z-50 mt-2 border-2 border-[#E0D5FA]"
        >
          <div className="p-4">
            <p className="text-sm text-[#7c689c] mb-3 text-center">
              Can't find your college? You can add it to our database!
            </p>
            <button
              onClick={handleAddNewCollege}
              disabled={addingCollege}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {addingCollege ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding College...
                </>
              ) : (
                <>
                  <GraduationCap size={16} />
                  Add "{value.trim()}" to Database
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Status Message */}
      {status && (
        <motion.p
          className={`mt-2 text-sm font-semibold ${
            status.startsWith('✅')
              ? 'text-green-500'
              : status.startsWith('❌')
              ? 'text-red-500'
              : 'text-[#a78bfa]'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {status}
        </motion.p>
      )}
    </div>
  );
}