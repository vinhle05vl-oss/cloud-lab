import { useState, useEffect } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ mssv: '', hoTen: '', email: '' });

  // ✅ Lấy danh sách sinh viên
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

  // ✅ Bắt đầu sửa
  const handleEditClick = (sv) => {
    setEditingId(sv._id);
    setEditForm({ mssv: sv.mssv, hoTen: sv.hoTen, email: sv.email });
  };

  // ✅ Hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ mssv: '', hoTen: '', email: '' });
  };

  // ✅ Cập nhật sinh viên (PUT)
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
      console.error('Lỗi update:', error);
      alert('❌ Lỗi: ' + error.message);
    }
  };

  // ✅ Xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return;
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchStudents();
        alert('✅ Xóa sinh viên thành công!');
      } else {
        alert('❌ Xóa thất bại!');
      }
    } catch (error) {
      console.error('Lỗi delete:', error);
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
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào</td>
            </tr>
          ) : (
            students.map((sv) => (
              <tr key={sv._id}>
                {editingId === sv._id ? (
                  // ✅ Chế độ SỬA
                  <>
                    <td>
                      <input
                        value={editForm.mssv}
                        onChange={(e) => setEditForm({ ...editForm, mssv: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.hoTen}
                        onChange={(e) => setEditForm({ ...editForm, hoTen: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(sv._id)} style={{ background: 'green', color: 'white', marginRight: '4px' }}>
                        💾 Lưu
                      </button>
                      <button onClick={handleCancelEdit} style={{ background: 'gray', color: 'white' }}>
                        ❌ Hủy
                      </button>
                    </td>
                  </>
                ) : (
                  // ✅ Chế độ XEM
                  <>
                    <td>{sv.mssv}</td>
                    <td>{sv.hoTen}</td>
                    <td>{sv.email}</td>
                    <td>
                      <button onClick={() => handleEditClick(sv)} style={{ background: 'blue', color: 'white', marginRight: '4px' }}>
                        ✏️ Sửa
                      </button>
                      <button onClick={() => handleDelete(sv._id)} style={{ background: 'red', color: 'white' }}>
                        🗑️ Xóa
                      </button>
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