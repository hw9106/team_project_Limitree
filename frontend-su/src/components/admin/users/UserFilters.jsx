export default function UserFilters({ keyword, onChangeKeyword }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <input
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        placeholder="이름 또는 이메일 검색"
        style={{ padding: "10px 12px", width: 320 }}
      />
      <button onClick={() => onChangeKeyword("")}>초기화</button>
    </div>
  );
}
