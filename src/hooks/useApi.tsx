import { useState, useCallback, useEffect } from "react";

interface ApiState<T> {
  response: T;
  loading: boolean;
  error: string | null;
}

export const useApi = <T, P>(
  serviceFn: (payload: P) => Promise<T>,
  payload: P
) => {
  const [state, setState] = useState<ApiState<T>>({
    response: {} as T,
    loading: false,
    error: null,
  });

  const callApi = useCallback(
    async (payload: P) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        const response = await serviceFn(payload);
        setState({ response, loading: false, error: null });
        console.log("API response:", response);
      } catch (error) {
        setState({
          response: {} as T,
          loading: false,
          error: "An error occurred",
        });
      }
    },
    [serviceFn] // Dependency on serviceFn
  );

  // Automatically call the API when the payload changes
  useEffect(() => {
    if (payload) {
      callApi(payload);
    }
  }, [payload, callApi]);

  return {
    ...state,
    callApi, // Return callApi to allow manual API calls if needed
  };
};
