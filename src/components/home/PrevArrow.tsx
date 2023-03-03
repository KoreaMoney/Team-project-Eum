interface PrevArrowProps {
  className?: any;
  style?: any;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function PrevArrow({
  className,
  style,
  onClick,
}: PrevArrowProps) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{ ...style, display: 'block' }}
    />
  );
}
