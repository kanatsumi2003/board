interface Props {
  children?: number;
}

function BoxNumber({ children }: Props) {
  return (
    <div className="text-[160px] font-bold text-locker-blue p-4 rounded-full">
      {children}
    </div>
  );
}

export default BoxNumber;
