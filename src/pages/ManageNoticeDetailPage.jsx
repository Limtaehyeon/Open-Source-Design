import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export default function ManageNoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const docRef = doc(db, "notices", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 조회수 증가 처리
          await updateDoc(docRef, {
            viewCount: increment(1),
          });

          setNotice({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("해당 공지사항이 존재하지 않습니다.");
          navigate("/notices");
        }
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, navigate]);

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

  if (!notice) {
    return null;
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

        <h2 style={{ marginBottom: "10px" }}>{notice.title}</h2>
        <span
          style={{
            color: "#888",
            fontSize: "0.9rem",
            marginBottom: "10px",
            display: "block",
          }}
        >
          {formatDate(notice.createdAt)}
        </span>
        {/* 조회수 표시 (선택사항) */}
        {typeof notice.viewCount === "number" && (
          <span
            style={{
              color: "#aaa",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            조회수: {notice.viewCount}
          </span>
        )}

        <div
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            color: "#333",
            flexGrow: 1,
          }}
        >
          {notice.content}
        </div>
      </div>
    </div>
  );
}
