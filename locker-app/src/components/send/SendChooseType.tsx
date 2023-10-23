import { ORDER_TYPE } from "@/interfaces/order";
import { AppState } from "@/stores";
import { formatCurrency } from "@/utils/formatter";
import { FaBoxesPacking } from "react-icons/fa6";
import { MdLocalLaundryService } from "react-icons/md";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";

interface TypeItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  note?: string;
  onClick: () => void;
  className?: string;
}

const TypeItem = ({
  name,
  description,
  onClick,
  note,
  className,
  icon,
}: TypeItemProps) => {
  return (
    <div
      className={`${className} overflow-hidden hover:bg-opacity-80 rounded-lg cursor-pointer p-12 text-center lg:max-w-[400px] shadow-md box-border relative z-30 w-full font-bold text-white transition-all duration-300 group ring-offset-2 ring-1 ease focus:outline-none h-full max-h-[480px] flex lg:flex-col justify-between items-center`}
      onClick={onClick}
    >
      <div className="flex lg:flex-col gap-2">
        <span className="absolute bottom-0 right-0 w-24 h-40 -mb-16 -mr-12 transition-all duration-300 ease-out transform rotate-45 translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
        <span className="absolute top-0 left-2 w-40 h-24 -mt-6 -ml-24 transition-all duration-300 ease-out transform -rotate-45 -translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
        {icon}
      </div>
      <div className="flex flex-col gap-4 max-w-[400px] justify-center">
        <div className="text-5xl font-bold">{name}</div>
        <div className="text-xl">{description}</div>
        <div className="flex items-end h-24">
          <div className="font-normal text-base">{note}</div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  setType: (type: ORDER_TYPE) => void;
}

function SendChooseType({ setType }: Props) {
  const { orderSettings } = useSelector((state: AppState) => state.setting);
  const { locker } = useSelector((state: AppState) => state.locker);

  return (
    <div className="h-full p-12 flex-col gap-12 justify-between grid grid-cols-5">
      <div className="md:col-span-5 flex justify-center gap-24 items-center md:flex-col xl:flex-row">
        {locker?.orderTypes.includes(ORDER_TYPE.LAUNDRY) && (
          <TypeItem
            icon={
              <MdLocalLaundryService
                className={"text-[160px] lg:text-[140px] m-auto"}
              />
            }
            name="Giặt sấy"
            description={`Giặt sấy chất lượng cao với nhiều dịch vụ đa dạng.`}
            note={`Chúng tôi sẽ phụ thu ${formatCurrency(
              orderSettings?.extraFee ?? 0
            )}/giờ nếu vượt quá ${
              orderSettings?.maxTimeInHours ?? 0
            } giờ không nhận lại hàng.`}
            onClick={() => setType(ORDER_TYPE.LAUNDRY)}
            className="bg-locker-blue"
          />
        )}
        {locker?.orderTypes.includes(ORDER_TYPE.STORAGE) && (
          <TypeItem
            icon={
              <FaBoxesPacking
                className={"text-[160px] lg:text-[140px] m-auto"}
              />
            }
            name="Gửi đồ"
            description={`Gửi đồ tiện lợi với giá niêm yết ${formatCurrency(
              orderSettings?.storagePrice ?? 0
            )}/giờ.`}
            onClick={() => setType(ORDER_TYPE.STORAGE)}
            className="bg-locker-green"
          />
        )}
      </div>
      <BackButton />
    </div>
  );
}

export default SendChooseType;
