import { useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useGameContext } from '../../context';

import classes from './Welcome.module.scss';

export interface WelcomeProps {
  isVisible: boolean;
  onGameStart: () => void;
}

const welcomeMessage = ['Welcome to', 'Guess the weather'];

const welcomeMessageMobile = ['Welcome', 'to', 'Guess', 'the', 'weather'];

export const Welcome = () => {
  const { isGameLoading, startGame } = useGameContext();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const listener = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  const isMobile = useMemo(() => windowWidth < 768, [windowWidth]);

  const message = useMemo(
    () =>
      (isMobile ? welcomeMessageMobile : welcomeMessage).flatMap(
        (msg, msgi) => [
          msg
            .split('')
            .map((l, i) =>
              l === ' ' ? (
                l
              ) : (
                <span key={(isMobile ? 'mobile-' : '') + msgi + l + i}>
                  {l}
                </span>
              )
            ),
          <br key={msgi + 'br'} />,
        ]
      ),
    [isMobile]
  );

  return (
    <div className={classes['welcome-container']}>
      <h1 className={classes['welcome-header']}>{message}</h1>
      <div className={classes['welcome-body']}>
        {isGameLoading && <ProgressSpinner />}
        {!isGameLoading && <Button onClick={startGame}>Start</Button>}
      </div>
    </div>
  );
};
