import { useRef } from "react";

export const Draggable = ({
  rootClass = "",
  children,
}: {
  rootClass?: string;
  children: React.ReactNode;
}) => {
  const ourRef = useRef<HTMLDivElement | null>(null);
  const isMouseDown = useRef(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const isScrolling = useRef(false);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ourRef.current) return;
    const slider = ourRef.current.children[0] as HTMLDivElement;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    isMouseDown.current = true;
    document.body.style.cursor = "grabbing";
  };

  const handleDragEnd = () => {
    isMouseDown.current = false;
    if (!ourRef.current) return;
    document.body.style.cursor = "default";
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current || !ourRef.current) return;
    e.preventDefault();
    const slider = ourRef.current.children[0] as HTMLDivElement;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - mouseCoords.current.startX) * 1.5;
    const walkY = (y - mouseCoords.current.startY) * 1.5;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
  };

  return (
    <div
      ref={ourRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      className={rootClass + "flex overflow-x-scroll"}
    >
      {children}
    </div>
  );
};
