'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import type { JarStatisticRecord } from '../types';

import { toCurrency } from '../utils';
import { AppContext } from '../dal';

import styles from './Statistics.module.css';
import { StatisticsSection } from './StatisticsSection/StatisticsSection';
import { getAccountsMovements } from './gatherAnalytics';
import { ExportStatistics } from './ExportStatistics/ExportStatistics';

const FIVE_DAYS_AGO = new Date();
FIVE_DAYS_AGO.setDate(FIVE_DAYS_AGO.getDate() - 5);

export const Statistics = ({
  statistics,
}: {
  statistics: Array<JarStatisticRecord>;
}) => {
  const { selectedJars, jars } = useContext(AppContext);

  const [startDate, setStartDate] = useState('2024-01-05');
  const [endDate, setEndDate] = useState('2024-01-12');

  const usedJars = selectedJars.length ? selectedJars : jars;

  const filteredStatistics = selectedJars.length
    ? statistics.filter((record) => {
        return selectedJars.find(
          (selectedJar) => selectedJar.id === record.jar_id
        );
      })
    : statistics;

  const growth = getAccountsMovements(
    usedJars,
    filteredStatistics,
    new Date(startDate),
    new Date(endDate)
    // FIVE_DAYS_AGO,
    // TODAY
  );

  return (
    <div className={styles['statistics-wrapper']}>
      <div className={classNames(styles.column, styles.statistics)}>
        <div className={styles['column-header']}>
          Поточний стан <ExportStatistics jars={jars} />
        </div>
        <div className={styles.chart}>
          <StatisticsSection jars={usedJars} />
        </div>
      </div>
      <div className={classNames(styles.column, styles.analytics)}>
        <div className={styles['column-header']}>
          <div className={styles['date-inputs-wrapper']}>
            <span className={styles['inputs-title-prefix']}>
              Динаміка за період:
            </span>
            <div className={styles['date-inputs']}>
              <input
                type='date'
                id='start-date'
                className={styles['date-input']}
                onChange={(ev) => setStartDate(ev.target.value)}
                value={startDate}
                max={endDate}
              />
              →
              <input
                type='date'
                id='end-date'
                className={styles['date-input']}
                onChange={(ev) => setEndDate(ev.target.value)}
                value={endDate}
                min={startDate}
              />
            </div>
          </div>
        </div>
        <div className={styles['analytics-content']}>
          <div className={styles.growth}>
            {growth.map(
              ({
                jarId,
                startDateAmount,
                endDateAmount,
                percentage,
                difference,
              }) => {
                const jar = jars.find((jar) => jar.id === Number(jarId));

                return (
                  <div key={jarId} className={styles['grid-row']}>
                    <span className={styles.cell}>{jar?.owner_name}</span>
                    <span
                      className={classNames(styles.cell, {
                        [styles['positive-dynamic']]: difference > 0,
                        [styles['no-dynamic']]: difference === 0,
                        [styles['negative-dynamic']]: difference < 0,
                      })}
                    >
                      {toCurrency(difference)} ({percentage})
                    </span>
                    <span className={styles.cell}>
                      {toCurrency(startDateAmount)} →{' '}
                      {toCurrency(endDateAmount)}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
