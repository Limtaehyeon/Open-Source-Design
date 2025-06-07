import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function ManageBenefitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [benefit, setBenefit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefit = async () => {
      try {
        const docRef = doc(db, "benefits", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBenefit({ id: docSnap.id, ...docSnap.data() });

          // ✅ 조회수 증가
          await updateDoc(docRef, {
            viewCount: increment(1),
          });
        } else {
          setBenefit(null);
        }
      } catch (error) {
        console.error("혜택 정보 불러오기 실패:", error);
        setBenefit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefit();
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

  if (!benefit) {
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
          <p>존재하지 않는 혜택입니다.</p>
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
        <h2 style={{ marginBottom: "12px", color: "#000" }}>{benefit.title}</h2>

        {/* 날짜 */}
        <span
          style={{ color: "#888", fontSize: "0.9rem", marginBottom: "12px" }}
        >
          {formatDate(benefit.createdAt)}
        </span>

        {/* 조회수 표시 (선택사항) */}
        {typeof benefit.viewCount === "number" && (
          <span
            style={{
              color: "#aaa",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            조회수: {benefit.viewCount}
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
          {benefit.content}
        </p>
      </div>
    </div>
  );
}
