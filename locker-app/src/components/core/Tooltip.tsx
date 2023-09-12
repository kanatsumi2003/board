interface Props {
  children: string | React.ReactNode;
  content: string | React.ReactNode;
}

export const Tooltip = ({ children, content }: Props) => {
  return (
    <>
      <div className="relative group">
        {children}
        <div className="group-hover:opacity-100 opacity-0 absolute -bottom-4 right-0 translate-y-full transition-all px-4 py-2 bg-gray-500 text-white rounded-lg w-max z-20 max-w-[300px]">
          {content}
        </div>
        {/* <div className="tooltip-arrow" data-popper-arrow></div> */}
      </div>
    </>
  );
};
