import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ViewBenefitPage() {
  const navigate = useNavigate();

  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [major, setMajor] = useState(null);

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

  useEffect(() => {
    if (major === null) return;

    const fetchBenefits = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "benefits"));
        const allBenefits = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredBenefits = major
          ? allBenefits.filter((item) => item.major === major)
          : allBenefits;

        setBenefits(filteredBenefits);
      } catch (error) {
        console.error("Error fetching benefits:", error);
        setBenefits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, [major]);

  const sortedBenefits = [...benefits].sort((a, b) => {
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

        <h2 style={{ marginBottom: "20px" }}>🎁 제휴 혜택</h2>

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

        {sortedBenefits.length === 0 ? (
          <p>등록된 혜택이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0, flexGrow: 1 }}>
            {sortedBenefits.map((benefit) => (
              <li
                key={benefit.id}
                onClick={() => navigate(`/benefitdetail/${benefit.id}`)}
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
                <span>{benefit.title}</span>
                <span
                  style={{
                    color: "#888",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    marginLeft: "20px",
                  }}
                >
                  {formatDate(benefit.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
