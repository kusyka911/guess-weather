import {
  createContext,
  FunctionComponent,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCityTemp } from '../api';
import { City } from '../types';

export interface GameContextType {
  isGameLoading: boolean;

  isGameStarted: boolean;
  isResultAvailable: boolean;
  startGame: () => void;
  restartGame: () => void;
  endGame: () => void;
  nextStep: (temp: number) => void;

  cities: City[];
  activeCity: City | null;
  activeCityIndex: number | null;

  answers: Partial<Record<City, number>>;
  setAnswer: (city: City, answer: number) => void;

  realTemp: Partial<Record<City, number>>;
  setRealTemp: (city: City, temp: number) => void;
}

const GameContextInner = createContext<GameContextType>({
  activeCity: null,
  activeCityIndex: null,
  answers: {},
  cities: [],
  isGameLoading: false,
  isGameStarted: false,
  isResultAvailable: false,
  realTemp: {},
  nextStep: () => {},
  setAnswer: () => {},
  setRealTemp: () => {},
  startGame: () => {},
  restartGame: () => {},
  endGame: () => {},
});

export const GameContext: FunctionComponent<PropsWithChildren> = memo(
  ({ children }) => {
    const [isGameLoading, setIsGameLoading] = useState(true);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isResultAvailable, setIsResultAvailable] = useState(false);
    const [activeCityIndex, setActiveCityIndex] = useState<number | null>(null);
    const [answers, setAnswers] = useState<Partial<Record<City, number>>>({});
    const [realTemp, setRealTemp] = useState<Partial<Record<City, number>>>({});

    const cities = useMemo(() => Object.values(City), []);

    const activeCity = useMemo(
      () => (activeCityIndex !== null ? cities[activeCityIndex] : null),
      [activeCityIndex, cities]
    );

    const setAnswer = useCallback(async (city: City, answers: number) => {
      setAnswers((prevAnswers) => ({ ...prevAnswers, [city]: answers }));
    }, []);

    const handleSetRealTemp = useCallback(async (city: City, temp: number) => {
      setRealTemp((prevTemp) => ({ ...prevTemp, [city]: temp }));
    }, []);

    const resetGameData = useCallback(() => {
      setIsResultAvailable(false);
      setActiveCityIndex(0);
      setRealTemp({});
      setAnswers({});
    }, []);

    const startGame = useCallback(() => {
      setIsGameStarted(true);
      resetGameData();
    }, [resetGameData]);

    const restartGame = resetGameData;

    const endGame = useCallback(() => {
      setIsGameStarted(false);
      resetGameData();
    }, [resetGameData]);

    const nextStep = useCallback(
      async (temp: number) => {
        if (!activeCity) {
          return;
        }

        setAnswer(activeCity, Math.round(temp));

        const response = await getCityTemp(activeCity);

        const realTemp = Math.round(response.data.main.temp);

        setRealTemp((prevTemp) => ({ ...prevTemp, [activeCity]: realTemp }));

        if (activeCityIndex === cities.length - 1) {
          setIsResultAvailable(true);
          return;
        }

        setActiveCityIndex((prevActiveCityIndex) => {
          if (prevActiveCityIndex === null) {
            return null;
          }
          return prevActiveCityIndex + 1;
        });
      },
      [activeCity, activeCityIndex, cities.length, setAnswer]
    );

    useEffect(() => {
      setTimeout(() => setIsGameLoading(false), 1500);
    }, []);

    const ctx: GameContextType = {
      activeCity,
      activeCityIndex,
      answers,
      cities,
      isGameLoading,
      isGameStarted,
      isResultAvailable,
      realTemp,
      nextStep,
      setAnswer,
      setRealTemp: handleSetRealTemp,
      startGame,
      restartGame,
      endGame,
    };

    return (
      <GameContextInner.Provider value={ctx}>
        {children}
      </GameContextInner.Provider>
    );
  }
);

export const useGameContext = () => {
  const ctx = useContext(GameContextInner);
  if (!ctx) {
    throw new Error('useGameContext must be used within a GameContext');
  }
  return ctx;
};

GameContext.displayName = 'GameContext';
