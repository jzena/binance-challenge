import * as React from 'react'

export type AsyncStatus = 'idle' | 'resolved' | 'rejected' | 'pending'
const cache = new Map();

type InputActions = {
  onSuccess?: (data: any) => void
  onStart?: () => void
  onFinish?: () => void
  onError?: () => void
}
type AsyncBody = {
  status: AsyncStatus
  data: any | undefined
  error: any | undefined
  finsished: 'finished' | 'no-finished'
}

function useSafeDispatch(dispatch: any) {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (...args: any) => (mounted.current ? dispatch(...args) : undefined),
    [dispatch]
  )
}

const defaultInitialState: AsyncBody = {
  status: 'idle',
  data: undefined,
  error: undefined,
  finsished: 'no-finished',
}

export function useAsync(initialState?: InputActions) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{ status, data, error, finsished }, setState] = React.useReducer(
    (s: any, a: any) => ({ ...s, ...a }),
    initialStateRef.current
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    (data: any) => safeSetState({ data, status: 'resolved' }),
    [safeSetState]
  )
  const setError = React.useCallback(
    (error: any) => safeSetState({ error, status: 'rejected' }),
    [safeSetState]
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  )

  const run = React.useCallback(
    async (promise: any, cacheKey?: string, refetch?: boolean) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        )
      }
      safeSetState({ status: 'pending' })
      safeSetState({ finsished: 'no-finished' })
      initialState?.onStart?.()
      try {
        // console.log('useAsync:', {
        //   cache,
        //   cacheKey,
        //   data: cache.get(cacheKey)
        // });

        if (!refetch && cacheKey && cache.has(cacheKey)) {
          const data = cache.get(cacheKey);
          setData({...data})
          initialState?.onSuccess?.(data)
          return data
        } else{
          const data = await promise
          //set cache if active
          cacheKey && cache.set(cacheKey, data);
          setData(data)
          initialState?.onSuccess?.(data)
          return data
        }

      } catch (error) {
        const errorMsg =
          typeof error === 'object' ? JSON.stringify(error) : error
        setError(errorMsg)
        initialState?.onError?.()
        return Promise.reject(error)
      } finally {
        safeSetState({ finsished: 'finished' })
        initialState?.onFinish?.()
      }
    },
    [safeSetState, setData, setError]
  )


  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',
    isFinsished : finsished === 'finished',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}
