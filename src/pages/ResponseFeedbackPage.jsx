import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function ResponseFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [responses, setResponses] = useState({});

  const feedbacksRef = collection(db, "feedbacks");

  const fetchFeedbacks = async () => {
    const q = query(feedbacksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFeedbacks(data);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitResponse = async (id) => {
    const responseText = responses[id];
    if (!responseText) return alert("응답 내용을 입력하세요.");

    await updateDoc(doc(db, "feedbacks", id), {
      response: responseText,
    });

    alert("피드백 응답이 완료되었습니다.");
    fetchFeedbacks();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      <button onClick={handleGoBack} style={styles.backButton}>
        ← 뒤로가기
      </button>
      <h2 style={styles.title}>사용자 피드백 응답</h2>
      {feedbacks.map((fb) => (
        <div key={fb.id} style={styles.card}>
          <p style={styles.text}>
            <strong>이메일:</strong> {fb.email}
            <span style={styles.date}>
              {fb.createdAt?.toDate
                ? " - " + fb.createdAt.toDate().toLocaleDateString()
                : ""}
            </span>
          </p>
          <p style={styles.text}>
            <strong>내용:</strong> {fb.message}
          </p>
          <p style={styles.text}>
            <strong>응답:</strong>{" "}
            <span style={{ color: fb.response ? "#000" : "#999" }}>
              {fb.response || "아직 없음"}
            </span>
          </p>

          <textarea
            placeholder="응답 작성"
            value={responses[fb.id] || ""}
            onChange={(e) => handleResponseChange(fb.id, e.target.value)}
            rows={3}
            style={styles.textarea}
          />
          <br />
          <button
            onClick={() => handleSubmitResponse(fb.id)}
            style={styles.button}
          >
            응답 저장
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: "#e3f2fd",
    minHeight: "100vh",
    padding: "2rem",
  },
  backButton: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "1rem",
    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.4)",
  },
  title: {
    color: "#0d47a1",
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  text: {
    marginBottom: "0.8rem",
    fontSize: "1rem",
  },
  date: {
    marginLeft: "10px",
    color: "#666",
    fontSize: "0.9rem",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1.5px solid #90caf9",
    resize: "vertical",
    marginBottom: "1rem",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};
