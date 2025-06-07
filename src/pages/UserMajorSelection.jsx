import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import majors from "../data/major";

export default function UserMajorSelection() {
  const [user] = useAuthState(auth);
  const [inputMajor, setInputMajor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserMajor = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const savedMajor = userDoc.data().major;
          if (savedMajor) {
            setInputMajor(savedMajor);
          }
        }
      }
    };
    loadUserMajor();
  }, [user]);

  const handleSaveMajor = async () => {
    if (!inputMajor.trim()) {
      alert("전공명을 입력해주세요.");
      return;
    }

    const lowerMajors = majors.map((m) => m.toLowerCase());
    if (!lowerMajors.includes(inputMajor.toLowerCase())) {
      alert("등록된 전공명이 아닙니다. 다시 입력해주세요.");
      return;
    }

    await setDoc(
      doc(db, "users", user.uid),
      { major: inputMajor.trim() },
      { merge: true }
    );
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>전공을 입력해주세요</h2>
      <input
        type="text"
        placeholder="전공명을 입력하세요"
        value={inputMajor}
        onChange={(e) => setInputMajor(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSaveMajor} style={styles.button}>
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
    transition: "border-color 0.3s",
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
    transition: "background-color 0.3s",
  },
};
