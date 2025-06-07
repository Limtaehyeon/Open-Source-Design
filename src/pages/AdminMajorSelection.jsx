import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSelectedMajor } from "../utils/majorUtils";
import majors from "../data/major";

export default function AdminMajorSelection() {
  const [major, setMajor] = useState("");
  const navigate = useNavigate();

  const handleSelect = () => {
    const trimmedMajor = major.trim();
    if (!trimmedMajor) {
      alert("전공을 입력해 주세요.");
      return;
    }
    if (!majors.includes(trimmedMajor)) {
      alert("등록된 전공명만 입력할 수 있습니다.");
      return;
    }
    saveSelectedMajor(trimmedMajor);
    // 여기서 majorId를 URL 파라미터로 넘김
    navigate(`/admin/dashboard/${trimmedMajor}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>관리자 전공 선택</h2>
      <input
        type="text"
        placeholder="전공명을 입력하세요"
        value={major}
        onChange={(e) => setMajor(e.target.value)}
        style={styles.input}
      />
      <button style={styles.button} onClick={handleSelect}>
        선택 완료
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
    justifyContent: "center",
  },
  title: {
    color: "#0d47a1",
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
  },
  input: {
    width: "300px",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #aaa",
    marginBottom: "1.5rem",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px 24px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
};
