import { useState } from 'react'

function StudentForm({ onStudentAdded }) {
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: '',
  })

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    if (!form.studentId.trim() || !form.name.trim() || !form.email.trim()) {
      setIsError(true)
      setMessage('Vui lòng nhập đầy đủ thông tin.')
      return
    }

    try {
      setIsSubmitting(true)

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `HTTP ${res.status}`)
      }

      const newStudent = await res.json()

      // ✅ Hiển thị MSSV và Họ tên
      setMessage(`✅ Đã thêm sinh viên: ${form.studentId} - ${form.name}`);
      setIsError(false)
      setForm({ studentId: '', name: '', email: '' })

      if (onStudentAdded) onStudentAdded()
    } catch (err) {
      setIsError(true)
      setMessage(`❌ Lỗi: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', background: '#fafafa' }}>
      <h3 style={{ marginTop: 0 }}>Thêm sinh viên mới</h3>

      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="studentId" placeholder="MSSV (VD: SV001)" value={form.studentId} onChange={handleChange} style={{ padding: '8px', width: '300px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="name" placeholder="Họ tên (VD: Nguyen Van A)" value={form.name} onChange={handleChange} style={{ padding: '8px', width: '300px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input type="email" name="email" placeholder="Email (VD: a@example.com)" value={form.email} onChange={handleChange} style={{ padding: '8px', width: '300px' }} />
      </div>

      <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px', background: isSubmitting ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
        {isSubmitting ? 'Đang thêm...' : 'Thêm sinh viên'}
      </button>

      {message && (
        <p style={{ marginTop: '10px', color: isError ? 'red' : 'green', fontWeight: 'bold' }}>
          {message}
        </p>
      )}
    </form>
  )
}

export default StudentForm