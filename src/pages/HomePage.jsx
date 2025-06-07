import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import logo from "../assets/camnote-logo.png";

const categoryInfo = {
  notices: { label: "📢 공지사항", pathPrefix: "/notices" },
  events: { label: "🎉행사 및 소식", pathPrefix: "/events" },
  benefits: { label: "🎁 제휴 혜택", pathPrefix: "/benefits" },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [major, setMajor] = useState("");
  const [popularPosts, setPopularPosts] = useState({
    notices: [],
    events: [],
    benefits: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("notices");

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserMajorAndPosts = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let userMajor = "";
        if (userDoc.exists()) {
          userMajor = userDoc.data().major || "";
          setMajor(userMajor);
        }

        await fetchPopularPosts(userMajor);
      }
    };

    const fetchPopularPosts = async (userMajor) => {
      const fetchCategory = async (collectionName) => {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);

        let docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (userMajor) {
          docs = docs.filter((doc) => doc.major === userMajor);
        }

        docs.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        return docs.slice(0, 5);
      };

      const [notices, events, benefits] = await Promise.all([
        fetchCategory("notices"),
        fetchCategory("events"),
        fetchCategory("benefits"),
      ]);

      setPopularPosts({ notices, events, benefits });
    };

    fetchUserMajorAndPosts();
  }, [user]);

  return (
    <div style={layoutStyle}>
      {/* 왼쪽 네브바 */}
      <aside style={sidebarStyle}>
        <img src={logo} alt="CamNote 로고" style={styles.logo} />
        <div style={sidebarTabContainerStyle}>
          {Object.entries(categoryInfo).map(([key, { label }]) => {
            const icon = label.slice(0, 2).trim();
            const text = label.slice(icon.length).trim();

            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  ...sidebarTabButtonStyle,
                  ...(selectedCategory === key ? sidebarActiveButtonStyle : {}),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "8px",
                  paddingLeft: "16px",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "20px", lineHeight: 1 }}>{icon}</span>
                <span>{text}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 오른쪽 메인 콘텐츠 */}
      <main style={mainStyle}>
        <section style={popularSectionStyle}>
          <div style={majorHeaderStyle}>
            <p style={majorLabelStyle}>
              📚 내 전공: {major || "설정되지 않음"}
            </p>
            <button
              style={changeMajorButtonStyle}
              onClick={() => navigate("/major")}
            >
              전공 변경
            </button>
          </div>

          <h2 style={titleStyle}>🔥 인기 글</h2>
          <p style={categoryLabelStyle}>
            {categoryInfo[selectedCategory].label}
          </p>

          <ul style={postListStyle}>
            {popularPosts[selectedCategory] &&
            popularPosts[selectedCategory].length > 0 ? (
              popularPosts[selectedCategory].map((post, index) => (
                <li
                  key={post.id}
                  style={postItemStyle}
                  onClick={() =>
                    navigate(
                      `${categoryInfo[selectedCategory].pathPrefix}/${post.id}`
                    )
                  }
                >
                  <strong>{index + 1}위 :</strong> {post.title || "(제목 없음)"}{" "}
                  <span style={viewCountStyle}>
                    ({post.viewCount || 0}회 조회)
                  </span>
                </li>
              ))
            ) : (
              <li style={{ color: "#999" }}>게시글 없음</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

// 전체 레이아웃
const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "'Noto Sans KR', sans-serif",
};

// 왼쪽 사이드바
const sidebarStyle = {
  width: "240px",
  backgroundColor: "#1976d2",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "20px",
};

// 메인 콘텐츠 영역
const mainStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  padding: "40px 20px 20px 20px",
  boxSizing: "border-box",
};

// 인기글 섹션
const popularSectionStyle = {
  textAlign: "center",
  width: "100%",
  maxWidth: "720px",
  margin: "0 auto",
};

// 전공 및 버튼 행
const majorHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

// 전공 텍스트
const majorLabelStyle = {
  fontSize: "15px",
  color: "#333",
};

// 전공 변경 버튼
const changeMajorButtonStyle = {
  fontSize: "14px",
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #1976d2",
  backgroundColor: "white",
  color: "#1976d2",
  cursor: "pointer",
};

// 제목
const titleStyle = {
  fontSize: "40px",
  marginBottom: "12px",
};

// 카테고리 이름
const categoryLabelStyle = {
  fontSize: "25px",
  marginBottom: "30px",
};

// 인기글 리스트
const postListStyle = {
  listStyle: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

// 게시글 항목
const postItemStyle = {
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "500",
  textAlign: "center",
  maxWidth: "600px",
  width: "100%",
  backgroundColor: "white",
  padding: "12px 20px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

// 조회수 스타일
const viewCountStyle = {
  color: "#888",
  fontSize: "16px",
  fontWeight: "normal",
  marginLeft: "10px",
};

// 로고
const styles = {
  logo: {
    width: "240px",
    marginBottom: "20px",
  },
};

// 사이드바 탭
const sidebarTabContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  marginTop: "20px",
  width: "100%",
};

// 사이드바 버튼
const sidebarTabButtonStyle = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "white",
  color: "#1976d2",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  width: "100%",
  textAlign: "left",
};

// 활성 버튼
const sidebarActiveButtonStyle = {
  backgroundColor: "#0d47a1",
  color: "white",
};
