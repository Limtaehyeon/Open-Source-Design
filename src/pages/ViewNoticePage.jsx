import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ViewNoticePage() {
  const [user] = useAuthState(auth);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [userMajor, setUserMajor] = useState(null);

  const navigate = useNavigate();

  // 사용자 전공 가져오기
  useEffect(() => {
    const fetchUserMajor = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserMajor(userDoc.data().major);
        }
      }
    };
    fetchUserMajor();
  }, [user]);

  // 전공에 맞는 공지사항 가져오기
  useEffect(() => {
    if (!userMajor) return;

    const fetchNotices = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "notices"),
          where("major", "==", userMajor)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotices(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [userMajor]);

  // 정렬
  const sortedNotices = [...notices].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  // 날짜 포맷
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
    }).format(date);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        로딩 중...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px",
        paddingBottom: "80px",
        paddingLeft: "20px",
        paddingRight: "20px",
        boxSizing: "border-box",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          padding: "40px 60px",
          maxWidth: "960px",
          width: "100%",
          boxSizing: "border-box",
          minHeight: "850px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            alignSelf: "flex-start",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #42a5f5",
            backgroundColor: "#42a5f5",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← 뒤로가기
        </button>

        <h2 style={{ marginBottom: "20px" }}>📢 학과 공지사항</h2>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => {
              if (sortBy === "title")
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              else {
                setSortBy("title");
                setSortOrder("asc");
              }
            }}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #42a5f5",
              backgroundColor: sortBy === "title" ? "#42a5f5" : "white",
              color: sortBy === "title" ? "white" : "#42a5f5",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            제목 {sortBy === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </button>

          <button
            onClick={() => {
              if (sortBy === "date")
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              else {
                setSortBy("date");
                setSortOrder("desc");
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #42a5f5",
              backgroundColor: sortBy === "date" ? "#42a5f5" : "white",
              color: sortBy === "date" ? "white" : "#42a5f5",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            등록일 {sortBy === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </button>
        </div>

        {sortedNotices.length === 0 ? (
          <p>등록된 공지사항이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0, flexGrow: 1 }}>
            {sortedNotices.map((notice) => (
              <li
                key={notice.id}
                onClick={() => navigate(`/noticedetail/${notice.id}`)}
                style={{
                  marginBottom: "2rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "16px",
                  minHeight: "50px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                <span>{notice.title}</span>
                <span
                  style={{
                    color: "#888",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    marginLeft: "20px",
                  }}
                >
                  {formatDate(notice.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
