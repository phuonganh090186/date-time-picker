import { ClockType } from "./Clock";
import "./styles/clock-wheel.scss";

interface Props {
  value: number;
  type: ClockType;
  innerRadius: number;
  outerRadius: number;
}

const ClockPin = ({ value, type, innerRadius, outerRadius }: Props) => {
  const getAngleStyle = () => {
    const max = type === ClockType.HOURS ? 12 : 60;
    let angle = (360 / max) * value;
    let isInner = type === ClockType.HOURS && value === 0 ? true : false;

    if (type === ClockType.HOURS && value > 12) {
      angle -= 360; // round up angle to max 360 degrees
      isInner = true;
    }

    return {
      height: isInner ? `${innerRadius}px` : `${outerRadius}px`,
      transform: `rotateZ(${angle}deg)`,
    };
  };

  return (
    <>
      <div className="clock-pin" />
      <div style={getAngleStyle()} className="clock-pointer">
        <div className="clock-thumb"></div>
      </div>
    </>
  );
};

export default ClockPin;
