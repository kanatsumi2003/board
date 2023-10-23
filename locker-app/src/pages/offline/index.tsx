import Offline from "@/assets/offline.png";

function MaintainPage() {
  return (
    <div className="p-10 h-full flex flex-col gap-12 justify-center items-center text-center">
      <img src={Offline} alt="" className="object-scale-down h-[500px]" />
      <div className="font-bold">
        Locker hiện đang đang không có kết nối mạng <br /> Bạn vui lòng thử lại
        sau.
      </div>
    </div>
  );
}

export default MaintainPage;
