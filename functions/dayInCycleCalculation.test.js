import dayInCycleCalculation from "./dayInCycleCalculation";

test("dayInCycleCalculation to be 0", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-24"))).toBe(0);
});
test("dayInCycleCalculation to be 1", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-25"))).toBe(1);
});
test("dayInCycleCalculation to be 4", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-28"))).toBe(4);
});
test("dayInCycleCalculation to be 6", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-30"))).toBe(6);
});
test("dayInCycleCalculation to be NaN", () => {
  expect(dayInCycleCalculation(Date.parse("DATE"))).toBe(NaN);
});
test("dayInCycleCalculation to be 8", () => {
  expect(dayInCycleCalculation(Date.parse("2024-11-01"))).toBe(8);
});
test("dayInCycleCalculation to be 3", () => {
  expect(dayInCycleCalculation("2024-11-24")).toBe(3);
});
