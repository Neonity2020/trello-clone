import React, { useState } from 'react';
import { useBoard, List } from '../contexts/BoardContext';
import CardComponent from './CardComponent';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

interface ListComponentProps {
  list: List;
}

const ListComponent: React.FC<ListComponentProps> = ({ list }) => {
  const { createCard, updateList, deleteList, moveCard, reorderCards } = useBoard();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [draggedOver, setDraggedOver] = useState(false);
  const [draggedCard, setDraggedCard] = useState<{
    cardId: string;
    fromListId: string;
    fromIndex: number;
  } | null>(null);
  const [dropPosition, setDropPosition] = useState<number | null>(null);

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      createCard(list.id, newCardTitle.trim());
      setNewCardTitle('');
      setShowCreateForm(false);
    }
  };

  const handleUpdateTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updateList(list.id, { title: editTitle.trim() });
      setEditingTitle(false);
    }
  };

  const handleDeleteList = () => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(list.id);
    }
  };

  const handleCardDragStart = (cardId: string, fromListId: string, fromIndex: number) => {
    setDraggedCard({ cardId, fromListId, fromIndex });
  };

  const handleCardDragEnd = () => {
    setDraggedCard(null);
    setDraggedOver(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
    
    // Calculate drop position based on mouse position
    const listElement = e.currentTarget as HTMLElement;
    const cardsContainer = listElement.querySelector('.cards-container');
    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.children);
    const mouseY = e.clientY;
    
    let insertIndex = cards.length;
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const rect = card.getBoundingClientRect();
      const cardMiddle = rect.top + rect.height / 2;
      
      if (mouseY < cardMiddle) {
        insertIndex = i;
        break;
      }
    }
    
    setDropPosition(insertIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Only hide drag over if mouse is completely outside the list
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDraggedOver(false);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const { cardId, fromListId, fromIndex } = dragData;
      
      if (!cardId || !fromListId) return;
      
      const targetPosition = dropPosition !== null ? dropPosition : list.cards.length;
      
      if (fromListId === list.id) {
        // Reordering within the same list
        if (fromIndex !== targetPosition) {
          const newCardIds = [...list.cards.map(card => card.id)];
          const [movedCardId] = newCardIds.splice(fromIndex, 1);
          newCardIds.splice(targetPosition > fromIndex ? targetPosition - 1 : targetPosition, 0, movedCardId);
          reorderCards(list.id, newCardIds);
        }
      } else {
        // Moving between different lists
        moveCard(cardId, fromListId, list.id, targetPosition);
      }
    } catch (error) {
      console.error('Error handling card drop:', error);
    }
    
    setDropPosition(null);
  };

  return (
    <div className="flex-shrink-0 w-72">
      <div
        className={`bg-white rounded-xl shadow-md p-4 min-h-32 transition-all duration-200 ${
          draggedOver ? 'bg-blue-50 border-2 border-blue-300 shadow-lg' : 'border border-gray-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* List Header */}
        <div className="flex items-center justify-between mb-4">
          {editingTitle ? (
            <form onSubmit={handleUpdateTitle} className="flex-1 mr-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onBlur={() => setEditingTitle(false)}
              />
            </form>
          ) : (
            <h3
              onClick={() => setEditingTitle(true)}
              className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex-1"
            >
              {list.title}
            </h3>
          )}
          
          <div className="relative">
            <button
              onClick={(e) => {
                const menu = e.currentTarget.nextElementSibling as HTMLElement;
                menu.classList.toggle('hidden');
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-32 z-10 hidden">
              <button
                onClick={() => setEditingTitle(true)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteList}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="cards-container space-y-3 mb-4 min-h-8">
          {list.cards.map((card, index) => (
            <React.Fragment key={card.id}>
              {/* Drop indicator */}
              {draggedOver && dropPosition === index && (
                <div className="h-2 bg-blue-400 rounded-full opacity-75 transition-all duration-200"></div>
              )}
              
              <CardComponent 
                card={card} 
                listId={list.id} 
                index={index}
                onDragStart={handleCardDragStart}
                onDragEnd={handleCardDragEnd}
              />
            </React.Fragment>
          ))}
          
          {/* Drop indicator at the end */}
          {draggedOver && dropPosition === list.cards.length && (
            <div className="h-2 bg-blue-400 rounded-full opacity-75 transition-all duration-200"></div>
          )}
        </div>

        {/* Add Card Form */}
        {showCreateForm ? (
          <form onSubmit={handleCreateCard}>
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ListComponent;