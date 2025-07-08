import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { useBoard } from '../contexts/useBoard';
import { LogOut, User, ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentBoard, setCurrentBoard } = useBoard();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {currentBoard && (
              <button
                onClick={() => setCurrentBoard(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Boards</span>
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {currentBoard ? currentBoard.title : 'Trello Clone'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 hidden sm:inline">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;