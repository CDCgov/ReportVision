export const Divider = ({
  color = "#ccc",
  thickness = "1px",
  margin = "16px 0",
  style = {},
}) => {
  return (
    <div
      style={{
        borderBottom: `${thickness} solid ${color}`,
        margin: margin,
        ...style,
      }}
    />
  );
};
