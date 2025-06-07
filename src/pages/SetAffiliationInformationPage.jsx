import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // firebase.js 경로에 맞게 수정

export default function SetAffiliationInformationPage() {
  const [school, setSchool] = useState("");
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  // 학교명 유효성 검사 함수
  const isValidSchool = (school) => {
    return school.trim() === "영남대학교";
  };

  // 학번 유효성 검사 함수
  const isValidStudentId = (studentId) => {
    return /^\d{8}$/.test(studentId);
  };

  const handleVerify = async () => {
    try {
      // 학교명 확인
      if (!isValidSchool(school)) {
        alert("해당 학교는 존재하지 않습니다.");
        return;
      }

      // 학번 형식 확인
      if (!isValidStudentId(studentId)) {
        alert("학번은 8자리 숫자여야 합니다.");
        return;
      }

      // 학번 중복 확인
      const q = query(
        collection(db, "verifiedStudents"),
        where("studentId", "==", studentId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("이미 등록된 학번입니다.");
        return;
      }

      // 인증 완료 → 저장
      await addDoc(collection(db, "verifiedStudents"), {
        school: school.trim(),
        studentId,
        verifiedAt: new Date().toISOString(),
      });

      alert("등록 완료!");
      navigate("/login");
    } catch (error) {
      alert("등록 실패: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>소속 정보 설정</h2>

      <input
        type="text"
        placeholder="학교 이름 입력"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="학번 (8자리 숫자)"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleVerify} style={styles.button}>
        등록
      </button>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: "#e3f2fd",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  title: {
    color: "#0d47a1",
    marginBottom: "1.5rem",
    fontWeight: "700",
  },
  input: {
    width: "300px",
    maxWidth: "90vw",
    padding: "12px 16px",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1.5px solid #90caf9",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    width: "300px",
    maxWidth: "90vw",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.4)",
  },
};
