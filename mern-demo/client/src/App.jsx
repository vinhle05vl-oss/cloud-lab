
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
      <h1>Ứng dụng Quản lý Sinh viên MERN - Version 2.0</h1>

      <div
        style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '10px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Phiên bản mới 2.0 - Production
      </div>

      <StudentForm onStudentAdded={handleStudentAdded} />

      <StudentList key={refreshKey} />
    </div>
  )
}

export default App

