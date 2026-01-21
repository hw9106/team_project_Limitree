import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteUser, fetchUserDetail } from "../../../api/adminUserApi";
import { getMemberFromCookie, hasAdminRole } from "../../../util/auth";

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // state로 넘어오면 빠르게 표시
  const [loading, setLoading] = useState(!state);
  const [user, setUser] = useState(state ?? null);
  const [error, setError] = useState(null);

  // ✅ me는 서버 호출하지 않고 쿠키(member)로만
  const [me, setMe] = useState(() => getMemberFromCookie());

  // ✅ 페이지 진입 시 쿠키 다시 한번 동기화(새로고침/로그인 직후 반영)
  useEffect(() => {
    setMe(getMemberFromCookie());
  }, []);

  const deleting = false; // 아래에서 state로 관리할거라면 useState로 바꿔도 됨
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ 권한 체크 (admin만 접근 가능하게 막고 싶으면 여기서)
  useEffect(() => {
    if (!me) return; // 로그인 안 한 케이스는 라우트 가드에서 막는게 보통
    if (!hasAdminRole(me)) {
      alert("관리자 권한이 없습니다.");
      navigate("/", { replace: true });
    }
  }, [me, navigate]);

  // ✅ state 없으면 상세를 서버에서 다시 가져오기
  useEffect(() => {
    if (state) {
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchUserDetail(userId); // {status,message,data}

        // 백엔드 규약에 맞게 에러 판정(너 프로젝트에 맞춰 조절)
        if (!res || res?.status >= 4000) {
          setError(res?.message || "회원 상세를 불러오지 못했습니다.");
          setUser(null);
          return;
        }

        setUser(res?.data ?? null);
      } catch {
        setError("회원 상세를 불러오지 못했습니다.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [userId, state]);

  const isSelf = useMemo(() => {
    const myId = me?.userId;
    if (!myId) return false;
    return String(myId) === String(userId);
  }, [me, userId]);

  // ✅ 권한 표시: roleNames/roles 배열 대응
  const roleText = useMemo(() => {
    const roles = user?.roleNames || user?.roles || [];
    if (!Array.isArray(roles)) return String(roles || "-");
    const roleStrings = roles.map((r) => (typeof r === "string" ? r : r?.name ?? String(r)));
    return roleStrings.length ? roleStrings.join(", ") : "-";
  }, [user]);

  const onDelete = async () => {
    if (isSelf) {
      alert("본인 계정은 관리자 화면에서 삭제할 수 없도록 막아두었습니다.");
      return;
    }

    const ok = window.confirm(`정말로 '${userId}' 회원을 삭제할까요?`);
    if (!ok) return;

    setIsDeleting(true);
    try {
      const res = await deleteUser(userId); // adminUserApi에서 토큰 헤더 붙어있어야 함
      alert(res?.message || "삭제 완료");
      navigate("/admin/users", { replace: true });
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>로딩 중...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2 style={{ marginBottom: 16 }}>회원 상세</h2>

      {error && (
        <div style={{ marginBottom: 12, color: "crimson" }}>
          {error}
          <div style={{ fontSize: 12, marginTop: 6, color: "#666" }}>
            ※ 참고: 현재 백엔드 구조상 선택 유저 조회가 불가능할 수 있어요. (관리자용 API 필요)
          </div>
        </div>
      )}

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            rowGap: 10,
          }}
        >
          <div style={{ color: "#666" }}>USERID</div>
          <div style={{ fontWeight: 700 }}>{user?.userId ?? userId}</div>

          <div style={{ color: "#666" }}>이름</div>
          <div>{user?.name ?? "-"}</div>

          <div style={{ color: "#666" }}>이메일</div>
          <div>{user?.email ?? "-"}</div>

          <div style={{ color: "#666" }}>권한</div>
          <div>{roleText}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          onClick={() => navigate("/admin/users")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e9ecef",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          목록으로
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting || isSelf}
          title={isSelf ? "본인 계정 삭제는 제한됩니다." : ""}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ffdddd",
            background: isDeleting || isSelf ? "#fff0f0" : "#fff5f5",
            cursor: isDeleting || isSelf ? "not-allowed" : "pointer",
            color: "#c92a2a",
            marginLeft: "auto",
            opacity: isDeleting || isSelf ? 0.6 : 1,
          }}
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}
