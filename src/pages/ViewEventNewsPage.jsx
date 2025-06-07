import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase"; // auth도 import 필요
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ViewEventNewsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date"); // 정렬 기준: date or title
  const [sortOrder, setSortOrder] = useState("desc"); // 정렬 방향: asc or desc
  const [major, setMajor] = useState(null);

  // 1. 로그인 사용자 전공 정보 가져오기
  useEffect(() => {
    const fetchUserMajor = async () => {
      if (!auth.currentUser) {
        setMajor(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setMajor(userDoc.data().major);
        } else {
          setMajor(null);
          console.warn("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user major:", error);
        setMajor(null);
      }
    };

    fetchUserMajor();
  }, []);

  // 2. major가 준비되면 이벤트 불러오기 및 필터링
  useEffect(() => {
    if (major === null) {
      // major 정보 없으면 이벤트 안 불러옴
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const allEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // major가 있으면 필터링, 없으면 전체 보여주기 (필요하면 수정 가능)
        const filteredEvents = major
          ? allEvents.filter((event) => event.major === major)
          : allEvents;

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [major]);

  // 3. 정렬된 이벤트 계산
  const sortedEvents = [...events].sort((a, b) => {
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

  // 4. 날짜 포맷 함수
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

  // 5. 로딩중 UI
  if (loading)
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

  // 6. 전공 정보가 없을 때 안내 메시지
  if (!major)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          fontFamily: "'Noto Sans KR', sans-serif",
          padding: "20px",
          textAlign: "center",
        }}
      >
        전공 정보가 없습니다. 먼저 로그인하고 전공 정보를 설정해주세요.
      </div>
    );

  // 7. UI 렌더링
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

        <h2 style={{ marginBottom: "20px" }}>🎉 행사 및 학과 소식</h2>

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

        {sortedEvents.length === 0 ? (
          <p>등록된 소식이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0, flexGrow: 1 }}>
            {sortedEvents.map((event) => (
              <li
                key={event.id}
                onClick={() => navigate(`/eventnewsdetail/${event.id}`)}
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
                <span>{event.title}</span>
                <span
                  style={{
                    color: "#888",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    marginLeft: "20px",
                  }}
                >
                  {formatDate(event.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
