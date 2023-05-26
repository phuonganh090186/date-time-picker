import { useEffect, useRef, useState } from "react";
import { leadingZero } from "utils/date";
import { getHours, getMinutes } from "utils/clock";
import ClockPin from "./ClockPin";
import ClockNums from "./ClockNums";
import "./styles/clock.scss";

export enum ClockType {
  HOURS = 1,
  MINUTES = 2,
}

interface Props {
  hours: number;
  minutes: number;
  onChange: (hour: number, index: number) => void;
  onClose: () => void;
}

interface State {
  hours: number;
  minutes: number;
  type: ClockType;
}

const Clock = ({ hours, minutes, onChange, onClose }: Props) => {
  const [clockState, setClockState] = useState<State>({
    hours: hours,
    minutes: minutes,
    type: ClockType.HOURS,
  });

  const isMoving = useRef(false);

  useEffect(
    () => {
      setClockState({
        ...clockState,
        hours: hours,
        minutes: minutes,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hours, minutes]
  );

  const setTime = (e: any, isFinish?: boolean) => {
    let { offsetX, offsetY } = e;
    if (typeof offsetX === "undefined") {
      const rect = e.target.getBoundingClientRect();

      offsetX = e.changedTouches[0].clientX - rect.left;
      offsetY = e.changedTouches[0].clientY - rect.top;
    }
    if (clockState.type === ClockType.MINUTES) {
      const value = getMinutes(offsetX, offsetY, 1);
      setClockState({
        ...clockState,
        minutes: value,
      });
    }

    if (clockState.type === ClockType.HOURS) {
      const value = getHours(offsetX, offsetY, false);
      // go to minutes setting when hours setting complete
      const clockType = isFinish ? ClockType.MINUTES : ClockType.HOURS;
      setClockState({ ...clockState, hours: value, type: clockType });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    isMoving.current = true;
    setTime(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isMoving.current) {
      setTime(e, true);
      isMoving.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // MouseEvent.which is deprecated, but MouseEvent.buttons is not supported in Safari
    const isButtonPressed =
      typeof e.buttons === "undefined"
        ? e.nativeEvent.which === 1
        : e.buttons === 1;
    if (isButtonPressed) {
      setTime(e.nativeEvent);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isMoving.current) {
      isMoving.current = false;
    }
    setTime(e.nativeEvent, true);
  };

  return (
    <>
      <div className="clock">
        <div className="clock-label">
          <span
            className={clockState.type === ClockType.HOURS ? "selected" : ""}
            onClick={() => {
              setClockState({ ...clockState, type: ClockType.HOURS });
            }}
          >
            {leadingZero(clockState.hours)}
          </span>
          :
          <span
            className={clockState.type === ClockType.MINUTES ? "selected" : ""}
            onClick={() => {
              setClockState({ ...clockState, type: ClockType.MINUTES });
            }}
          >
            {leadingZero(clockState.minutes)}
          </span>
        </div>
        <div className="clock-plate">
          <div
            className="clock-pin-mask"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
          <ClockPin
            value={
              clockState.type === ClockType.HOURS
                ? clockState.hours
                : clockState.minutes
            }
            type={clockState.type}
            innerRadius={57}
            outerRadius={105}
          />
          <ClockNums type={clockState.type} />
        </div>
      </div>
      <div className="clock-control">
        <button onClick={onClose}>CANCEL</button>
        <button
          className="button-ok"
          onClick={() => {
            onChange(clockState.hours, clockState.minutes);
            onClose();
          }}
        >
          OK
        </button>
      </div>
    </>
  );
};

export default Clock;
