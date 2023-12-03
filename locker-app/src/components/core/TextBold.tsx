interface Props {
  children: string;
}

function TextBold({ children }: Props) {
  return <span className="font-bold">{children}</span>;
}

export default TextBold;
