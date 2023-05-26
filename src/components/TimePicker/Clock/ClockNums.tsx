import { leadingZero } from "utils/date";
import { ClockType } from "./Clock";
import "./styles/clock-numbers.scss";

interface Props {
  type: ClockType;
  outerRadius?: number;
  innerRadius?: number;
  pointerRadius?: number;
  onClickHour?: (hour: number) => void;
  onClickMinute?: (minute: number) => void;
}

const ClockNums = ({
  type,
  outerRadius = 108,
  innerRadius = 61,
  pointerRadius = 10,
  onClickHour,
  onClickMinute,
}: Props) => {
  const hourTicks = [];
  const minuteTicks = [];
  const tickRadius = pointerRadius + 1;
  const dialRadius = outerRadius + pointerRadius;

  for (let i = 0; i < 24; i += 1) {
    const radian = (i / 6) * Math.PI;
    const outer = i > 0 && i < 13;
    const radius = outer ? outerRadius : innerRadius;
    const left = dialRadius + Math.sin(radian) * radius - tickRadius;
    const top = dialRadius - Math.cos(radian) * radius - tickRadius;
    const text = leadingZero(i);

    hourTicks.push(
      <div
        key={"hour_" + text}
        className={`clock-tick ${outer ? "outer" : "inner"}`}
        onClick={() => {
          onClickHour?.(i);
        }}
        style={{ left, top }}
      >
        <div className="text">{text}</div>
      </div>
    );
  }

  for (let i = 0; i < 60; i += 5) {
    const radian = (i / 30) * Math.PI;
    const left = dialRadius + Math.sin(radian) * outerRadius - tickRadius;
    const top = dialRadius - Math.cos(radian) * outerRadius - tickRadius;
    const text = leadingZero(i);

    minuteTicks.push(
      <div
        key={"minute_" + text}
        className="clock-tick outer"
        onClick={() => onClickMinute?.(i)}
        style={{ left, top }}
      >
        <div className="text">{text}</div>
      </div>
    );
  }

  return (
    <>
      {type === ClockType.HOURS && (
        <div className="clock-dial clock-hours">{hourTicks}</div>
      )}
      {type === ClockType.MINUTES && (
        <div className="clock-dial clock-minutes">{minuteTicks}</div>
      )}
    </>
  );
};

export default ClockNums;
