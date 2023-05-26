import { PickerDock } from "components/common/PickerDock";
import useModal from "components/common/Modal/useModal";
import Modal from "components/common/Modal";
import { useState } from "react";
import { leadingZero } from "utils/date";
import Clock from "./Clock/Clock";

const TimePicker = () => {
  const now = new Date();
  const { isShowing, toggle } = useModal();
  const [time, setTime] = useState({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });

  return (
    <>
      <PickerDock
        title="Time"
        type="time"
        value={`${leadingZero(
          time.hours !== 12 ? time.hours % 12 : 12
        )}:${leadingZero(time.minutes)} ${time.hours > 11 ? "pm" : "am"}`}
        onClick={toggle}
      />
      <Modal isShowing={isShowing} toggle={toggle}>
        <Clock
          hours={time.hours}
          minutes={time.minutes}
          onChange={(hours: number, minutes: number) =>
            setTime({ ...time, hours: hours, minutes: minutes })
          }
          onClose={toggle}
        />
      </Modal>
    </>
  );
};

export default TimePicker;
