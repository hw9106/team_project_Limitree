export default function UserTable({ users, loading, onClickDetail }) {
  if (loading) return <div style={{ marginTop: 16 }}>로딩 중...</div>;

  // ✅ th/td 공통 스타일(정렬/패딩/높이 통일)
  const thStyle = {
    padding: "12px 14px",
    textAlign: "center",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e9ecef",
    fontWeight: 700,
    fontSize: 13,
    background: "#fff",
  };

  const tdStyle = {
    padding: "12px 14px",
    textAlign: "center",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #f1f3f5",
    fontSize: 13,
  };

  const emailTdStyle = { ...tdStyle, textAlign: "left" };

  const badgeBase = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 700,
  };

  const roleBadgeStyle = (role) => ({
    ...badgeBase,
    background: "#f1f3f5",
    color: "#212529",
  });

  const statusBadgeStyle = (status) => {
    const s = String(status || "").toUpperCase();
    const isActive = s === "ACTIVE";
    return {
      ...badgeBase,
      background: isActive ? "#e6fcf5" : "#fff4e6",
      color: isActive ? "#087f5b" : "#d9480f",
    };
  };

  const btnStyle = {
    padding: "6px 12px",
    fontSize: 12,
    lineHeight: 1,
    borderRadius: 8,
    border: "1px solid #ced4da",
    background: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ marginTop: 16, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>이름</th>
            <th style={thStyle}>이메일</th>
            <th style={thStyle}>연락처</th>
            <th style={thStyle}>권한</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>가입일</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ ...tdStyle, padding: 16 }}>
                결과가 없습니다.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.id}</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={emailTdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.phone || "-"}</td>
                <td style={tdStyle}>
                  <span style={roleBadgeStyle(u.role)}>{u.role}</span>
                </td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(u.status)}>{u.status}</span>
                </td>
                <td style={tdStyle}>{u.createdAt || "-"}</td>
                <td style={tdStyle}>
                  <button style={btnStyle} onClick={() => onClickDetail(u)}>
                    상세
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
