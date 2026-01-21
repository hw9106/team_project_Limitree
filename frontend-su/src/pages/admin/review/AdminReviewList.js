
import { useUserContext } from "../../../context/UserContext";
import { useEffect, useMemo, useState } from "react";
import * as reviewApi from "../../../api/reviewApi";
import cogoToast from "cogo-toast";

const AdminReviewPage = () => {
  const { loginUser } = useUserContext();
  const [reviews, setReviews] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // 초기 로드 (지금은 json)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // ✅ 백엔드 붙이면 여기만 교체하면 됨
        const res = await reviewApi.reviewList();
        //console.log("박성섭 es     " , res);
        setReviews(res.data ?? res); // 응답 형태에 맞게
        //setReviews(reviewsData);
      } catch (e) {
        console.error(e);
        cogoToast.error("리뷰 목록 로딩 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 검색 필터
  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return reviews;

    return reviews.filter((r) => {
      const blob = [
        r.reviewId,
        r.productId,
        r.userId,
        r.userName,
        r.rating,
        r.content,
        r.createdAt,
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });
  }, [reviews, keyword]);

  // 삭제 (지금은 프론트 상태에서만 삭제)
  const handleDelete = async (reviewId) => {
    const ok = window.confirm(`리뷰 #${reviewId} 삭제할까요?`);
    if (!ok) return;

    try {
      // ✅ 백엔드 붙이면 여기서 호출
      await reviewApi.adminRemoveAction(reviewId);

      // 프론트에서 즉시 삭제 반영
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      cogoToast.success("삭제 완료");
    } catch (e) {
      console.error(e);
      cogoToast.error("삭제 실패");
    }
  };

  return (
    <div>
        {loginUser?.userId === "admin" && (
          <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 12 }}>리뷰 관리(Admin)</h2>

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색: userName, content, productId, userId..."
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
              <div style={{ padding: "10px 12px", color: "#555" }}>
                총 {filtered.length}개
              </div>
            </div>

            {loading ? (
              <p>불러오는 중...</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 900,
                    background: "#fff",
                    border: "1px solid #eee",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f7f7f7" }}>
                      <Th>Review ID</Th>
                      <Th>Product ID</Th>
                      <Th>User ID</Th>
                      <Th>User Name</Th>
                      <Th>Rating</Th>
                      <Th>Content</Th>
                      <Th>Created At</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          style={{ padding: 16, textAlign: "center" }}
                        >
                          데이터 없음
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r) => (
                        <tr
                          key={r.reviewId}
                          style={{ borderTop: "1px solid #eee" }}
                        >
                          <Td>{r.reviewId}</Td>
                          <Td>{r.productId}</Td>
                          <Td>{r.userId}</Td>
                          <Td>{r.userName}</Td>
                          <Td>
                            {"★".repeat(Number(r.rating || 0))}
                            {"☆".repeat(5 - Number(r.rating || 0))}
                            <span style={{ marginLeft: 8, color: "#666" }}>
                              ({r.rating})
                            </span>
                          </Td>
                          <Td style={{ maxWidth: 420 }}>
                            <div
                              title={r.content}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {r.content}
                            </div>
                          </Td>
                          <Td>{r.createdAt}</Td>
                          <Td>
                            <button
                              onClick={() => handleDelete(r.reviewId)}
                              style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #ffcccc",
                                background: "#fff5f5",
                                cursor: "pointer",
                              }}
                            >
                              삭제
                            </button>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
const Th = ({ children }) => (
  <th
    style={{
      textAlign: "left",
      padding: 12,
      borderBottom: "1px solid #eee",
      fontWeight: 700,
      fontSize: 14,
    }}
  >
    {children}
  </th>
);

const Td = ({ children, style }) => (
  <td style={{ padding: 12, fontSize: 14, ...style }}>{children}</td>
);

export default AdminReviewPage;