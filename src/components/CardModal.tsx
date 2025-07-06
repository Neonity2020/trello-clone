import React, { useState } from 'react';
import { useBoard, Card, ChecklistItem } from '../contexts/BoardContext';
import { X, Calendar, Tag, CheckSquare, MessageCircle, Plus, Trash2 } from 'lucide-react';

interface CardModalProps {
  card: Card;
  listId: string;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, listId, onClose }) => {
  const { updateCard, deleteCard } = useBoard();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [newLabel, setNewLabel] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    updateCard(card.id, {
      title,
      description,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(card.id);
      onClose();
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      updateCard(card.id, {
        labels: [...card.labels, newLabel.trim()]
      });
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelIndex: number) => {
    updateCard(card.id, {
      labels: card.labels.filter((_, index) => index !== labelIndex)
    });
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false
      };
      updateCard(card.id, {
        checklist: [...card.checklist, newItem]
      });
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    updateCard(card.id, {
      checklist: card.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    updateCard(card.id, {
      checklist: card.checklist.filter(item => item.id !== itemId)
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: 'You',
        createdAt: new Date().toISOString()
      };
      updateCard(card.id, {
        comments: [...card.comments, comment]
      });
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Card Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Add a description..."
            />
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Labels */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Labels
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {card.labels.map((label, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{label}</span>
                  <button
                    onClick={() => handleRemoveLabel(index)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add a label..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
              />
              <button
                onClick={handleAddLabel}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Checklist
            </label>
            <div className="space-y-2 mb-3">
              {card.checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add a checklist item..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              />
              <button
                onClick={handleAddChecklistItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Comments
            </label>
            <div className="space-y-3 mb-3">
              {card.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Card</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;