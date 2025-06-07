import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function SubmitFeedbackPage() {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);

  const feedbacksRef = collection(db, "feedbacks");

  // 로그인 상태 감지 및 이름/이메일 자동 세팅
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 로그인 상태면 이름/이메일 자동 세팅 (수정 가능)
        setName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      } else {
        // 비로그인 상태는 빈 값으로 세팅
        setName("");
        setEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  // 피드백 불러오기 (최신순 정렬)
  const fetchFeedbacks = async () => {
    setLoading(true);
    const q = query(feedbacksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFeedbacks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 피드백 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    // uid는 로그인 상태면 넣고, 아니면 빈 문자열 저장
    const uid = user ? user.uid : "";

    await addDoc(feedbacksRef, {
      name,
      email,
      message,
      uid,
      createdAt: new Date().toISOString(),
    });

    setMessage("");
    // 목록 즉시 갱신
    fetchFeedbacks();
    alert("피드백 등록이 완료되었습니다.");
  };

  // 삭제 (로그인 상태 + 작성자 본인 uid 일치 시만 가능)
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "feedbacks", id));
      fetchFeedbacks();
      alert("피드백 삭제가 완료되었습니다.");
    }
  };

  if (loading) return <div style={styles.loadingContainer}>로딩 중...</div>;

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate(-1)}
        style={styles.backButton}
        aria-label="뒤로가기"
      >
        ← 뒤로가기
      </button>

      <h2 style={styles.title}>사용자 피드백 및 문의사항</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="피드백 내용을 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
          rows={5}
          required
        />
        <button type="submit" style={styles.button}>
          제출하기
        </button>
      </form>

      <div style={styles.listContainer}>
        <h3 style={styles.listTitle}>제출된 피드백 및 문의사항 목록</h3>
        {feedbacks.length === 0 ? (
          <p style={styles.noFeedback}>등록된 피드백 및 문의사항이 없습니다.</p>
        ) : (
          <ul style={styles.feedbackList}>
            {feedbacks.map((fb) => (
              <li key={fb.id} style={styles.feedbackItem}>
                <div style={styles.feedbackHeader}>
                  <span style={styles.feedbackName}>{fb.name}</span>
                  <span style={styles.feedbackEmail}>({fb.email})</span>
                  <span style={styles.feedbackDate}>
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={styles.feedbackMessage}>{fb.message}</p>

                {fb.response && (
                  <div style={styles.adminResponse}>
                    <strong>관리자 응답:</strong> {fb.response}
                  </div>
                )}

                {/* 로그인 상태 && 작성자 uid 일치 시에만 삭제 버튼 표시 */}
                {user && fb.uid && fb.uid === user.uid && (
                  <button
                    onClick={() => handleDelete(fb.id)}
                    style={styles.deleteButton}
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
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

  backButton: {
    alignSelf: "flex-start",
    marginBottom: "1rem",
    padding: "9px 12px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
    boxShadow: "0 2px 6px rgba(25, 118, 210, 0.4)",
  },

  title: {
    color: "#0d47a1",
    fontWeight: "700",
    fontSize: "2rem",
    marginBottom: "2rem",
  },

  form: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "1rem",
    borderRadius: 8,
    border: "1.5px solid #90caf9",
    fontSize: "1rem",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "1rem",
    borderRadius: 8,
    border: "1.5px solid #90caf9",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
  },

  button: {
    padding: "14px 32px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    fontWeight: "700",
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.4)",
    transition: "background-color 0.3s",
    alignSelf: "center",
  },

  listContainer: {
    marginTop: "3rem",
    width: "100%",
    maxWidth: 600,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },

  listTitle: {
    color: "#0d47a1",
    fontWeight: "700",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    textAlign: "center",
  },

  noFeedback: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
  },

  feedbackList: {
    listStyle: "none",
    paddingLeft: 0,
    maxHeight: 300,
    overflowY: "auto",
  },

  feedbackItem: {
    backgroundColor: "#e8f0fe",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    boxShadow: "0 2px 6px rgba(25, 118, 210, 0.15)",
  },

  feedbackHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontWeight: "600",
    color: "#0d47a1",
    fontSize: 14,
  },

  feedbackName: {
    flexShrink: 0,
  },

  feedbackEmail: {
    flexShrink: 0,
    marginLeft: 8,
    fontWeight: "400",
    color: "#1976d2",
  },

  feedbackDate: {
    flexShrink: 0,
    fontWeight: "400",
    color: "#555",
    fontSize: 12,
  },

  feedbackMessage: {
    whiteSpace: "pre-wrap",
    fontSize: 16,
    color: "#0d47a1",
  },

  adminResponse: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#bbdefb",
    borderRadius: 8,
    fontSize: 15,
    color: "#0d47a1",
    fontWeight: "600",
  },

  deleteButton: {
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: 10,
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#0d47a1",
    fontWeight: "600",
  },
};
