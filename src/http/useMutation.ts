import { ref, computed, type Ref, type ComputedRef } from "vue";

type MutationStatus = "idle" | "loading" | "success" | "error";
type PaginationStatus = "idle" | "loading" | "hasMore" | "completed";

// 更新 options 的类型，添加可选的 select 方法和分页相关配置
interface UseMutationOptions<TData, TSelectedData> {
  select?: (data: TData) => TSelectedData;
  // 是否启用分页模式
  pagination?: boolean;
  // 判断是否还有更多数据的函数，默认根据数组长度判断
  hasMore?: (data: TSelectedData) => boolean;
}

// 更新返回类型接口，添加分页相关属性
interface UseMutationReturnType<TSelectedData, TVariables> {
  data: Ref<TSelectedData | null>;
  isLoading: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
  isIdle: ComputedRef<boolean>;
  error: Ref<Error | null>;
  status: Ref<MutationStatus>;
  mutate: (variables: TVariables) => Promise<TSelectedData | undefined>;
  reset: () => void;
  // 分页相关属性
  paginationStatus: Ref<PaginationStatus>;
  isCompleted: ComputedRef<boolean>;
  hasMore: ComputedRef<boolean>;
  loadMore: (variables: TVariables) => Promise<TSelectedData | undefined>;
}

/**
 * 一个模仿 vue-query 的 useMutation 的 Vue 3 组合式函数，用于执行异步副作用操作。
 * @param mutationFn 一个执行异步操作并返回 Promise 的函数。
 * @param options 可选的配置项，包含一个 `select` 函数用于转换数据。
 * @template TData - mutationFn 成功时返回的 **原始** 数据类型。
 * @template TVariables - mutationFn 接收的参数变量的类型。
 * @template TSelectedData - `select` 函数返回的 **转换后** 的数据类型。
 */
export function useMutation<
  TData = any,
  TVariables = void,
  TSelectedData = TData, // 默认情况下，转换后的类型和原始类型一致
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TSelectedData>,
): UseMutationReturnType<TSelectedData, TVariables> {
  const status = ref<MutationStatus>("idle");
  // data ref 现在使用 TSelectedData 类型
  const data: Ref<TSelectedData | null> = ref(null);
  const error = ref<Error | null>(null);

  // 分页状态
  const paginationStatus = ref<PaginationStatus>("idle");

  const isLoading = computed(() => status.value === "loading");
  const isSuccess = computed(() => status.value === "success");
  const isError = computed(() => status.value === "error");
  const isIdle = computed(() => status.value === "idle");

  // 分页相关计算属性
  const isCompleted = computed(() => paginationStatus.value === "completed");
  const hasMore = computed(() => paginationStatus.value === "hasMore");

  const reset = () => {
    status.value = "idle";
    data.value = null;
    error.value = null;
    paginationStatus.value = "idle";
  };

  // 判断是否还有更多数据的默认逻辑
  const defaultHasMore = (result: TSelectedData): boolean => {
    // 如果是数组且长度为0，则没有更多数据
    if (Array.isArray(result)) {
      return result.length > 0;
    }
    // 对于非数组类型，需要用户提供 hasMore 函数
    return true;
  };

  const mutate = async (
    variables: TVariables,
  ): Promise<TSelectedData | undefined> => {
    status.value = "loading";
    error.value = null;

    try {
      // 1. 从 API 获取原始数据
      const rawData = await mutationFn(variables);

      // 2. 如果提供了 select 函数，则使用它来转换数据
      const finalData = options?.select
        ? options.select(rawData)
        : (rawData as unknown as TSelectedData); // 如果没有 select，则类型默认为 TData

      // 3. 处理分页状态
      if (options?.pagination) {
        const hasMoreData = options.hasMore
          ? options.hasMore(finalData)
          : defaultHasMore(finalData);

        paginationStatus.value = hasMoreData ? "hasMore" : "completed";
      }

      // 4. 将最终处理过的数据存入 data ref
      data.value = finalData;
      status.value = "success";

      // 5. 返回最终处理过的数据
      return finalData;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e;
      } else {
        error.value = new Error("An unknown mutation error occurred");
      }
      status.value = "error";
      // 分页状态下也更新状态
      if (options?.pagination) {
        paginationStatus.value = "idle";
      }
      return undefined;
    }
  };

  // 专门用于加载更多数据的方法
  const loadMore = async (
    variables: TVariables,
  ): Promise<TSelectedData | undefined> => {
    // 如果已经是完成状态或正在加载，则不执行
    if (paginationStatus.value === "completed" || status.value === "loading") {
      return Promise.resolve(undefined);
    }

    paginationStatus.value = "loading";
    status.value = "loading";
    error.value = null;

    try {
      // 1. 从 API 获取原始数据
      const rawData = await mutationFn(variables);

      // 2. 如果提供了 select 函数，则使用它来转换数据
      const finalData = options?.select
        ? options.select(rawData)
        : (rawData as unknown as TSelectedData);

      // 3. 处理分页状态
      const hasMoreData = options?.hasMore
        ? options.hasMore(finalData)
        : defaultHasMore(finalData);

      paginationStatus.value = hasMoreData ? "hasMore" : "completed";

      // 4. 如果是数组类型且当前已有数据，则追加而不是替换
      if (
        Array.isArray(finalData) &&
        Array.isArray(data.value) &&
        data.value.length > 0
      ) {
        data.value = [...data.value, ...finalData] as unknown as TSelectedData;
      } else {
        // 否则直接设置数据
        data.value = finalData;
      }

      status.value = "success";
      return finalData;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e;
      } else {
        error.value = new Error("An unknown mutation error occurred");
      }
      status.value = "error";
      paginationStatus.value = "idle";
      return undefined;
    }
  };

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    isIdle,
    error,
    status,
    mutate,
    reset,
    // 分页相关属性
    paginationStatus,
    isCompleted,
    hasMore,
    loadMore,
  };
}
