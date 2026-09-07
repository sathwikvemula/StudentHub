
function StatCard({
  title,
  value,
  color = "#111827",
  icon,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >


      <p
        style={{
          margin: 0,
          color: "#6b7280",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        {icon && (
          <span
            style={{
              marginRight: "6px",
            }}
          >
            {icon}
          </span>
        )}

        {title}
      </p>



      <h2
        style={{
          fontSize: "32px",
          margin: "8px 0 0",
          color: color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default StatCard;
