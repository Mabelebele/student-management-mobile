import { Student } from '../types/student';

const BASE_URL = '/api/students';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const studentService = {
  getAll(): Promise<Student[]> {
    return fetch(BASE_URL).then(handleResponse<Student[]>);
  },

  getById(id: number): Promise<Student> {
    return fetch(`${BASE_URL}/${id}`).then(handleResponse<Student>);
  },

  searchByEmail(email: string): Promise<Student> {
    return fetch(`${BASE_URL}/search?email=${encodeURIComponent(email)}`).then(
      handleResponse<Student>
    );
  },

  create(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    return fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    }).then(handleResponse<Student>);
  },

  update(id: number, student: Partial<Student>): Promise<Student> {
    return fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    }).then(handleResponse<Student>);
  },

  delete(id: number): Promise<void> {
    return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(
      handleResponse<void>
    );
  },
};
