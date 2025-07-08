import React from 'react';
import { AuthProvider } from './contexts/AuthProvider';
import { useAuth } from './contexts/useAuth';
import { BoardProvider } from './contexts/BoardProvider';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import BoardList from './components/BoardList';
import BoardView from './components/BoardView';
import { useBoard } from './contexts/useBoard';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentBoard } = useBoard();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {currentBoard ? <BoardView /> : <BoardList />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BoardProvider>
        <AppContent />
      </BoardProvider>
    </AuthProvider>
  );
};

export default App;