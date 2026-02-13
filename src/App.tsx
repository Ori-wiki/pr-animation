import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CircleItem = {
  id: number;
  label: string;
};

type NewsItem = {
  year: string;
  text: string;
};

const circleItems: CircleItem[] = [
  { id: 1, label: 'История' },
  { id: 2, label: 'Кино' },
  { id: 3, label: 'Литература' },
  { id: 4, label: 'Театр' },
  { id: 5, label: 'Медицина' },
  { id: 6, label: 'Наука' },
];

const newsItems: NewsItem[] = [
  { year: '1981', text: 'Запущена первая версия IBM PC, что ускорило массовое развитие персональных компьютеров.' },
  { year: '1982', text: 'Получен Нобель по физике за исследования квантовой электроники и лазерных технологий.' },
  { year: '1983', text: 'ARPANET перешла на TCP/IP, и это стало фундаментом современного интернета.' },
  { year: '1984', text: 'Выпущен Macintosh с графическим интерфейсом, который изменил пользовательский опыт.' },
  { year: '1985', text: 'Unix-системы получили новый виток развития в корпоративной инфраструктуре.' },
  { year: '1986', text: 'Станция Мир выведена на орбиту и стала ключевым этапом долговременной космонавтики.' },
];

const desktopRadius = 268;
const mobileRadius = 200;
const targetAngle = -60;
const newsDragMultiplier = 1.8;

function App() {
  const [spinIndex, setSpinIndex] = useState(0);
  const [canNewsPrev, setCanNewsPrev] = useState(false);
  const [canNewsNext, setCanNewsNext] = useState(true);
  const newsSliderRef = useRef<HTMLDivElement | null>(null);
  const newsDragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });
  const itemCount = circleItems.length;
  const angleStep = 360 / itemCount;

  const activeIndex = useMemo(
    () => ((spinIndex % itemCount) + itemCount) % itemCount,
    [spinIndex, itemCount],
  );

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

    const firstCard = slider.querySelector('[data-news-card]') as HTMLElement | null;
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

    slider.classList.add('is-dragging');
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
    slider.classList.remove('is-dragging');
    slider.releasePointerCapture(event.pointerId);
    updateNewsButtons();
  };

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

      <div className='timeline-circle w-134 h-134 max-[1250px]:w-100 max-[1250px]:h-100 flex justify-center items-center mx-auto -mt-22.5 max-[1250px]:mt-25'>
        <div className='border w-full h-full rounded-full border-[#d0d5e0]'></div>
        <div
          className='circle-nav'
          style={
            {
              '--nav-rotation': `${rotationDeg}deg`,
              '--desktop-radius': `${desktopRadius}px`,
              '--mobile-radius': `${mobileRadius}px`,
            } as React.CSSProperties
          }
        >
          {circleItems.map((item, index) => {
            const angle = angleStep * index - 90;
            const isActive = index === activeIndex;

            return (
              <button
                key={item.id}
                type='button'
                className={`circle-node ${isActive ? 'circle-node--active' : 'circle-node--inactive'}`}
                style={{ '--item-angle': `${angle}deg` } as React.CSSProperties}
                onClick={() => handleCircleSelect(index)}
                aria-label={`${item.id}. ${item.label}`}
                aria-pressed={isActive}
              >
                <span
                  className='circle-node-inner'
                  style={{ transform: `rotate(${-rotationDeg}deg)` }}
                >
                  {isActive ? (
                    <>
                      <span className='circle-node-number'>{item.id}</span>
                      <span className='circle-node-label'>{item.label}</span>
                    </>
                  ) : (
                    <span className='circle-node-dot' aria-hidden='true'></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='flex gap-20 font-bold text-[200px] -mt-105 mx-auto max-[1250px]:text-[100px] max-[1250px]:-mt-67.5'>
        <span className='text-[#5d5fef]'>1980</span>
        <span className='text-[#ef5da8]'>1986</span>
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
        <div className='news-slider-shell px-20 max-[1250px]:px-7'>
          <button
            type='button'
            onClick={() => scrollNews(-1)}
            disabled={!canNewsPrev}
            className='news-slider-arrow news-slider-arrow--left'
            aria-label='Предыдущая новость'
          >
            <svg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='25' cy='25' r='24.5' transform='matrix(-1 0 0 1 50 0)' stroke='#42567A' strokeOpacity='0.5' />
              <path d='M27.4999 18.75L21.2499 25L27.4999 31.25' stroke='#42567A' strokeWidth={2} />
            </svg>
          </button>

          <div
            ref={newsSliderRef}
            className='news-slider'
            onScroll={updateNewsButtons}
            onPointerDown={handleNewsPointerDown}
            onPointerMove={handleNewsPointerMove}
            onPointerUp={stopNewsDrag}
            onPointerCancel={stopNewsDrag}
          >
            {newsItems.map((news, index) => (
              <article key={`${news.year}-${index}`} data-news-card className='news-card'>
                <p className='news-card-year'>{news.year}</p>
                <p className='news-card-text'>{news.text}</p>
              </article>
            ))}
          </div>

          <button
            type='button'
            onClick={() => scrollNews(1)}
            disabled={!canNewsNext}
            className='news-slider-arrow news-slider-arrow--right'
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
              <circle cx='25' cy='25' r='24.5' transform='matrix(-1 0 0 1 50 0)' stroke='#42567A' strokeOpacity='0.5' />
              <path d='M27.4999 18.75L21.2499 25L27.4999 31.25' stroke='#42567A' strokeWidth={2} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
