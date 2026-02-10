import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Plus } from 'lucide-react';

const CreatableSelect = ({
    options = [],
    value,
    onChange,
    placeholder = "Sélectionner ou créer...",
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if search term is a new option
    const isNewOption = searchTerm.trim() !== '' &&
        !options.some(opt => opt.label.toLowerCase() === searchTerm.toLowerCase());

    // All options to display (filtered + new option if applicable)
    const displayOptions = isNewOption
        ? [...filteredOptions, { value: `__new__${searchTerm}`, label: searchTerm, isNew: true }]
        : filteredOptions;

    // Get selected option label
    const selectedOption = options.find(opt => opt.value === value);
    const selectedLabel = selectedOption ? selectedOption.label : '';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        if (isOpen && displayOptions.length > 0) {
            setHighlightedIndex(0);
        }
    }, [searchTerm, isOpen]);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < displayOptions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                e.preventDefault();
                if (displayOptions[highlightedIndex]) {
                    handleSelect(displayOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setSearchTerm('');
                break;
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Select Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={`w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-left flex items-center justify-between focus:ring-2 focus:ring-orange-500 outline-none transition-all ${disabled ? 'bg-slate-50 cursor-not-allowed' : 'bg-white hover:border-slate-300'
                    } ${isOpen ? 'ring-2 ring-orange-500 border-orange-500' : ''}`}
            >
                <span className={selectedLabel ? 'text-slate-900' : 'text-slate-400'}>
                    {selectedLabel || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {selectedLabel && !disabled && (
                        <X
                            size={14}
                            className="text-slate-400 hover:text-slate-600"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-100">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Rechercher ou créer..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            autoFocus
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {displayOptions.length > 0 ? (
                            displayOptions.map((option, index) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${index === highlightedIndex
                                            ? 'bg-orange-50 text-orange-700'
                                            : 'hover:bg-slate-50 text-slate-700'
                                        } ${option.value === value ? 'bg-orange-50 font-semibold' : ''}`}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    {option.isNew && (
                                        <Plus size={14} className="text-orange-500 flex-shrink-0" />
                                    )}
                                    <span className={option.isNew ? 'font-medium' : ''}>
                                        {option.isNew ? `Créer "${option.label}"` : option.label}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-sm text-slate-400">
                                Aucune option disponible
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatableSelect;
