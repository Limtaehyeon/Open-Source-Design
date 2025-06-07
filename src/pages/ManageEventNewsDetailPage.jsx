import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export default function ManageEventNewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);

        // 먼저 viewCount 1 증가 (필드가 없으면 자동으로 생성됨)
        await updateDoc(docRef, {
          viewCount: increment(1),
        });

        // 이후 문서 가져오기
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("소식 정보 불러오기 실패:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

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

  if (!event) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>존재하지 않는 소식입니다.</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #42a5f5",
              backgroundColor: "white",
              color: "#42a5f5",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← 뒤로가기
          </button>
        </div>
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
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            alignSelf: "flex-start",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #42a5f5",
            backgroundColor: "white",
            color: "#42a5f5",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← 뒤로가기
        </button>

        {/* 제목 */}
        <h2 style={{ marginBottom: "12px", color: "#000" }}>{event.title}</h2>

        {/* 날짜 */}
        <span
          style={{ color: "#888", fontSize: "0.9rem", marginBottom: "20px" }}
        >
          {formatDate(event.createdAt)}
        </span>
        {typeof event.viewCount === "number" && (
          <span
            style={{
              color: "#aaa",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            조회수: {event.viewCount}
          </span>
        )}

        {/* 내용 */}
        <p
          style={{
            marginTop: "20px",
            color: "#555",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            fontSize: "1rem",
          }}
        >
          {event.content}
        </p>
      </div>
    </div>
  );
}
