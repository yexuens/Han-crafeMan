import { ref, computed, type Ref, type ComputedRef } from 'vue';

type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

// 更新 options 的类型，添加可选的 select 方法
interface UseMutationOptions<TData, TSelectedData> {
  select?: (data: TData) => TSelectedData;
}

// 更新返回类型接口，使其泛型与 TSelectedData 关联
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
  TSelectedData = TData // 默认情况下，转换后的类型和原始类型一致
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TSelectedData>
): UseMutationReturnType<TSelectedData, TVariables> {

  const status = ref<MutationStatus>('idle');
  // data ref 现在使用 TSelectedData 类型
  const data: Ref<TSelectedData | null> = ref(null);
  const error = ref<Error | null>(null);

  const isLoading = computed(() => status.value === 'loading');
  const isSuccess = computed(() => status.value === 'success');
  const isError = computed(() => status.value === 'error');
  const isIdle = computed(() => status.value === 'idle');

  const reset = () => {
    status.value = 'idle';
    data.value = null;
    error.value = null;
  };

  const mutate = async (variables: TVariables): Promise<TSelectedData | undefined> => {
    status.value = 'loading';
    error.value = null;

    try {
      // 1. 从 API 获取原始数据
      const rawData = await mutationFn(variables);

      // 2. 如果提供了 select 函数，则使用它来转换数据
      const finalData = options?.select
        ? options.select(rawData)
        : (rawData as unknown as TSelectedData); // 如果没有 select，则类型默认为 TData

      // 3. 将最终处理过的数据存入 data ref
      data.value = finalData;
      status.value = 'success';

      // 4. 返回最终处理过的数据
      return finalData;

    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e;
      } else {
        error.value = new Error('An unknown mutation error occurred');
      }
      status.value = 'error';
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
  };
}
