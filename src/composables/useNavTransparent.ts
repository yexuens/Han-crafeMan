export const useNavTransparent = () => {
  const transparent = ref(true);
  const menuSize = uni.getMenuButtonBoundingClientRect();

  function onScroll(e) {
    transparent.value = e.scrollTop < menuSize.top - 18;
  }

  return {
    transparent,
    onScroll,
  };
};
