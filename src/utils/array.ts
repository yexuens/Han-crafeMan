export function areArraysEqual<T>(arrA: T[], arrB: T[]): boolean {
  if (arrA.length !== arrB.length) {
    return false;
  }
  arrA = arrA.sort();
  arrB = arrB.sort();
  return arrA.every((value, index) => value === arrB[index]);
}
