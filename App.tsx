import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingScreen from '@/screens/OnboardingScreen';
import HomeScreen from '@/screens/HomeScreen';
import RoutineDetailScreen from '@/screens/RoutineDetailScreen';
import ExerciseScreen from '@/screens/ExerciseScreen';
import CompletedScreen from '@/screens/CompletedScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/routine/:id" element={<RoutineDetailScreen />} />
        <Route path="/exercise" element={<ExerciseScreen />} />
        <Route path="/completed" element={<CompletedScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;