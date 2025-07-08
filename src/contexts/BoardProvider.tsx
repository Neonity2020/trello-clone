import React, { useState, useEffect } from 'react';
import { BoardContext } from './BoardContext';
import type { Board, List, Card } from './boardTypes';

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>(() => {
    const savedBoards = localStorage.getItem('trello-boards');
    return savedBoards ? JSON.parse(savedBoards) : [];
  });
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

  // 初始化 currentBoard
  useEffect(() => {
    const savedCurrentBoard = localStorage.getItem('trello-current-board');
    if (savedCurrentBoard) {
      setCurrentBoard(JSON.parse(savedCurrentBoard));
    }
  }, []);

  // boards 变化时写入 localStorage
  useEffect(() => {
    localStorage.setItem('trello-boards', JSON.stringify(boards));
  }, [boards]);

  // currentBoard 变化时写入 localStorage
  useEffect(() => {
    if (currentBoard) {
      localStorage.setItem('trello-current-board', JSON.stringify(currentBoard));
    } else {
      localStorage.removeItem('trello-current-board');
    }
  }, [currentBoard]);

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