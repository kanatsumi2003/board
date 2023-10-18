interface Props {
  children: React.ReactNode;
  subtitle?: string;
}

function Title({ children, subtitle }: Props) {
  return (
    <div>
      <div
        className={`absolute top-0 left-0 right-0 bg-locker-blue h-52 rounded-b-[120px] -z-10`}
      >
        <div className="flex flex-col gap-4 justify-center items-center h-full">
          {subtitle && <div className="text-white">{subtitle}</div>}
          <div className="font-bold text-white text-5xl">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Title;
