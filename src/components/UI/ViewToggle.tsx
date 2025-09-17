'use client';

import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-white border border-border-gray rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`
          p-2 rounded transition-colors
          ${view === 'grid' 
            ? 'bg-primary-green text-white' 
            : 'text-text-gray hover:text-primary-green'
          }
        `}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`
          p-2 rounded transition-colors
          ${view === 'list' 
            ? 'bg-primary-green text-white' 
            : 'text-text-gray hover:text-primary-green'
          }
        `}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}