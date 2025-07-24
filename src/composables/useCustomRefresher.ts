export const useCustomRefresher = () => {
  const isRefreshing = ref(false);
  const enableRefresh = ref(true);

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
  function enable() {
    enableRefresh.value = true;
  }
  function disable() {
    enableRefresh.value = false;
  }

  return {
    isRefreshing,
    startRefresh,
    stopRefresh,
    enableRefresh,
    onRefresh,
    enable,
    disable,
  };
};
