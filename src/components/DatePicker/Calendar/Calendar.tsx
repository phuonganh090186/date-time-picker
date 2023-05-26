import { YearDropdown, YearDropdownItem } from "./YearDropdown";
import ArrowBack from "assets/images/arrow_back.svg";
import ArrowForward from "assets/images/arrow_forward.svg";
import { useEffect, useState } from "react";
import { getDateFromDateString, getDateStringFromTimestamp } from "utils/date";
import "./styles/calendar.scss";

interface DayDetails {
  date: number; // date of month
  day: number; // date of week
  monthIndex: number; // -1: prev month, 0: this month, 1: next month
  timestamp: number; // unix time
  dayString: string; // name of weekday
}

interface CalendarState {
  year: number;
  month: number;
  monthDetails: DayDetails[];
}

interface Props {
  inputDate?: string;
  onChange?: (date: string) => void;
  onClose?: () => void;
}

const Calendar = ({ inputDate, onChange, onClose }: Props) => {
  // Today timestamp
  const oneDay = 60 * 60 * 24 * 1000;
  const todayTimestamp =
    Date.now() -
    (Date.now() % oneDay) +
    new Date().getTimezoneOffset() * 1000 * 60;
  // calendar state
  const toDay = new Date();
  const thisYear = toDay.getFullYear();
  const thisMonth = toDay.getMonth();
  const [selectedDay, setSelectedDay] = useState(todayTimestamp);
  const [calendarState, setCalendarState] = useState<CalendarState>({
    year: 0,
    month: 0,
    monthDetails: [],
  });

  // Define years, month, weekdays map
  const genYears = (): YearDropdownItem[] => {
    const yearsMap = [];
    for (let i = 1900; i <= 2100; i++) {
      const yearItem = {
        id: i,
        name: i.toString(),
      };
      yearsMap.push(yearItem);
    }

    return yearsMap;
  };
  const yearsMap = genYears();
  const daysMap = ["S", "M", "T", "W", "T", "F", "S"];
  const monthsMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getNumberOfDays = (year: number, month: number) => {
    return 40 - new Date(year, month, 40).getDate();
  };

  // Get day details return DayDetails
  const getDayDetails = (args: {
    index: number;
    firstDay: number;
    month: number;
    year: number;
    numberOfDays: number;
  }) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let monthIndex = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      monthIndex,
      timestamp,
      dayString: daysMap[day],
    };
  };

  // Get DayDetails of each day in month
  const getMonthDetails = (year: number, month: number) => {
    let firstDay = new Date(year, month, 1).getDay();
    let numberOfDays = getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }

    return monthArray;
  };

  const isSelectedDay = (day: { timestamp: number }) => {
    return day.timestamp === selectedDay;
  };

  const getMonthStr = (month: number) =>
    monthsMap[Math.max(Math.min(11, month), 0)] || "Month";

  // On click day
  const onDayClick = (day: DayDetails) => {
    setSelectedDay(day.timestamp);
    onChange?.(getDateStringFromTimestamp(day.timestamp));
    onClose?.();
  };

  // Change year by selected from dropdown
  const onYearChange = (yearInput: number) => {
    let month = calendarState.month;
    setCalendarState({
      year: yearInput,
      month: month,
      monthDetails: getMonthDetails(yearInput, month),
    });
  };

  // Change month by click back, forward
  const onMonthChange = (offset: number) => {
    let newMonth = calendarState.month + offset;
    let newYear = calendarState.year;
    if (newMonth === -1) {
      newMonth = 11;
      newYear--;
    } else if (newMonth === 12) {
      newMonth = 0;
      newYear++;
    }
    setCalendarState({
      year: newYear,
      month: newMonth,
      monthDetails: getMonthDetails(newYear, newMonth),
    });
  };

  // Init calendar
  useEffect(() => {
    const dateData = getDateFromDateString(inputDate);

    if (dateData !== null) {
      setCalendarState({
        year: dateData.year,
        month: dateData.month,
        monthDetails: getMonthDetails(dateData.year, dateData.month),
      });
      setSelectedDay(
        new Date(dateData.year, dateData.month, dateData.date).getTime()
      );
    } else {
      setCalendarState({
        year: thisYear,
        month: thisMonth,
        monthDetails: getMonthDetails(thisYear, thisMonth),
      });
      setSelectedDay(todayTimestamp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *  Renderer calendar days
   */
  const renderCalendar = () => {
    let days = calendarState.monthDetails.map((day, index) => {
      return (
        <div
          className={
            "c-day-container " +
            (day.monthIndex !== 0 ? " disabled" : "") +
            (isSelectedDay(day) ? " highlight" : "")
          }
          key={index}
        >
          <div className="cdc-day" onClick={() => onDayClick(day)}>
            <span>{day.date}</span>
          </div>
        </div>
      );
    });

    return (
      <div className="c-container">
        <div className="cc-head">
          {daysMap.map((d, i) => (
            <div key={i} className="cch-name">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  };

  return (
    <div className="cld-container">
      <div className="cld-head">
        <div className="cldh-container">
          <YearDropdown
            options={yearsMap}
            title={`${getMonthStr(calendarState.month)} ${calendarState.year} `}
            selectedIndex={calendarState.year}
            onChange={(index: number) => {
              onYearChange(index);
            }}
          />
          <div className="cldh-button">
            <div className="cldhb-inner" onClick={() => onMonthChange(-1)}>
              <img src={ArrowBack} alt="icon-back" />
            </div>

            <div className="cldhb-inner" onClick={() => onMonthChange(1)}>
              <img src={ArrowForward} alt="icon-forward" />
            </div>
          </div>
        </div>
      </div>
      <div className="cld-body">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;
