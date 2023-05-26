import { PickerDock } from "components/common/PickerDock";
import useModal from "components/common/Modal/useModal";
import Modal from "components/common/Modal";
import Calendar from "./Calendar/Calendar";
import { useState } from "react";
import { getDateStringFromTimestamp } from "utils/date";

const DatePicker = () => {
  const { isShowing, toggle } = useModal();
  const [date, setDate] = useState(
    getDateStringFromTimestamp(new Date().getTime())
  );

  const onDayChange = (date: string) => {
    setDate(date);
  };

  return (
    <>
      <PickerDock title="Date Mobile" value={date} onClick={toggle} />
      <Modal isShowing={isShowing} toggle={toggle}>
        <Calendar inputDate={date} onChange={onDayChange} onClose={toggle} />
      </Modal>
    </>
  );
};

export default DatePicker;
