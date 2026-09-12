import { useState, useEffect } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ studentId: '', name: '', email: '' });

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi fetch:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditClick = (sv) => {
    setEditingId(sv._id);
    setEditForm({
      studentId: sv.studentId || sv.mssv || '',
      name: sv.name || sv.hoTen || '',
      email: sv.email || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ studentId: '', name: '', email: '' });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingId(null);
        fetchStudents();
        alert('✅ Cập nhật sinh viên thành công!');
      } else {
        alert('❌ Cập nhật thất bại!');
      }
    } catch (error) {
      alert('❌ Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStudents();
        alert('✅ Xóa sinh viên thành công!');
      }
    } catch (error) {
      alert('❌ Lỗi: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Danh sách sinh viên</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào</td></tr>
          ) : (
            students.map((sv) => (
              <tr key={sv._id}>
                {editingId === sv._id ? (
                  <>
                    <td><input value={editForm.studentId} onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })} /></td>
                    <td><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                    <td><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></td>
                    <td>
                      <button onClick={() => handleUpdate(sv._id)} style={{ background: 'green', color: 'white' }}>💾 Lưu</button>
                      <button onClick={handleCancelEdit} style={{ background: 'gray', color: 'white' }}>❌ Hủy</button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* ✅ Dùng fallback để hỗ trợ cả 2 schema cũ/mới */}
                    <td>{sv.studentId || sv.mssv || '—'}</td>
                    <td>{sv.name || sv.hoTen || '—'}</td>
                    <td>{sv.email}</td>
                    <td>
                      <button onClick={() => handleEditClick(sv)} style={{ background: 'blue', color: 'white' }}>✏️ Sửa</button>
                      <button onClick={() => handleDelete(sv._id)} style={{ background: 'red', color: 'white' }}>🗑️ Xóa</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;