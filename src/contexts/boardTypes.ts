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

export interface BoardContextType {
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