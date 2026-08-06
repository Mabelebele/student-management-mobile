import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Student } from '../../types/student';
import { studentService } from '../../services/studentService';
import styles from './StudentDetail.module.css';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    studentService
      .getById(Number(id))
      .then(setStudent)
      .catch(() => setError('Student not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleDelete() {
    if (!student || !window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) return;
    setDeleting(true);
    studentService
      .delete(student.id!)
      .then(() => navigate('/students'))
      .catch(() => {
        alert('Failed to delete.');
        setDeleting(false);
      });
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className={styles.errorWrap}>
        <p>{error || 'Student not found.'}</p>
        <button className={styles.backBtn} onClick={() => navigate('/students')}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/students')}>
          ← Back
        </button>
        <div className={styles.topActions}>
          <button
            className={styles.editBtn}
            onClick={() => navigate(`/students/${student.id}/edit`)}
          >
            Edit
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      </div>

      <div className={styles.heroCard}>
        <div className={styles.avatar}>
          {student.firstName[0]}{student.lastName[0]}
        </div>
        <h2 className={styles.fullName}>
          {student.firstName} {student.lastName}
        </h2>
        <a className={styles.emailLink} href={`mailto:${student.email}`}>
          {student.email}
        </a>
        {student.major && <span className={styles.badge}>{student.major}</span>}
      </div>

      <div className={styles.detailList}>
        <DetailRow label="Student ID" value={String(student.id)} />
        <DetailRow label="Date of Birth" value={formatDate(student.dateOfBirth)} />
        <DetailRow label="Major" value={student.major || '—'} />
        <DetailRow label="Created" value={formatDate(student.createdAt)} />
        <DetailRow label="Last Updated" value={formatDate(student.updatedAt)} />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
