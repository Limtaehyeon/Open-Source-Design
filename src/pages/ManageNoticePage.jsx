import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";

export default function ManageNoticePage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { search } = useLocation();
  const major = new URLSearchParams(search).get("major");

  const noticesRef = collection(db, "notices");

  const fetchNotices = async () => {
    if (!major) return;

    const q = query(noticesRef, where("major", "==", major));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, [major]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 모두 입력하세요.");
    if (!major) return alert("전공이 설정되지 않았습니다.");

    if (editingId) {
      const noticeDoc = doc(db, "notices", editingId);
      await updateDoc(noticeDoc, { title, content, major });
      setEditingId(null);
      alert("글 수정이 완료되었습니다.");
    } else {
      await addDoc(noticesRef, {
        title,
        content,
        major,
        createdAt: serverTimestamp(),
      });
      alert("글 등록이 완료되었습니다.");
    }
    setTitle("");
    setContent("");
    fetchNotices();
  };

  const handleEdit = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setEditingId(notice.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "notices", id));
      fetchNotices();
      alert("글 삭제가 완료되었습니다.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(date)
      .replace(", ", " ");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={handleGoBack} style={styles.backButton}>
          ← 뒤로가기
        </button>

        <h2 style={styles.title}>[{major || "전공 없음"}] 공지사항 관리</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            style={{ ...styles.input, height: 100, resize: "vertical" }}
          />
          <button
            type="submit"
            style={styles.submitButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
          >
            {editingId ? "수정" : "등록"}
          </button>
        </form>

        <hr style={styles.divider} />

        <ul style={styles.list}>
          {notices.map((notice) => (
            <li key={notice.id} style={styles.listItem}>
              <div style={styles.listHeader}>
                <strong style={styles.benefitTitle}>{notice.title}</strong>
                <small style={styles.dateText}>
                  {formatDate(notice.createdAt)}
                </small>
              </div>
              <p style={styles.benefitContent}>{notice.content}</p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => handleEdit(notice)}
                  style={styles.actionButton}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#1565c0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#1976d2")
                  }
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(notice.id)}
                  style={styles.actionButton}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#1565c0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#1976d2")
                  }
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
          {notices.length === 0 && <li>작성된 공지사항이 없습니다.</li>}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: "#e3f2fd",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 120px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px 70px",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(25, 118, 210, 0.15)",
    width: "100%",
    maxWidth: 600,
  },

  backButton: {
    backgroundColor: "#90caf9",
    color: "#0d47a1",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 20,
    transition: "background-color 0.3s",
  },

  title: {
    color: "#0d47a1",
    fontWeight: "700",
    fontSize: 28,
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginBottom: 30,
  },
  input: {
    padding: "14px 20px",
    fontSize: 18,
    borderRadius: 8,
    border: "1.5px solid #90caf9",
    outline: "none",
    transition: "border-color 0.3s",
  },
  submitButton: {
    backgroundColor: "#1976d2",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    padding: "14px 0",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #ddd",
    margin: "20px 0",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "24px 0",
    marginBottom: 20,
    textAlign: "left",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  benefitTitle: {
    fontSize: "1.3rem",
    color: "#333",
    fontWeight: "700",
  },
  dateText: {
    fontSize: "0.9rem",
    color: "#999",
  },
  benefitContent: {
    marginTop: 12,
    color: "#555",
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 15,
    transition: "background-color 0.3s ease",
  },
};
