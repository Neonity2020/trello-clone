import React, { useState } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { Plus, MoreHorizontal, Calendar, Trash2, Edit2 } from 'lucide-react';

const BoardList: React.FC = () => {
  const { boards, createBoard, updateBoard, deleteBoard, setCurrentBoard } = useBoard();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle.trim(), newBoardDescription.trim());
      setNewBoardTitle('');
      setNewBoardDescription('');
      setShowCreateForm(false);
    }
  };

  const handleEditBoard = (board: any) => {
    setEditingBoard(board.id);
    setEditTitle(board.title);
    setEditDescription(board.description || '');
  };

  const handleUpdateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBoard && editTitle.trim()) {
      updateBoard(editingBoard, {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditingBoard(null);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      deleteBoard(boardId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Boards</h1>
          <p className="text-gray-600">Organize your projects and tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div key={board.id} className="group relative">
              <div
                onClick={() => setCurrentBoard(board)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 h-40 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {board.title}
                  </h3>
                  {board.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {board.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>{board.lists.length} lists</span>
                </div>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = e.currentTarget.nextElementSibling as HTMLElement;
                      menu.classList.toggle('hidden');
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-32 z-10 hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBoard(board);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create Board Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-40 flex items-center justify-center border-2 border-dashed border-gray-300">
            {showCreateForm ? (
              <form onSubmit={handleCreateBoard} className="w-full">
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Board title"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="Board description (optional)"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex flex-col items-center space-y-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm font-medium">Create New Board</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit Board Modal */}
        {editingBoard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Board</h3>
              <form onSubmit={handleUpdateBoard}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBoard(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardList;