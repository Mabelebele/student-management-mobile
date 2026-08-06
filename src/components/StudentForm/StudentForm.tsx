import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Student } from '../../types/student';
import { studentService } from '../../services/studentService';
import styles from './StudentForm.module.css';

const emptyForm: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  major: '',
};

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function StudentForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    studentService
      .getById(Number(id))
      .then((s) =>
        setForm({
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          dateOfBirth: s.dateOfBirth ?? '',
          major: s.major ?? '',
        })
      )
      .catch(() => setServerError('Failed to load student.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function validate(): boolean {
    const errs: FieldErrors = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');

    const payload = {
      ...form,
      dateOfBirth: form.dateOfBirth || undefined,
      major: form.major || undefined,
    };

    const request = isEdit
      ? studentService.update(Number(id), payload)
      : studentService.create(payload);

    request
      .then((saved) => navigate(`/students/${saved.id}`))
      .catch(() => setServerError('Failed to save. Please try again.'))
      .finally(() => setSubmitting(false));
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.title}>{isEdit ? 'Edit Student' : 'New Student'}</h1>
      </div>

      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Field
          label="First Name *"
          value={form.firstName}
          onChange={(v) => handleChange('firstName', v)}
          error={errors.firstName}
          placeholder="e.g. Jane"
          autoFocus
        />
        <Field
          label="Last Name *"
          value={form.lastName}
          onChange={(v) => handleChange('lastName', v)}
          error={errors.lastName}
          placeholder="e.g. Doe"
        />
        <Field
          label="Email *"
          value={form.email}
          onChange={(v) => handleChange('email', v)}
          error={errors.email}
          type="email"
          placeholder="e.g. jane@example.com"
        />
        <Field
          label="Date of Birth"
          value={form.dateOfBirth ?? ''}
          onChange={(v) => handleChange('dateOfBirth', v)}
          type="date"
        />
        <Field
          label="Major"
          value={form.major ?? ''}
          onChange={(v) => handleChange('major', v)}
          placeholder="e.g. Computer Science"
        />

        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

function Field({ label, value, onChange, error, type = 'text', placeholder, autoFocus }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <input
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
