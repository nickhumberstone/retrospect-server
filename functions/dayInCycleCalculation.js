function dayInCycleCalculation(date) {
  // Allows string inputs, instead of millisecond values
  if (typeof date == "string") {
    date = Date.parse(date);
  }
  // Convert milliseconds to days
  const dateInDays = Math.floor(date / (24 * 60 * 60 * 1000));
  // Find position in 28 day cycle (index is 0, so 27)
  const dayInCycle = dateInDays % 27;
  return dayInCycle;
}

export default dayInCycleCalculation;
