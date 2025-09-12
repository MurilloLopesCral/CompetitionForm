import React from "react";

interface SuggestionsListProps {
    items: string[];
    onSelect: (value: string) => void;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
    items,
    onSelect
}) => {
    if (!items.length) return null;
    return (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl">
            {items.map((item) => (
                <li
                    key={item}
                    className="px-3 py-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                    }}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
};

