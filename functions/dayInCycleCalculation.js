function dayInCycleCalculation(date) {
  // Allows string inputs, instead of millisecond values
  if (typeof date == "string") {
    date = Date.parse(date);
  }
  // Convert milliseconds to days
  const dateInDays = Math.floor(date / (24 * 60 * 60 * 1000));
  // Find position in 28 day cycle
  const dayInCycle = dateInDays % 28;
  return dayInCycle;
}

export default dayInCycleCalculation;
