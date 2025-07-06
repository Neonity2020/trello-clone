import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels: string[];
  checklist: ChecklistItem[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  boardId: string;
  position: number;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  lists: List[];
  createdAt: string;
  updatedAt: string;
}

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  createBoard: (title: string, description?: string) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (board: Board | null) => void;
  createList: (boardId: string, title: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  createCard: (listId: string, title: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromListId: string, toListId: string, position: number) => void;
  reorderCards: (listId: string, cardIds: string[]) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

  useEffect(() => {
    const savedBoards = localStorage.getItem('trello-boards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trello-boards', JSON.stringify(boards));
  }, [boards]);

  const createBoard = (title: string, description?: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      description,
      lists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBoards(prev => [...prev, newBoard]);
  };

  const updateBoard = (id: string, updates: Partial<Board>) => {
    setBoards(prev => prev.map(board => 
      board.id === id ? { ...board, ...updates, updatedAt: new Date().toISOString() } : board
    ));
    if (currentBoard && currentBoard.id === id) {
      setCurrentBoard(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }
  };

  const deleteBoard = (id: string) => {
    setBoards(prev => prev.filter(board => board.id !== id));
    if (currentBoard && currentBoard.id === id) {
      setCurrentBoard(null);
    }
  };

  const createList = (boardId: string, title: string) => {
    const newList: List = {
      id: Date.now().toString(),
      title,
      cards: [],
      boardId,
      position: boards.find(b => b.id === boardId)?.lists.length || 0,
    };

    setBoards(prev => prev.map(board => 
      board.id === boardId 
        ? { ...board, lists: [...board.lists, newList], updatedAt: new Date().toISOString() }
        : board
    ));

    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prev => prev ? { 
        ...prev, 
        lists: [...prev.lists, newList], 
        updatedAt: new Date().toISOString() 
      } : null);
    }
  };

  const updateList = (listId: string, updates: Partial<List>) => {
    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.map(list => 
        list.id === listId ? { ...list, ...updates } : list
      ),
      updatedAt: new Date().toISOString()
    })));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId ? { ...list, ...updates } : list
        ),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const deleteList = (listId: string) => {
    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.filter(list => list.id !== listId),
      updatedAt: new Date().toISOString()
    })));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.filter(list => list.id !== listId),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const createCard = (listId: string, title: string) => {
    const newCard: Card = {
      id: Date.now().toString(),
      title,
      description: '',
      labels: [],
      checklist: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.map(list => 
        list.id === listId 
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      ),
      updatedAt: new Date().toISOString()
    })));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId 
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        ),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => 
          card.id === cardId ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
        )
      })),
      updatedAt: new Date().toISOString()
    })));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
          )
        })),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const deleteCard = (cardId: string) => {
    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: list.cards.filter(card => card.id !== cardId)
      })),
      updatedAt: new Date().toISOString()
    })));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          cards: list.cards.filter(card => card.id !== cardId)
        })),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const moveCard = (cardId: string, fromListId: string, toListId: string, position: number) => {
    const updateBoardState = (board: Board) => {
      const fromList = board.lists.find(list => list.id === fromListId);
      const toList = board.lists.find(list => list.id === toListId);
      const card = fromList?.cards.find(card => card.id === cardId);

      if (!card || !fromList || !toList) return board;

      // Remove card from source list
      const newFromCards = fromList.cards.filter(c => c.id !== cardId);
      
      // Add card to target list at specified position
      const newToCards = [...toList.cards];
      newToCards.splice(position, 0, { ...card, updatedAt: new Date().toISOString() });

      return {
        ...board,
        lists: board.lists.map(list => {
          if (list.id === fromListId) {
            return { ...list, cards: newFromCards };
          }
          if (list.id === toListId) {
            return { ...list, cards: newToCards };
          }
          return list;
        }),
        updatedAt: new Date().toISOString()
      };
    };

    setBoards(prev => prev.map(updateBoardState));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? updateBoardState(prev) : null);
    }
  };

  const reorderCards = (listId: string, cardIds: string[]) => {
    const updateBoardState = (board: Board) => ({
      ...board,
      lists: board.lists.map(list => {
        if (list.id === listId) {
          const cardMap = new Map(list.cards.map(card => [card.id, card]));
          const reorderedCards = cardIds
            .map(cardId => cardMap.get(cardId))
            .filter((card): card is Card => card !== undefined)
            .map(card => ({ ...card, updatedAt: new Date().toISOString() }));
          return { ...list, cards: reorderedCards };
        }
        return list;
      }),
      updatedAt: new Date().toISOString()
    });

    setBoards(prev => prev.map(updateBoardState));

    if (currentBoard) {
      setCurrentBoard(prev => prev ? updateBoardState(prev) : null);
    }
  };

  const value = {
    boards,
    currentBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};