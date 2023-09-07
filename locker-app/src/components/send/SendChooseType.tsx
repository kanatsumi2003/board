import { ORDER_TYPE } from "@/interfaces/order";
import { FaBoxesPacking } from "react-icons/fa6";
import { MdLocalLaundryService } from "react-icons/md";
import BackButton from "../core/BackButton";
import { useSelector } from "react-redux";
import { AppState } from "@/stores";
import { formatCurrency } from "@/utils/formatter";

const TypeItem = ({
  name,
  description,
  onClick,
  note,
  icon,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  note?: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="bg-locker-blue overflow-hidden hover:bg-opacity-80 rounded-lg cursor-pointer p-10 text-center max-w-[280px] shadow-md box-border relative z-30 w-full font-bold text-white transition-all duration-300 group ring-offset-2 ring-1 ease focus:outline-none h-full max-h-[400px] flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <span className="absolute bottom-0 right-0 w-24 h-40 -mb-16 -mr-12 transition-all duration-300 ease-out transform rotate-45 translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
        <span className="absolute top-0 left-2 w-40 h-24 -mt-6 -ml-24 transition-all duration-300 ease-out transform -rotate-45 -translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
        {icon}
        <div className="text-3xl font-bold">{name}</div>
        <div>{description}</div>
      </div>
      <div className="font-normal text-xs">{note}</div>
    </div>
  );
};

function SendChooseType({ setType }: { setType: (type: ORDER_TYPE) => void }) {
  const { orderSettings } = useSelector((state: AppState) => state.setting);

  return (
    <div className="flex justify-center gap-8 items-center h-full">
      <TypeItem
        icon={<MdLocalLaundryService className={"text-[120px] m-auto"} />}
        name="Giặt sấy"
        description={`Giặt sấy chất lượng cao với nhiều dịch vụ đa dạng.`}
        note={`Chúng tôi sẽ phụ thu ${formatCurrency(
          orderSettings?.extraFee ?? 0
        )}/giờ nếu vượt quá ${
          orderSettings?.maxTimeInHours ?? 0
        } giờ không nhận lại hàng.`}
        onClick={() => setType(ORDER_TYPE.LAUNDRY)}
      />
      <TypeItem
        icon={<FaBoxesPacking className={"text-[120px] m-auto"} />}
        name="Gửi đồ"
        description={`Gửi đồ tiện lợi với giá niêm yết ${formatCurrency(
          orderSettings?.storagePrice ?? 0
        )}/giờ.`}
        onClick={() => setType(ORDER_TYPE.STORAGE)}
      />
      <BackButton />
    </div>
  );
}

export default SendChooseType;
