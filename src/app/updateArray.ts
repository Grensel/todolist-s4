export const updateArrayts = <T>(array: T[], value: T): T[] => {
  if (array.includes(value)) {
    return array
  } else {
    return [...array, value]
  }
}
