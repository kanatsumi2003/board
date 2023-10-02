interface Props {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const Card = ({ children, className }: Props) => {
  return (
    <div className={`${className} bg-white shadow-xl px-12 py-8 rounded-3xl`}>
      {children}
    </div>
  );
};
