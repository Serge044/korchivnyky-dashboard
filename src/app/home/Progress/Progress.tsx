import randomColor from 'randomcolor';
import { toCurrency } from '../../toolbox/utils';
import styles from './Progress.module.css';
import type { Jar } from '../../types';

type ProgressProps = {
  goal: number;
  jars: Array<Jar>;
};

const progressColor = randomColor();

const getGatheredMoney = (jars: Array<Jar>) => {
  return Object.values(jars).reduce((acc, { accumulated }) => {
    return acc + accumulated;
  }, 0);
};

export const Progress = ({ goal, jars }: ProgressProps) => {
  const currentSum = getGatheredMoney(jars);
  const percentage = `${Math.round((100 * currentSum) / goal)}%`;

  return (
    <div className={styles.progress}>
      <h3>Мета: {toCurrency(goal)}</h3>
      <h3>Зібрано: {toCurrency(currentSum)}</h3>
      <div className={styles['progress-bar-wrapper']}>
        <div className={styles['progress-bar']}>
          <div
            className={styles['current-progress']}
            style={{ width: percentage, backgroundColor: progressColor }}
          />
        </div>
        <span>{percentage}</span>
      </div>
    </div>
  );
};
