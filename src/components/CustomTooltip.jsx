const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0].payload;

  return (
    <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-300 text-xs">
      <p>
        <strong>Date:</strong> {dataPoint.date}
      </p>
      <p>
        <strong>Modal price:</strong> ₹{dataPoint.modal_price}
      </p>
    </div>
  );
};

export default CustomTooltip;
