import { memo, useCallback, useMemo, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Button } from 'primereact/button';
import {
  InputNumber,
  InputNumberValueChangeParams,
} from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Steps } from 'primereact/steps';

import { useGameContext } from '../../context';

import classes from './Game.module.scss';

export const Game = memo(() => {
  const { activeCityIndex, activeCity, cities, nextStep } = useGameContext();

  const [tempInputVal, setTempInputVal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    async (e: InputNumberValueChangeParams) => {
      setIsLoading(true);
      await setTempInputVal(e.value);
      setIsLoading(false);
    },
    []
  );

  const handleNextClick = useCallback(() => {
    if (tempInputVal !== null) {
      nextStep(tempInputVal);
      setTempInputVal(null);
    }
  }, [tempInputVal, nextStep]);

  const steps = useMemo(
    () => cities.map((city) => ({ label: city })),
    [cities]
  );

  if (activeCityIndex === null) {
    return (
      <div className={classes['game-container']}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className={classes['game-container']}>
      <Steps
        className={classes['game-steps']}
        model={steps}
        activeIndex={activeCityIndex}
      />
      <SwitchTransition>
        <CSSTransition
          key={activeCity}
          in={true}
          timeout={100}
          classNames="fade"
        >
          <div className={classes['game-content']}>
            <h2 className={classes['game-title']}>
              What is current temperature in {activeCity}?
            </h2>
            <InputNumber
              value={tempInputVal}
              max={50}
              min={-50}
              onChange={handleInputChange}
              showButtons
              buttonLayout="vertical"
            />
            <div>
              <Button
                label="Next"
                loading={isLoading}
                disabled={tempInputVal === null}
                onClick={handleNextClick}
              />
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
});

Game.displayName = 'Game';
