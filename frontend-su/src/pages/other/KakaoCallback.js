import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../util/cookieUtil";
import { useUserContext } from "../../context/UserContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const { applyLogin } = useUserContext();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        navigate("/login-register", { replace: true });
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/member/kakao`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) throw new Error("KAKAO_LOGIN_FAILED");

        const json = await res.json();

        const accessToken = json?.data?.accessToken;
        const refreshToken = json?.data?.refreshToken;

        if (!accessToken || !refreshToken) throw new Error("TOKEN_MISSING");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setCookie("member", JSON.stringify(json.data), 1);

        applyLogin(json.data);

        // ✅ 약간의 UX 텀(너무 순식간에 넘어가면 깜빡임)
        setTimeout(() => navigate("/", { replace: true }), 600);
      } catch (e) {
        console.error(e);
        navigate("/login-register", { replace: true });
      }
    };

    run();
  }, [navigate, applyLogin]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.kakaoDot} />
          <div style={styles.brandText}>Kakao</div>
        </div>

        <div style={styles.spinner} aria-label="loading" />

        <h2 style={styles.title}>로그인 처리 중</h2>
        <p style={styles.desc}>
          카카오 계정으로 로그인하고 있어요. <br />
          잠시만 기다려주세요 🙂
        </p>

        <div style={styles.hint}>
          문제가 계속되면 이전 화면으로 돌아가 다시 시도해주세요.
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "radial-gradient(800px 400px at 50% 0%, rgba(255, 217, 0, 0.22), rgba(255,255,255,0) 60%), #fff",
  },
  card: {
    width: "min(520px, 100%)",
    padding: "34px 28px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.06)",
    textAlign: "center",
    background: "#fff",
  },
  brandRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  kakaoDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "#ffd900",
    boxShadow: "0 0 0 6px rgba(255,217,0,0.25)",
  },
  brandText: {
    fontWeight: 800,
    letterSpacing: "0.5px",
    color: "#111",
  },
  spinner: {
    width: "54px",
    height: "54px",
    borderRadius: "999px",
    margin: "14px auto 18px",
    border: "5px solid rgba(0,0,0,0.08)",
    borderTopColor: "#ffd900",
    animation: "spin 0.9s linear infinite",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#111",
  },
  desc: {
    margin: "0 0 16px",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#444",
  },
  hint: {
    fontSize: "12px",
    color: "#777",
    background: "rgba(0,0,0,0.04)",
    borderRadius: "12px",
    padding: "10px 12px",
  },
};
