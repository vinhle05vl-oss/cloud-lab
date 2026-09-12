import { useState } from 'react'
import StudentList from './StudentList'
import StudentForm from './StudentForm'
import './App.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleStudentAdded = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Ứng dụng Quản lý Sinh viên (MERN)</h1>

      <StudentForm onStudentAdded={handleStudentAdded} />

      <StudentList key={refreshKey} />
    </div>
  )
}

export default App