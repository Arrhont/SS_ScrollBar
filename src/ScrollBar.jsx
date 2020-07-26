import React, { useState, useEffect, useRef } from 'react';
import './ScrollBar.css';
import DefaultBar from './DefaultBar';

function Scrollbar(props) {
  const { autoHide = true, autoHideDelay = 2000, Bar = DefaultBar } = props;

  const [scrollBarY, setScrollBarY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(false);
  const [scaled, setScaled] = useState(false);
  const [cursorIsCloseToScrollBar, setCursorIsCloseToScrollBar] = useState(false);

  const lastHideEventTimer = useRef(null);
  const mouseDownY = useRef(0);
  const bar = useRef(null);

  const scrollBarHeight = bar.current
    ? bar.current.getBoundingClientRect().height
    : 0;

  useEffect(() => {
    function scrollBarShouldBeHidden() {
      if (!autoHide) {
        return false;
      }

      if (active || cursorIsCloseToScrollBar) {
        return false;
      }

      return true;
    }

    if (scrollBarShouldBeHidden()) {
      lastHideEventTimer.current = setTimeout(
        () => setVisible(false),
        autoHideDelay
      );
    } else {
      clearTimeout(lastHideEventTimer.current);
      setVisible(true);
    }
  }, [active, cursorIsCloseToScrollBar, autoHide, autoHideDelay]);

  useEffect(() => {
    function scrollBarHandler() {
      const { scrollY, innerHeight } = window;
      const { clientHeight } = document.body;
      const progress =
      scrollY / (clientHeight - (innerHeight - scrollBarHeight));
      
      setActive(true);
      setScrollBarY(progress * (innerHeight - scrollBarHeight));
      setActive(false);
    }

    window.addEventListener('scroll', scrollBarHandler);

    return () => {
      window.removeEventListener('scroll', scrollBarHandler);
    };
  }, [setScrollBarY, scrollBarHeight]);

  const startLeftClickScroll = (event) => {
    setActive(true);

    window.addEventListener('mousemove', leftClickScrolling);
    window.addEventListener('mouseup', stopLeftClickScroll, { once: true });

    event.target.setPointerCapture(event.pointerId);

    document.body.classList.add('PreventUserSelect');
    mouseDownY.current = event.clientY;
  };

  const leftClickScrolling = (event) => {
    const { innerHeight, scrollY } = window;
    const { clientHeight } = document.body;
    const windowHeight = innerHeight - scrollBarHeight;
    const mult = windowHeight / (clientHeight - windowHeight);
    const newScroll = scrollY + (event.clientY - mouseDownY.current) / mult;

    window.scrollTo(0, newScroll);

    mouseDownY.current = event.clientY;
  };

  const stopLeftClickScroll = () => {
    document.body.classList.remove('PreventUserSelect');
    window.removeEventListener('mousemove', leftClickScrolling);

    setActive(false);
  };

  return (
    <div
      className="ShowEventArea"
      onMouseEnter={() => {
        setCursorIsCloseToScrollBar(true);
      }}
      onMouseLeave={() => {
        setCursorIsCloseToScrollBar(false);
      }}
    >
      <div
        className={
          visible
            ? 'ScrollBar ScrollBar_visible'
            : 'ScrollBar ScrollBar_invisible'
        }
        style={{ transform: `translateY(${scrollBarY}px)` }}
        onPointerDown={startLeftClickScroll}
        onMouseEnter={() => setScaled(true)}
        onMouseLeave={() => setScaled(false)}
        ref={bar}
      >
        <Bar scaled={scaled}></Bar>
      </div>
    </div>
  );
}

export default Scrollbar;
