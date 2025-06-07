import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const navButtonGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const navButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "14px",
    margin: 0,
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      {/* 왼쪽 버튼 그룹 */}
      <div style={navButtonGroupStyle}>
        <div
          style={{ fontWeight: "bold", fontSize: "20px", marginRight: "16px" }}
        >
          CamNote
        </div>
        <button onClick={() => navigate("/home")} style={navButtonStyle}>
          홈
        </button>
        <button onClick={() => navigate("/events")} style={navButtonStyle}>
          행사 및 소식
        </button>
        <button onClick={() => navigate("/notices")} style={navButtonStyle}>
          공지사항
        </button>
        <button onClick={() => navigate("/benefits")} style={navButtonStyle}>
          제휴 혜택
        </button>
        <button onClick={() => navigate("/feedback")} style={navButtonStyle}>
          피드백 및 문의사항
        </button>
      </div>

      {/* 오른쪽 로그아웃 버튼 */}
      <div>
        <button
          onClick={handleLogout}
          style={{ ...navButtonStyle, backgroundColor: "#e53935" }}
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}
