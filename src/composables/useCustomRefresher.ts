export const useCustomRefresher = () => {
  const isRefreshing = ref(false);
  function stopRefresh() {
    isRefreshing.value = false;
  }
  function startRefresh() {
    isRefreshing.value = true;
  }
  function onRefresh(fn: () => Promise<void>) {
    startRefresh();
    fn().finally(() => {
      stopRefresh();
    });
  }
  return {
    isRefreshing,
    startRefresh,
    stopRefresh,
    onRefresh,
  };
};
