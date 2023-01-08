import { Accessor, onCleanup } from 'solid-js';

type onMoveFn = (el: HTMLElement) => void;

declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      draggable: onMoveFn;
    }
  }
}

export const draggable = (el: HTMLElement, accessor: Accessor<onMoveFn>): void => {
  const onMove = accessor();
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e: MouseEvent) => {
    isDown = true;
    el.classList.add('active');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDown = false;
    el.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    isDown = false;
    el.style.cursor = 'grab';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const deltaX = (x - startX) * 2;
    el.scrollLeft = scrollLeft - deltaX;

    onMove?.(el);
  };

  el.addEventListener('mousedown', handleMouseDown);
  el.addEventListener('mouseleave', handleMouseLeave);
  el.addEventListener('mouseup', handleMouseUp);
  el.addEventListener('mousemove', handleMouseMove);

  onCleanup(() => {
    el.removeEventListener('mousedown', handleMouseDown);
    el.removeEventListener('mouseleave', handleMouseLeave);
    el.removeEventListener('mouseup', handleMouseUp);
    el.removeEventListener('mousemove', handleMouseMove);
  });
};
