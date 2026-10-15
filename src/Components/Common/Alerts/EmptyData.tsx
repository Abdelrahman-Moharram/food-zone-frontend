const EmptyData = ({
  message,
  height,
}: {
  message: string;
  height: string;
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-md font-semibold bg-card`}
      style={{ height: height }}
    >
      {message}
    </div>
  );
};

export default EmptyData;
