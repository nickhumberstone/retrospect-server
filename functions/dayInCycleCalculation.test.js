import dayInCycleCalculation from "./dayInCycleCalculation";

test("dayInCycleCalculation to be 0", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-11"))).toBe(0);
});
test("dayInCycleCalculation to be 1", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-12"))).toBe(1);
});
test("dayInCycleCalculation to be 4", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-15"))).toBe(4);
});
test("dayInCycleCalculation to be 6", () => {
  expect(dayInCycleCalculation(Date.parse("2024-10-17"))).toBe(6);
});
test("dayInCycleCalculation to be NaN", () => {
  expect(dayInCycleCalculation(Date.parse("DATE"))).toBe(NaN);
});
test("dayInCycleCalculation to be 8", () => {
  expect(dayInCycleCalculation(Date.parse("2024-11-15"))).toBe(8);
});
test("dayInCycleCalculation to be 3", () => {
  expect(dayInCycleCalculation("2024-11-10")).toBe(3);
});
