import { useEffect, useState } from 'react'

function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/students')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setStudents(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  if (loading) return <p>Đang tải danh sách sinh viên...</p>
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>

  return (
    <div>
      <h2>Danh sách sinh viên</h2>
      {students.length === 0 ? (
        <p>Chưa có sinh viên nào.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((sv) => (
              <tr key={sv._id}>
                <td>{sv.studentId}</td>
                <td>{sv.name}</td>
                <td>{sv.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default StudentList
