import { User, Store} from 'lucide-react';
import styles from '../styles/Profile.module.css';

export function ProfileHeader({ user }) {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarBig}>
          {user.name.charAt(0)}
        </div>
      <div>
        <h1>{user.name}</h1>
      </div>
    </div>
  </div>
)};
