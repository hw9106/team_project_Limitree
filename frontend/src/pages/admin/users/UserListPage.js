import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserFilters from "../../../components/admin/users/UserFilters";
import UserTable from "../../../components/admin/users/UserTable";
import { fetchUsers } from "../../../api/adminUserApi";
import { getMemberFromCookie, hasAdminRole } from "../../../util/auth";

const UserListPage = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(10);

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ admin 권한 체크(프론트 가드)
  useEffect(() => {
    const me = getMemberFromCookie();
    if (!me || !hasAdminRole(me)) {
      alert("관리자 권한이 없습니다.");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => setPage(1), [keyword]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchUsers({ page: page - 1, size, keyword });
        setUsers(res?.data?.content ?? []);
        setTotal(res?.data?.totalElements ?? 0);
      } catch (e) {
         console.log("fetchUsers error:", e);
        setError("회원 목록을 불러오지 못했습니다.");
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [page, size, keyword]);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(page, totalPages);

  const onClickDetail = (user) => {
    navigate(`/admin/users/${encodeURIComponent(user.userId)}`, { state: user });
  };

  const pillBtn = (disabled) => ({
    padding: "10px 18px",
    borderRadius: 999,
    border: "1px solid #e9ecef",
    background: disabled ? "#f1f3f5" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    minWidth: 92,
  });

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>회원 리스트</h2>

      <UserFilters keyword={keyword} onChangeKeyword={setKeyword} />

      {error && <div style={{ marginTop: 12, color: "crimson" }}>{error}</div>}

      <UserTable users={users} loading={loading} onClickDetail={onClickDetail} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          style={pillBtn(currentPage === 1)}
        >
          이전
        </button>

        <span style={{ fontSize: 13 }}>
          {currentPage} / {totalPages} (총 {total}명)
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          style={pillBtn(currentPage === totalPages)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserListPage;
