/**
 * Validates that the input string is a valid date formatted as "mm/dd/yyyy"
 */
export const isValidDate = (dateString: string) => {
  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

  // Parse the date parts to integers
  var parts = dateString.split("/");
  var day = parseInt(parts[1], 10);
  var month = parseInt(parts[0], 10);
  var year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
};

/**
 * Get day string formatted as "mm/dd/yyyy" from timestamp
 */
export const getDateStringFromTimestamp = (timestamp: number) => {
  let dateObject = new Date(timestamp);
  let month = dateObject.getMonth() + 1;
  let date = dateObject.getDate();
  return (
    (month < 10 ? "0" + month : month) +
    "/" +
    (date < 10 ? "0" + date : date) +
    "/" +
    dateObject.getFullYear()
  );
};

/**
 * Get {month,day,year} from day string formatted as "mm/dd/yyyy"
 */
export const getDateFromDateString = (dateValue?: string) => {
  if (!dateValue) return null;
  if (!isValidDate(dateValue)) return null;
  let dateData = dateValue.split("/").map((d) => parseInt(d, 10));
  if (dateData.length < 3) return null;

  let month = dateData[0] - 1;
  let date = dateData[1];
  let year = dateData[2];
  return { year, month, date };
};

/**
 * Add 0 before to day/month/hour/minute to get 2 digits
 */
export const leadingZero = (num: number) => (num < 10 ? "0" : "") + num;

export const verifyDateInput = (input:number) => {
    
}