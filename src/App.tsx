import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type NewsItem = {
  year: string;
  text: string;
};

type TimelineTopic = {
  id: number;
  label: string;
  fromYear: string;
  toYear: string;
  news: NewsItem[];
};

const timelineTopics: TimelineTopic[] = [
  {
    id: 1,
    label: 'История',
    fromYear: '1980',
    toYear: '1986',
    news: [
      {
        year: '1981',
        text: 'В Греции отменили монархические ограничения и усилили парламентскую модель.',
      },
      {
        year: '1982',
        text: 'Начался новый этап переговоров по сокращению вооружений в Европе.',
      },
      {
        year: '1983',
        text: 'Запущена крупная программа цифрового архивирования исторических документов.',
      },
      {
        year: '1984',
        text: 'Расширены международные соглашения о сохранении культурного наследия.',
      },
      {
        year: '1985',
        text: 'Появились новые исследовательские центры по современной истории XX века.',
      },
      {
        year: '1986',
        text: 'В ряде стран обновили национальные исторические реестры и цифровые каталоги.',
      },
    ],
  },
  {
    id: 2,
    label: 'Кино',
    fromYear: '1987',
    toYear: '1995',
    news: [
      {
        year: '1987',
        text: 'Фестивальное кино получило сильный импульс благодаря независимым студиям.',
      },
      {
        year: '1989',
        text: 'Новые стандарты звука в прокате повысили качество кинопоказов.',
      },
      {
        year: '1991',
        text: 'Компьютерная графика стала заметной частью массовых блокбастеров.',
      },
      {
        year: '1993',
        text: 'Цифровой монтаж ускорил продакшен и удешевил постобработку.',
      },
      {
        year: '1994',
        text: 'Авторское кино усилило позиции на международных фестивалях.',
      },
      {
        year: '1995',
        text: 'Киноиндустрия перешла к гибридной модели с цифровыми эффектами и пленкой.',
      },
    ],
  },
  {
    id: 3,
    label: 'Литература',
    fromYear: '1996',
    toYear: '2006',
    news: [
      {
        year: '1996',
        text: 'Литературные премии активнее поддержали региональных авторов.',
      },
      {
        year: '1998',
        text: 'Издательства начали масштабные серии переводной современной прозы.',
      },
      {
        year: '2000',
        text: 'Электронные библиотеки расширили доступ к научной и художественной литературе.',
      },
      {
        year: '2002',
        text: 'Новые форматы короткой прозы стали популярны в журналах и онлайн.',
      },
      { year: '2004', text: 'Нон-фикшн занял значимую долю книжного рынка.' },
      {
        year: '2006',
        text: 'Крупные издательские дома запустили цифровые каталоги и подписки.',
      },
    ],
  },
  {
    id: 4,
    label: 'Театр',
    fromYear: '2007',
    toYear: '2018',
    news: [
      {
        year: '2007',
        text: 'Экспериментальные сцены начали активные гастрольные программы.',
      },
      {
        year: '2009',
        text: 'Театры внедрили цифровые системы света и сценографии.',
      },
      {
        year: '2011',
        text: 'Документальный театр усилил присутствие в репертуаре крупных площадок.',
      },
      {
        year: '2013',
        text: 'Появились гибридные постановки на стыке драмы, видеоарта и музыки.',
      },
      {
        year: '2016',
        text: 'Молодые режиссеры сформировали новые школы сценического языка.',
      },
      {
        year: '2018',
        text: 'Онлайн-трансляции спектаклей расширили международную аудиторию.',
      },
    ],
  },
  {
    id: 5,
    label: 'Медицина',
    fromYear: '2019',
    toYear: '2028',
    news: [
      {
        year: '2019',
        text: 'Расширены телемедицинские сервисы для удаленных регионов.',
      },
      {
        year: '2020',
        text: 'Быстрое обновление клинических протоколов повысило скорость диагностики.',
      },
      {
        year: '2021',
        text: 'Персонализированная терапия получила новые стандарты применения.',
      },
      {
        year: '2023',
        text: 'ИИ-системы начали помогать врачам в анализе диагностических снимков.',
      },
      {
        year: '2025',
        text: 'Роботизированные хирургические комплексы вошли в рутинную практику клиник.',
      },
      {
        year: '2028',
        text: 'Профилактическая медицина стала центральным направлением национальных программ.',
      },
    ],
  },
  {
    id: 6,
    label: 'Наука',
    fromYear: '2029',
    toYear: '2042',
    news: [
      {
        year: '2029',
        text: 'Квантовые вычисления перешли от лабораторных тестов к пилотным задачам.',
      },
      {
        year: '2031',
        text: 'Новые материалы с адаптивной структурой вышли на промышленный уровень.',
      },
      {
        year: '2034',
        text: 'Международные орбитальные проекты получили долгосрочные научные программы.',
      },
      {
        year: '2037',
        text: 'Энергетические технологии нового поколения снизили потери в сетях.',
      },
      {
        year: '2040',
        text: 'Биоинженерия усилила позиции в восстановительной медицине и фарме.',
      },
      {
        year: '2042',
        text: 'Научные центры внедрили унифицированные платформы открытых исследований.',
      },
    ],
  },
];

const desktopRadius = 268;
const mobileRadius = 200;
const targetAngle = -60;
const newsDragMultiplier = 1.8;

function App() {
  const [spinIndex, setSpinIndex] = useState(0);
  const [canNewsPrev, setCanNewsPrev] = useState(false);
  const [canNewsNext, setCanNewsNext] = useState(true);
  const [isNewsDragging, setIsNewsDragging] = useState(false);
  const newsSliderRef = useRef<HTMLDivElement | null>(null);
  const newsDragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });

  const itemCount = timelineTopics.length;
  const angleStep = 360 / itemCount;

  const activeIndex = useMemo(
    () => ((spinIndex % itemCount) + itemCount) % itemCount,
    [spinIndex, itemCount],
  );

  const activeTopic = timelineTopics[activeIndex];
  const activeNews = activeTopic.news;

  const rotationDeg = useMemo(() => {
    const activeAngle = angleStep * spinIndex - 90;
    return targetAngle - activeAngle;
  }, [angleStep, spinIndex]);

  const handleCircleSelect = (nextIndex: number) => {
    setSpinIndex((current) => {
      const normalizedCurrent = ((current % itemCount) + itemCount) % itemCount;
      let delta = nextIndex - normalizedCurrent;
      const half = itemCount / 2;

      if (delta > half) delta -= itemCount;
      if (delta < -half) delta += itemCount;

      return current + delta;
    });
  };

  const handlePrev = () => {
    setSpinIndex((current) => current - 1);
  };

  const handleNext = () => {
    setSpinIndex((current) => current + 1);
  };

  const currentCounter = String(activeIndex + 1).padStart(2, '0');
  const totalCounter = String(itemCount).padStart(2, '0');

  const updateNewsButtons = useCallback(() => {
    const slider = newsSliderRef.current;
    if (!slider) return;

    const maxScrollLeft = Math.max(0, slider.scrollWidth - slider.clientWidth);
    setCanNewsPrev(slider.scrollLeft > 1);
    setCanNewsNext(slider.scrollLeft < maxScrollLeft - 1);
  }, []);

  const getNewsStep = useCallback(() => {
    const slider = newsSliderRef.current;
    if (!slider) return 0;

    const firstCard = slider.querySelector(
      '[data-news-card]',
    ) as HTMLElement | null;
    if (!firstCard) return slider.clientWidth * 0.8;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    return firstCard.offsetWidth + gap;
  }, []);

  const scrollNews = useCallback(
    (direction: 1 | -1) => {
      const slider = newsSliderRef.current;
      if (!slider) return;

      slider.scrollBy({
        left: getNewsStep() * direction,
        behavior: 'smooth',
      });
    },
    [getNewsStep],
  );

  const handleNewsPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const slider = newsSliderRef.current;
    if (!slider) return;

    newsDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: slider.scrollLeft,
    };

    setIsNewsDragging(true);
    slider.setPointerCapture(event.pointerId);
  };

  const handleNewsPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = newsSliderRef.current;
    const drag = newsDragRef.current;
    if (!slider || !drag.active || drag.pointerId !== event.pointerId) return;

    event.preventDefault();
    const deltaX = event.clientX - drag.startX;
    slider.scrollLeft = drag.startScrollLeft - deltaX * newsDragMultiplier;
    updateNewsButtons();
  };

  const stopNewsDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = newsSliderRef.current;
    const drag = newsDragRef.current;
    if (!slider || !drag.active || drag.pointerId !== event.pointerId) return;

    drag.active = false;
    setIsNewsDragging(false);
    slider.releasePointerCapture(event.pointerId);
    updateNewsButtons();
  };

  useEffect(() => {
    const slider = newsSliderRef.current;
    if (!slider) return;

    slider.scrollTo({ left: 0, behavior: 'auto' });
    updateNewsButtons();
  }, [activeIndex, updateNewsButtons]);

  useEffect(() => {
    updateNewsButtons();
    window.addEventListener('resize', updateNewsButtons);
    return () => window.removeEventListener('resize', updateNewsButtons);
  }, [updateNewsButtons]);

  return (
    <div className='max-w-360 w-full my-0 mx-auto min-h-full flex flex-col relative border-l border-r border-[#e2e5ec]'>
      <div className='border-l border-[#e2e5ec] absolute left-1/2 w-px h-full'></div>
      <div className='flex text-center gap-20 max-[1250px]:gap-5 mt-36 max-[1250px]:mt-24'>
        <div className='w-1.25 bg-[linear-gradient(180deg,#3877EE_-5%,#EF5DA8_85%)]'></div>
        <h1 className='font-bold text-[56px] max-[1250px]:text-[30px] text-left text-[#42567a]'>
          Исторические
          <br /> даты
        </h1>
      </div>

      <div className='relative mx-auto -mt-22.5 flex h-134 w-134 items-center justify-center before:pointer-events-none before:absolute before:left-1/2 before:top-1/2 before:z-[-1] before:h-px before:w-screen before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#e2e5ec] max-[1250px]:mt-25 max-[1250px]:h-100 max-[1250px]:w-100'>
        <div className='border w-full h-full rounded-full border-[#d0d5e0]'></div>
        <div
          className='absolute left-1/2 top-1/2 z-2 h-0 w-0 transition-transform duration-620 ease-[ease] [--circle-radius:var(--desktop-radius)] transform-[translate(-50%,-50%)_rotate(var(--nav-rotation))] max-[1250px]:[--circle-radius:var(--mobile-radius)]'
          style={
            {
              '--nav-rotation': `${rotationDeg}deg`,
              '--desktop-radius': `${desktopRadius}px`,
              '--mobile-radius': `${mobileRadius}px`,
            } as React.CSSProperties
          }
        >
          {timelineTopics.map((item, index) => {
            const angle = angleStep * index - 90;
            const isActive = index === activeIndex;

            return (
              <button
                key={item.id}
                type='button'
                className='absolute left-0 top-0 flex h-14 w-14 cursor-pointer items-center justify-center border-0 bg-transparent p-0 leading-none transform-[translate(-50%,-50%)_rotate(var(--item-angle))_translateX(var(--circle-radius))_rotate(calc(-1*var(--item-angle)))] focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-[#5d5fef] focus-visible:outline-offset-4'
                style={{ '--item-angle': `${angle}deg` } as React.CSSProperties}
                onClick={() => handleCircleSelect(index)}
                aria-label={`${item.id}. ${item.label}`}
                aria-pressed={isActive}
              >
                <span
                  className={`flex items-center justify-center transition-transform duration-620 ease-[ease] ${
                    isActive
                      ? 'relative h-14 w-14 rounded-full border border-[#b8becc] bg-[#f4f5f9] max-[1250px]:h-11 max-[1250px]:w-11'
                      : 'h-3 w-3 max-[1250px]:h-2.5 max-[1250px]:w-2.5'
                  }`}
                  style={{ transform: `rotate(${-rotationDeg}deg)` }}
                >
                  {isActive ? (
                    <>
                      <span className='text-[20px] leading-none text-[#42567a] max-[1250px]:text-[16px]'>
                        {item.id}
                      </span>
                      <span className='absolute left-[calc(100%+16px)] top-1/2 max-w-42.5 -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[20px] leading-none font-bold text-[#42567a] max-[1250px]:left-[calc(100%+10px)] max-[1250px]:max-w-27.5 max-[1250px]:text-[14px]'>
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <span
                      className='h-1.5 w-1.5 rounded-full bg-[#42567a] max-[1250px]:h-1.25 max-[1250px]:w-1.25'
                      aria-hidden='true'
                    ></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='flex gap-20 font-bold text-[200px] -mt-105 mx-auto max-[1250px]:text-[100px] max-[1250px]:-mt-67.5'>
        <span className='text-[#5d5fef]'>{activeTopic.fromYear}</span>
        <span className='text-[#ef5da8]'>{activeTopic.toYear}</span>
      </div>

      <div className='ml-20 max-[1250px]:ml-7'>
        <div className='text-[#42567a]'>{`${currentCounter}/${totalCounter}`}</div>
        <div className='flex gap-5'>
          <button
            type='button'
            onClick={handlePrev}
            className='mt-5 border-none cursor-pointer inline-flex justify-center items-center disabled:opacity-50 bg-white'
            aria-label='Предыдущий период'
          >
            <svg
              width='50'
              height='50'
              viewBox='0 0 50 50'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='25'
                cy='25'
                r='24.5'
                transform='matrix(-1 0 0 1 50 0)'
                stroke='#42567A'
                strokeOpacity='0.5'
              />
              <path
                d='M27.4999 18.75L21.2499 25L27.4999 31.25'
                stroke='#42567A'
                strokeWidth={2}
              />
            </svg>
          </button>
          <button
            type='button'
            onClick={handleNext}
            className='mt-5 border-none cursor-pointer inline-flex justify-center items-center disabled:opacity-50 bg-white'
            aria-label='Следующий период'
          >
            <svg
              width='50'
              height='50'
              viewBox='0 0 50 50'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              style={{ transform: 'rotateY(180deg)' }}
            >
              <circle
                cx='25'
                cy='25'
                r='24.5'
                transform='matrix(-1 0 0 1 50 0)'
                stroke='#42567A'
                strokeOpacity='0.5'
              />
              <path
                d='M27.4999 18.75L21.2499 25L27.4999 31.25'
                stroke='#42567A'
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
      </div>

      <div className='mt-14 relative'>
        <div className='relative px-20 max-[1250px]:px-7'>
          <button
            type='button'
            onClick={() => scrollNews(-1)}
            disabled={!canNewsPrev}
            className='absolute -left-2 top-[46%] z-2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-white disabled:cursor-default disabled:opacity-40 max-[1250px]:top-[44%]'
            aria-label='Предыдущая новость'
          >
            <svg
              width='50'
              height='50'
              viewBox='0 0 50 50'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='25'
                cy='25'
                r='24.5'
                transform='matrix(-1 0 0 1 50 0)'
                stroke='#42567A'
                strokeOpacity='0.5'
              />
              <path
                d='M27.4999 18.75L21.2499 25L27.4999 31.25'
                stroke='#42567A'
                strokeWidth={2}
              />
            </svg>
          </button>

          <div
            ref={newsSliderRef}
            className={`flex overflow-x-auto gap-12 overscroll-x-contain px-2 pb-2 [scrollbar-width:none] [touch-action:pan-y] [user-select:none] scroll-smooth [scroll-snap-type:x_mandatory] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-[1250px]:gap-6 max-[1250px]:pb-1 ${isNewsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onScroll={updateNewsButtons}
            onPointerDown={handleNewsPointerDown}
            onPointerMove={handleNewsPointerMove}
            onPointerUp={stopNewsDrag}
            onPointerCancel={stopNewsDrag}
          >
            {activeNews.map((news, index) => (
              <article
                key={`${activeTopic.id}-${news.year}-${index}`}
                data-news-card
                className='min-h-52.5 flex-[0_0_400px] snap-start max-[1250px]:min-h-42.5 max-[1250px]:basis-[min(320px,calc(100vw-88px))]'
              >
                <p className='mb-4 text-[25px] leading-[1.2] text-[#3877ee] max-[1250px]:mb-2.5 max-[1250px]:text-[20px]'>
                  {news.year}
                </p>
                <p className='text-[20px] leading-normal text-[#42567a] max-[1250px]:text-[16px] max-[1250px]:leading-[1.4]'>
                  {news.text}
                </p>
              </article>
            ))}
          </div>

          <button
            type='button'
            onClick={() => scrollNews(1)}
            disabled={!canNewsNext}
            className='absolute -right-2 top-[46%] z-2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-white disabled:cursor-default disabled:opacity-40 max-[1250px]:top-[44%]'
            aria-label='Следующая новость'
          >
            <svg
              width='50'
              height='50'
              viewBox='0 0 50 50'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              style={{ transform: 'rotateY(180deg)' }}
            >
              <circle
                cx='25'
                cy='25'
                r='24.5'
                transform='matrix(-1 0 0 1 50 0)'
                stroke='#42567A'
                strokeOpacity='0.5'
              />
              <path
                d='M27.4999 18.75L21.2499 25L27.4999 31.25'
                stroke='#42567A'
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
