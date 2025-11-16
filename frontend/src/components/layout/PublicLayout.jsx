import { Outlet } from 'react-router-dom';
import { NotificationCenter } from './NotificationCenter';

export function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Outlet />
      <NotificationCenter />
    </div>
  );
}
