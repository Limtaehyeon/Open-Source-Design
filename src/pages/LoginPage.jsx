import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // firebase 초기화 및 auth 내보내기
import { useNavigate } from "react-router-dom";
import logo from "../assets/camnote-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const ADMIN_EMAIL = "admin@example.com";

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userEmail = userCredential.user.email;

      alert("로그인 성공");
      console.log("로그인 성공:", userEmail);

      if (userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin/select-major");
      } else {
        navigate("/major-check");
      }
    } catch (error) {
      alert("이메일 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="CamNote 로고" style={styles.logo} />
      <h2 style={styles.title}>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        autoComplete="current-password"
      />
      <button onClick={handleLogin} style={styles.button}>
        로그인
      </button>
      <p style={styles.signupText}>
        계정이 없으신가요?{" "}
        <button
          onClick={() => navigate("/signup")}
          style={styles.signupButton}
          aria-label="회원가입 페이지로 이동"
        >
          회원가입
        </button>
      </p>
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
  signupText: {
    marginTop: "1.2rem",
    color: "#555",
    fontSize: "0.9rem",
  },
  signupButton: {
    background: "none",
    border: "none",
    color: "#1976d2",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.9rem",
    padding: 0,
    fontWeight: "600",
  },
  logo: {
    width: "400px",
    marginBottom: "1rem",
  },
};
