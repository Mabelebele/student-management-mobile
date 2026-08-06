import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';

interface Props {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/students', label: 'Students', icon: '👥' },
];

export default function Layout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      <header className={styles.appBar}>
        <span className={styles.appName}>🎓 StudentHub</span>
      </header>

      <main className={styles.main}>{children}</main>

      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
