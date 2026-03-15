import { useState, useEffect, useCallback, useRef } from 'react';

export const useExerciseTimer = (onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(10);
  
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(interval);
      // Llamar al ref para evitar dependencia circular o stale closures
      if (onCompleteRef.current) onCompleteRef.current();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]); // Quitamos onComplete de dependencias

  const startTimer = useCallback((duration: number) => {
    setTotalTime(duration);
    setTimeLeft(duration);
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const resetTimer = useCallback((duration: number, autoStart = false) => {
    setTotalTime(duration);
    setTimeLeft(duration);
    setIsActive(autoStart);
  }, []);

  return { 
    timeLeft, 
    totalTime, 
    isActive, 
    setIsActive, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    resetTimer,
    setTimeLeft, // Exponer para casos manuales raros
    setTotalTime 
  };
};
