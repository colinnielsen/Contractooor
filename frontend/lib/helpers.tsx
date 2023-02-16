export const truncateString = (
  string: string,
  leftAndRightCharCount: number = 4
) =>
  `${string.slice(0, leftAndRightCharCount + 1)}...${string.slice(
    -leftAndRightCharCount
  )}`;
