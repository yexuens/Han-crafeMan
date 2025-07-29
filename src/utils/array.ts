export function areArraysEqual<T>(arrA: T[], arrB: T[]): boolean {
  if (arrA.length !== arrB.length) {
    return false;
  }
  return arrA.every((value, index) => value === arrB[index]);
}
