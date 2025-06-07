import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ 이메일 중복 확인 함수
  const isEmailDuplicate = async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email.trim());
      console.log("Sign-in methods:", methods);
      return methods.length > 0;
    } catch (error) {
      console.error("이메일 중복 확인 중 오류:", error);
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
      return true; // 오류 시 안전하게 중복으로 처리
    }
  };

  // ✅ 비밀번호 유효성 검사
  const validatePassword = (password) => {
    if (password.length < 8) {
      return {
        valid: false,
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
      };
    }
    return { valid: true };
  };

  // ✅ 회원가입 처리 함수
  const handleSignup = async () => {
    try {
      const isDuplicate = await isEmailDuplicate(email);
      console.log("이메일 중복 여부:", isDuplicate);

      if (isDuplicate) {
        alert("이미 등록된 이메일입니다.");
        return;
      }

      const pwCheck = validatePassword(password);
      if (!pwCheck.valid) {
        alert(pwCheck.message);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || "",
        createdAt: serverTimestamp(),
      });

      navigate("/verify"); // 인증 또는 학번 확인 페이지로 이동
    } catch (error) {
      console.error("회원가입 오류:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("이메일이 존재합니다.");
      } else if (error.code === "auth/invalid-email") {
        alert("올바른 이메일 형식을 입력해주세요.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>회원가입</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="비밀번호 (8자 이상)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSignup} style={styles.button}>
        회원가입
      </button>
      <p style={styles.loginText}>
        이미 계정이 있으신가요?{" "}
        <button
          onClick={() => navigate("/login")}
          style={styles.loginButton}
          aria-label="로그인 페이지로 이동"
        >
          로그인
        </button>
      </p>
    </div>
  );
}

// ✅ 스타일 정의
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
    transition: "background-color 0.3s",
  },
  loginText: {
    marginTop: "1.2rem",
    color: "#555",
    fontSize: "0.9rem",
  },
  loginButton: {
    background: "none",
    border: "none",
    color: "#1976d2",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.9rem",
    padding: 0,
    fontWeight: "600",
  },
};
