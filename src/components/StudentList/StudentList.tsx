import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types/student';
import { studentService } from '../../services/studentService';
import styles from './StudentList.module.css';

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.major ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, students]);

  function load() {
    setLoading(true);
    setError('');
    studentService
      .getAll()
      .then((data) => {
        setStudents(data);
        setFiltered(data);
      })
      .catch(() => setError('Failed to load students.'))
      .finally(() => setLoading(false));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleDelete(student: Student) {
    if (!window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) return;
    setDeletingId(student.id!);
    studentService
      .delete(student.id!)
      .then(() => {
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        showToast('Student deleted.');
      })
      .catch(() => showToast('Failed to delete student.'))
      .finally(() => setDeletingId(null));
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Students</h1>
        <button className={styles.addBtn} onClick={() => navigate('/students/new')}>
          + Add
        </button>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search by name, email, major…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className={styles.center}>
          <div className={styles.spinner} />
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button className={styles.retryBtn} onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👤</div>
          <p>{search ? `No results for "${search}"` : 'No students yet.'}</p>
        </div>
      )}

      <ul className={styles.list}>
        {filtered.map((student) => (
          <li key={student.id} className={styles.card}>
            <div
              className={styles.cardBody}
              onClick={() => navigate(`/students/${student.id}`)}
            >
              <div className={styles.avatar}>
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>
                  {student.firstName} {student.lastName}
                </span>
                <span className={styles.email}>{student.email}</span>
                {student.major && (
                  <span className={styles.badge}>{student.major}</span>
                )}
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.iconBtn}
                onClick={() => navigate(`/students/${student.id}/edit`)}
                aria-label="Edit"
              >
                ✏️
              </button>
              <button
                className={`${styles.iconBtn} ${styles.danger}`}
                onClick={() => handleDelete(student)}
                disabled={deletingId === student.id}
                aria-label="Delete"
              >
                {deletingId === student.id ? '…' : '🗑️'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
