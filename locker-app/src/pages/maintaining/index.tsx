import LockerMaintaining from "@/assets/locker_maintaining.png";

function MaintainPage() {
  return (
    <div className="p-10 h-full flex flex-col gap-12 justify-center items-center text-center">
      <img
        src={LockerMaintaining}
        alt=""
        className="object-scale-down h-[400px]"
      />
      <div className="text-2xl font-bold">
        Locker hiện đang tạm ngưng để bảo trì <br /> Bạn vui lòng thử lại sau.
      </div>
    </div>
  );
}

export default MaintainPage;
