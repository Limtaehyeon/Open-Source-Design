import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserMajorRedirect() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMajor = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const major = userDoc.exists() ? userDoc.data().major : null;
      if (major) {
        navigate("/home");
      } else {
        navigate("/major");
      }
    };
    if (!loading) checkMajor();
  }, [user, loading, navigate]);

  return (
    <div style={styles.container}>
      <p style={styles.text}>전공 정보를 확인 중입니다...</p>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: "#e3f2fd",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#0d47a1",
    fontSize: "1.2rem",
    fontWeight: "600",
  },
};
