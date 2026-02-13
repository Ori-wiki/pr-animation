import { useMemo, useState } from 'react';

type CircleItem = {
  id: number;
  label: string;
};

const circleItems: CircleItem[] = [
  { id: 1, label: 'История' },
  { id: 2, label: 'Кино' },
  { id: 3, label: 'Литература' },
  { id: 4, label: 'Театр' },
  { id: 5, label: 'Медицина' },
  { id: 6, label: 'Наука' },
];

const desktopRadius = 268;
const mobileRadius = 199;
const targetAngle = -60;

function App() {
  const [spinIndex, setSpinIndex] = useState(0);
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
        <div className='text-[#42567a]'>01/06</div>
        <div className='flex gap-5'>
          <button className='mt-5 border-none cursor-pointer inline-flex justify-center items-center disabled:opacity-50 bg-white'>
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
          <button className='mt-5 border-none cursor-pointer inline-flex justify-center items-center disabled:opacity-50 bg-white'>
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

      <div className='mt-14 mr-0 w-[calc(100%+56px)]'>
        <div className='flex -ml-13.5 p-20 relative pt-0 pb-0'>
          <div className='m-auto overflow-hidden p-0 z-1 block'>
            <div className='w-full h-full z-1 flex box-content'>
              <div className='w-auto mr-20 block h-full'>
                <div className='flex flex-col gap-3.75 cursor-move w-100 pb-25 min-h-75'>
                  <p className='text-[25px] leading-7.5 text-left text-[#3877ee]'>
                    1981
                  </p>
                  <p className='text-[20px] leading-7.5 text-[#42567a]'>
                    zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc
                  </p>
                </div>
              </div>
              <div className='w-auto mr-20 block h-full'>
                <div className='flex flex-col gap-3.75 cursor-move w-100 pb-25 min-h-75'>
                  <p className='text-[25px] leading-7.5 text-left text-[#3877ee]'>
                    1981
                  </p>
                  <p className='text-[20px] leading-7.5 text-[#42567a]'>
                    zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc
                  </p>
                </div>
              </div>
              <div className='w-auto mr-20 block h-full'>
                <div className='flex flex-col gap-3.75 cursor-move w-100 pb-25 min-h-75'>
                  <p className='text-[25px] leading-7.5 text-left text-[#3877ee]'>
                    1981
                  </p>
                  <p className='text-[20px] leading-7.5 text-[#42567a]'>
                    zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc
                  </p>
                </div>
              </div>
              <div className='w-auto mr-20 block h-full'>
                <div className='flex flex-col gap-3.75 cursor-move w-100 pb-25 min-h-75'>
                  <p className='text-[25px] leading-7.5 text-left text-[#3877ee]'>
                    1981
                  </p>
                  <p className='text-[20px] leading-7.5 text-[#42567a]'>
                    zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc
                  </p>
                </div>
              </div>
              <div className='w-auto mr-20 block h-full'>
                <div className='flex flex-col gap-3.75 cursor-move w-100 pb-25 min-h-75'>
                  <p className='text-[25px] leading-7.5 text-left text-[#3877ee]'>
                    1981
                  </p>
                  <p className='text-[20px] leading-7.5 text-[#42567a]'>
                    zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc zxc
                  </p>
                </div>
              </div>
            </div>
            <button></button>
            <button></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
