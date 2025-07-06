import React, { useState } from 'react';
import { useBoard } from '../contexts/BoardContext';
import ListComponent from './ListComponent';
import { Plus } from 'lucide-react';

const BoardView: React.FC = () => {
  const { currentBoard, createList } = useBoard();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  if (!currentBoard) return null;

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      createList(currentBoard.id, newListTitle.trim());
      setNewListTitle('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-full">
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {currentBoard.lists.map((list) => (
            <ListComponent key={list.id} list={list} />
          ))}
          
          {/* Add List Form */}
          <div className="flex-shrink-0 w-72">
            {showCreateForm ? (
              <div className="bg-white rounded-xl shadow-md p-4">
                <form onSubmit={handleCreateList}>
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add List
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-white bg-opacity-80 hover:bg-opacity-100 rounded-xl shadow-md p-4 flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors min-h-16"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add another list</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;