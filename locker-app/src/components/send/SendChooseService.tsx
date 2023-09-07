import { ORDER_TYPE } from "@/interfaces/order";
import store from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useEffect, useState } from "react";
import SendChooseType from "./SendChooseType";
import SendServices from "./SendServices";

function SendChooseService({ onNext }: { onNext: () => void }) {
  const [type, setType] = useState<ORDER_TYPE>();

  useEffect(() => {
    store.dispatch(
      setOrderRequest({
        type: type,
      })
    );
    if (type && type == ORDER_TYPE.STORAGE) {
      onNext();
    }
  }, [type]);

  if (type && type == ORDER_TYPE.LAUNDRY) {
    return (
      <SendServices
        onNext={onNext}
        clearType={() => setType(undefined)}
        onBack={() => setType(undefined)}
      />
    );
  } else return <SendChooseType setType={setType} />;
}

export default SendChooseService;
