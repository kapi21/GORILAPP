import { useState, useEffect } from 'react';
import { KeepAwake } from '@capacitor-community/keep-awake';
import Layout from './components/Layout';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';
import SessionTracker from './components/SessionTracker';
import History from './components/History';
import ProgressCharts from './components/ProgressCharts';
import Profile from './components/Profile';
import TimerModule from './components/TimerModule';
import { initializeDatabase } from './db/database';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('workouts');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      await initializeDatabase();
      try {
        await KeepAwake.keepAwake();
      } catch (err) {
        console.warn('KeepAwake error:', err);
      }
      setIsInitialized(true);
    }
    init();
  }, []);

  // Global exit confirmation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '¿Seguro que quieres salir de GorilApp?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  function handleSelectWorkout(workout, savedSession = null) {
    if (savedSession) {
      // Resuming a paused session - go directly to session tracker
      setActiveSession({ ...workout, savedSession });
    } else {
      // Normal flow - show workout detail
      setSelectedWorkout(workout);
    }
  }

  function handleBackToList() {
    setSelectedWorkout(null);
  }

  function handleStartSession(workout) {
    setActiveSession(workout);
  }

  function handleEndSession() {
    setActiveSession(null);
    setSelectedWorkout(null);
    setCurrentView('workouts');
  }

  function handleNavigate(view) {
    setCurrentView(view);
    setSelectedWorkout(null);
  }

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)'
      }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando GorilApp...</p>
      </div>
    );
  }

  // Active session view (full screen)
  if (activeSession) {
    return <SessionTracker workout={activeSession} onClose={handleEndSession} />;
  }

  // Main app with navigation
  return (
    <Layout currentView={currentView} onNavigate={handleNavigate}>
      {currentView === 'workouts' && !selectedWorkout && (
        <WorkoutList onSelectWorkout={handleSelectWorkout} />
      )}

      {currentView === 'workouts' && selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onBack={handleBackToList}
          onStartSession={handleStartSession}
        />
      )}

      {currentView === 'history' && <History />}

      {currentView === 'progress' && <ProgressCharts />}

      {currentView === 'timer' && <TimerModule onBack={() => handleNavigate('workouts')} />}

      {currentView === 'profile' && <Profile />}
    </Layout>
  );
}

export default App;
