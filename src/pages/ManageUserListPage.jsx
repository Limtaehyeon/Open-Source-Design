import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function ManageUserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });

      setUsers(usersData);
    } catch (err) {
      console.error("사용자 목록 불러오기 실패:", err);
      setError("사용자 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("정말 이 사용자를 삭제하시겠습니까?")) return;

    setDeletingId(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
      await fetchUsers();
      alert("사용자 삭제가 완료되었습니다.");
    } catch (err) {
      console.error("사용자 삭제 실패:", err);
      alert("사용자 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading)
    return (
      <div style={styles.container}>
        <p>로딩 중...</p>
      </div>
    );
  if (error)
    return (
      <div style={{ ...styles.container, color: "red" }}>
        <p>{error}</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ← 뒤로가기
      </button>
      <h2 style={styles.title}>사용자 목록</h2>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>이메일</th>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>가입일</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  등록된 사용자가 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.email || "-"}</td>
                  <td style={styles.td}>{user.name || "-"}</td>
                  <td style={styles.td}>
                    {user.createdAt?.toDate
                      ? user.createdAt.toDate().toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={styles.deleteButton}
                      disabled={deletingId === user.id}
                    >
                      {deletingId === user.id ? "삭제중..." : "삭제"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    marginBottom: "1rem",
    fontSize: "1rem",
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
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "1rem",
  },
  th: {
    backgroundColor: "#bbdefb",
    color: "#0d47a1",
    padding: "12px",
    borderBottom: "2px solid #90caf9",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e0e0e0",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
    fontStyle: "italic",
  },
  deleteButton: {
    backgroundColor: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
