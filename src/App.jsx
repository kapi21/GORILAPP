import { useState, useEffect } from 'react';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { requestWakeLock } from './utils/wakeLock';
import Layout from './components/Layout';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';
import SessionTracker from './components/SessionTracker';
import History from './components/History';
import ProgressCharts from './components/ProgressCharts';
import Profile from './components/Profile';
import TimerModule from './components/TimerModule';
import IntroSplash from './components/IntroSplash';
import { initializeDatabase, getWorkoutById } from './db/database';
import { getSavedSession, clearSession } from './utils/sessionStorage';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('workouts');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await Promise.race([
          initializeDatabase(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout DB')), 3000))
        ]);
      } catch (err) {
        console.warn('Init DB warning:', err);
      }

      // Comprobar si hay una sesión activa previa para reanudar en segundo plano
      try {
        const saved = getSavedSession();
        if (saved && saved.workoutId) {
          const w = (await getWorkoutById(saved.workoutId)) || saved.workout;
          if (w) {
            setActiveSession({ ...w, savedSession: saved });
            setShowIntro(false); // Omitir intro si el usuario vuelve a su entrenamiento
          }
        }
      } catch (err) {
        console.warn('Error recuperando sesión activa:', err);
      }

      try {
        await KeepAwake.keepAwake();
      } catch (err) {
        console.warn('KeepAwake error:', err);
      } finally {
        setIsInitialized(true);
      }
    }
    init();

    const enableWakeLock = async () => {
      try {
        await KeepAwake.keepAwake();
      } catch {
        // Fallback
      }
      await requestWakeLock();
      document.removeEventListener('click', enableWakeLock);
      document.removeEventListener('touchstart', enableWakeLock);
    };

    document.addEventListener('click', enableWakeLock);
    document.addEventListener('touchstart', enableWakeLock);

    return () => {
      document.removeEventListener('click', enableWakeLock);
      document.removeEventListener('touchstart', enableWakeLock);
    };
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
    clearSession();
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

  // Intro Splash en arranque en frío
  if (showIntro) {
    return <IntroSplash onFinish={() => setShowIntro(false)} />;
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
