import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import StudentList from './components/StudentList/StudentList';
import StudentDetail from './components/StudentDetail/StudentDetail';
import StudentForm from './components/StudentForm/StudentForm';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/new" element={<StudentForm />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/:id/edit" element={<StudentForm />} />
      </Routes>
    </Layout>
  );
}
