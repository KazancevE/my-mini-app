import React, { createContext, useContext, useState, ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';

// Определяем интерфейс для состояния контекста
interface AppContextType {
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  selectedHours: string | null;
  setSelectedHours: (hours: string | null) => void;
  selectedPeople: string | null;
  setSelectedPeople: (people: string | null) => void;
}

// Создаем контекст с типом
const AppContext = createContext<AppContextType | undefined>(undefined);

// Создаем провайдер контекста
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedHours, setSelectedHours] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ selectedDate, setSelectedDate, selectedHours, setSelectedHours, selectedPeople, setSelectedPeople }}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для доступа к контексту
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
