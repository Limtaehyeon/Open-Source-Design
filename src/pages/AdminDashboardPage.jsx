// AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getSelectedMajor, clearSelectedMajor } from "../utils/majorUtils";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [major, setMajor] = useState(null);

  useEffect(() => {
    const selected = getSelectedMajor();
    if (!selected) {
      navigate("/admin/select-major");
    } else {
      setMajor(selected);
    }
  }, [navigate]);

  const handleLogout = async () => {
    clearSelectedMajor();
    await signOut(auth);
    navigate("/login");
  };

  const goTo = (path) => {
    navigate(`${path}?major=${encodeURIComponent(major)}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        관리자 대시보드 {major && `- 전공: ${major}`}
      </h2>
      <nav style={styles.nav}>
        <button style={styles.button} onClick={() => goTo("/admin/events")}>
          행사 및 소식
        </button>
        <button style={styles.button} onClick={() => goTo("/admin/notices")}>
          공지사항
        </button>
        <button style={styles.button} onClick={() => goTo("/admin/benefits")}>
          제휴 혜택
        </button>
        <button
          style={styles.button}
          onClick={() => navigate("/admin/feedbacks")}
        >
          피드백 및 문의사항
        </button>
        <button style={styles.button} onClick={() => navigate("/admin/users")}>
          사용자 목록
        </button>
      </nav>
      <button style={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: "#e3f2fd",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: "#0d47a1",
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "400px",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s",
  },
  logoutButton: {
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    maxWidth: "400px",
    margin: "1rem auto 0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s",
  },
};
