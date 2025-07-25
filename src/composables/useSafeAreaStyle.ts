export function useSafeAreaStyle() {
  const menuButtonArea = uni.getMenuButtonBoundingClientRect()

  const style =  `padding-top: ${menuButtonArea.top + menuButtonArea.height}px;`;
  return { style };
}

