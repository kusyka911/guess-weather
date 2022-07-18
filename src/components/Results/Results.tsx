import { Fragment, useMemo } from 'react';
import classNames from 'classnames';
import { Button } from 'primereact/button';

import { useGameContext } from '../../context';

import classes from './Results.module.scss';

export const Results = () => {
  const { cities, answers, realTemp, restartGame, endGame } = useGameContext();

  const data = useMemo(
    () =>
      cities.map((city) => {
        const answer = answers[city];
        const real = realTemp[city];

        if (answer === undefined || real === undefined) {
          return {};
        }

        const isCorrect = Math.abs(real - answer) <= 5;

        return {
          city,
          answer,
          real,
          isCorrect,
        };
      }),
    [cities, answers, realTemp]
  );

  const isWin = useMemo(
    () => data.filter((i) => i?.isCorrect).length >= 3,
    [data]
  );

  const content = useMemo(
    () =>
      data.map(({ city, answer, isCorrect, real }) => {
        if (!city) return null;
        return (
          <Fragment key={city}>
            <div className={classes['results-grid__item']}>{city}</div>
            <div className={classes['results-grid__item']}>{real}</div>
            <div
              className={classNames(
                classes['results-grid__item'],
                isCorrect
                  ? classes['results-grid__item__correct']
                  : classes['results-grid__item__incorrect']
              )}
            >
              {answer}
            </div>
          </Fragment>
        );
      }),
    [data]
  );

  return (
    <div className={classes['results']}>
      {isWin ? (
        <h1 className={classes['results-win']}>You win!</h1>
      ) : (
        <h1 className={classes['results-loose']}>You loose!</h1>
      )}
      <div className={classes['results-grid']}>
        <div
          className={classNames(
            classes['results-grid__item'],
            classes['results-grid__item__title']
          )}
        >
          City
        </div>
        <div
          className={classNames(
            classes['results-grid__item'],
            classes['results-grid__item__title']
          )}
        >
          Real temp
        </div>
        <div
          className={classNames(
            classes['results-grid__item'],
            classes['results-grid__item__title']
          )}
        >
          Your answer
        </div>
        {content}
      </div>
      <div className={classes['results-buttons']}>
        <Button label="Start again" onClick={restartGame} />
        <Button label="Exit" onClick={endGame} />
      </div>
    </div>
  );
};
