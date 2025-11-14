
import React from 'react';
import { PlusIcon } from './icons';

interface HeaderProps {
  onAddSpace: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddSpace }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary-600">Event Space Tracker</h1>
          <button
            onClick={onAddSpace}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Space
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
   