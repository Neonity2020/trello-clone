import React, { useState } from 'react';
import { Card } from '../contexts/BoardContext';
import { Calendar, MessageCircle, CheckSquare, Tag, Edit2, Trash2 } from 'lucide-react';
import CardModal from './CardModal';

interface CardComponentProps {
  card: Card;
  listId: string;
  index: number;
  onDragStart: (cardId: string, listId: string, index: number) => void;
  onDragEnd: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  card, 
  listId, 
  index, 
  onDragStart, 
  onDragEnd 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(card.id, listId, index);
    
    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      cardId: card.id,
      fromListId: listId,
      fromIndex: index
    }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Create drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const dueDateFormatted = card.dueDate ? new Date(card.dueDate).toLocaleDateString() : null;
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const completedChecklist = card.checklist.filter(item => item.completed).length;
  const totalChecklist = card.checklist.length;

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => !isDragging && setShowModal(true)}
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-4 border border-gray-200 group ${
          isDragging ? 'opacity-50 scale-105 rotate-2 shadow-lg z-50' : 'hover:scale-[1.02]'
        }`}
        style={{
          transform: isDragging ? 'rotate(5deg) scale(1.05)' : undefined,
          transition: isDragging ? 'none' : 'all 0.2s ease-in-out'
        }}
      >
        {/* Card Labels */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.labels.map((label, labelIndex) => (
              <span
                key={labelIndex}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Card Title */}
        <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-3">
          {card.title}
        </h4>

        {/* Card Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {card.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{dueDateFormatted}</span>
              </div>
            )}
            {card.comments.length > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{card.comments.length}</span>
              </div>
            )}
            {totalChecklist > 0 && (
              <div className="flex items-center space-x-1">
                <CheckSquare className="w-3 h-3" />
                <span>{completedChecklist}/{totalChecklist}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drag Handle */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {showModal && (
        <CardModal
          card={card}
          listId={listId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CardComponent;