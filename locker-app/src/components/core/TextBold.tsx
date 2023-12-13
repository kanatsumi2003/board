interface Props {
  children: string;
  className?: string;
}

function TextBold({ children, className }: Props) {
  return <span className={`${className} font-bold`}>{children}</span>;
}

export default TextBold;
