'use client';

import React, { useState, useRef, useContext } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import type { Jar } from '../types';

import styles from './JarsList.module.css';
import { AppContext } from '../dal/StateProvider';
import { addJar } from '../dal/api';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
};

const AddJar = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const { url, owner, curator } = (ev.target as HTMLFormElement)
      .elements as unknown as {
      url: HTMLInputElement;
      owner: HTMLInputElement;
      curator: HTMLSelectElement;
    };

    // console.log({ url, owner, curator });
    setIsLoading(true);

    const response = await addJar({
      url: url.value,
      owner: owner.value,
      parentJarId: Number(curator.value),
    });

    setIsLoading(false);
    formRef.current?.reset();
    closeDialog();
  };

  return (
    <>
      <li
        className={classNames(styles.item, styles['add-jar'])}
        onClick={openDialog}
      >
        + Додати банку
      </li>
      <dialog ref={dialogRef} className={styles['add-jar-dialog']}>
        <div className={styles['add-jar-inputs-wrapper']}>
          {isLoading && (
            <div className={styles['loader']}>
              <h4>Праця робиться...</h4>
            </div>
          )}
          <form className={styles['add-jar-inputs']} onSubmit={handleSubmit}>
            <h3>Давай додамо баночку!</h3>
            <label htmlFor='owner-input'>Як звуть власника банки?</label>
            <input
              name='owner'
              id='owner-input'
              placeholder='Джейсон Стетхем'
              type='text'
              required
              maxLength={30}
            />
            <label htmlFor='url-input'>Посилання на банку</label>
            <input
              id='url-input'
              name='url'
              placeholder='url'
              type='url'
              required
              pattern='https://send.monobank.ua/jar/.*'
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <select id='curator-input' name='curator'>
              <option value=''>Жодного</option>
              <option value=''>Антон Грищенко</option>
              <option value=''>Дмитро Петруняк</option>
              <option value=''>Іван Титаренко</option>
              <option value=''>Олександр Бабенко</option>
              <option value=''>Олександр Волощенко</option>
              <option value=''>Сергій Макогон</option>
            </select>
            <button type='submit'>Створити банку</button>
            <button onClick={closeDialog}>Закрити</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

const JarItem = ({ jar, isSelected, onClick }: JarItemProps) => {
  const { url, goal, accumulated, owner_name } = jar;

  const logoSrc = '/images/jar-logo.jpg';

  return (
    <li
      className={classNames(styles.item, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
    >
      <div className={styles['item-column']}>
        <Image
          src={logoSrc}
          alt='jar logo'
          className={styles.logo}
          width={50}
          height={50}
        />
      </div>
      <div className={styles['item-column']}>
        <h3>{owner_name}</h3>
        {/* <a className={styles['jar-link']} href={url}>
          Посилання на банку
        </a> */}
        <span>Зібрано: {accumulated}₴</span>
        {goal && <span> 🎯 Мета: {goal}₴</span>}
      </div>
    </li>
  );
};

export const JarsList = () => {
  const { selectedJars, setSelectedJars, jars } = useContext(AppContext);
  const [isAllVisible, setIsAllVisible] = useState(jars.length < 10);

  const toRender = isAllVisible ? jars : jars.slice(0, 10);

  return (
    <>
      <div className={styles.controls}>
        <h3>
          Загалом банок: {jars.length} | Обрано: {selectedJars.length}
        </h3>
        {jars.length > 10 && (
          <span onClick={() => setIsAllVisible(!isAllVisible)}>
            {!isAllVisible ? 'Є приховані' : 'Всі банки відображено'}
          </span>
        )}
      </div>
      <ol className={styles['jars-list']}>
        <AddJar />
        {toRender.map((item) => (
          <JarItem
            key={item.id}
            jar={item}
            isSelected={selectedJars.includes(item.id)}
            onClick={() => setSelectedJars(item.id)}
          />
        ))}
      </ol>
    </>
  );
};
