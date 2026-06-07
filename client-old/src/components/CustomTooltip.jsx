const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0].payload;

  return (
    <div className="bg-[var(--bg)] p-2 rounded-xl shadow-lg shadow-[var(--shadow)] border text-[var(--text)] border-[var(--border)] text-[10px] md:text-xs z-10">
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
