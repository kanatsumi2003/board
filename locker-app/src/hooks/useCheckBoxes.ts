import { useLazyCheckBoxesQuery } from "@/services/boardService";
import { useEffect } from "react";

interface Props {
  onSuccess?: () => void;
  onError?: () => void;
}

function useCheckBoxes({ onSuccess, onError }: Props) {
  const [
    checkBoxes,
    { isSuccess, isLoading, isFetching, data, isUninitialized },
  ] = useLazyCheckBoxesQuery();

  useEffect(() => {
    const checkBoxesIsLoading = isLoading || isFetching;

    if (checkBoxesIsLoading || isUninitialized) {
      return;
    }
    if (!data || !data?.closed) {
      onError && onError();
      return;
    }
    if (data && data?.closed) {
      onSuccess && onSuccess();
      return;
    }
  }, [isSuccess, isLoading, isFetching, data, isUninitialized]);

  return {
    checkBoxes,
    isLoading: isLoading || isFetching,
    data: data,
  };
}

export default useCheckBoxes;
