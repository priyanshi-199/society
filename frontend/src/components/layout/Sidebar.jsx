import { NavLink } from 'react-router-dom';
import { HouseDoor, Megaphone, CashStack, ClipboardData, People, ClipboardCheck, JournalText, PeopleFill, ChatDots, Person } from 'react-bootstrap-icons';
import './layout.css';
import { useAuth } from '../../context/AuthContext';

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HouseDoor },
  { to: '/notices', label: 'Notices', icon: Megaphone },
  { to: '/maintenance', label: 'Maintenance', icon: CashStack },
  { to: '/complaints', label: 'Complaints', icon: ClipboardData },
  { to: '/polls', label: 'Polls', icon: ClipboardCheck },
  { to: '/visitors', label: 'Visitors', icon: People },
  { to: '/payments', label: 'Payments', icon: JournalText },
  { to: '/security-gates', label: 'Security Gates', icon: PeopleFill },
  { to: '/community', label: 'Community', icon: ChatDots },
];

export function Sidebar() {
  const { hasRole, user } = useAuth();
  let navItems = [];

  if (hasRole('security')) {
    navItems = [
      { to: '/visitors', label: 'Visitors', icon: People },
      { to: '/profile', label: 'Profile', icon: Person }
    ];
  } else {
    navItems = [...baseNavItems];
    
    if (hasRole('tenant')) {
      navItems = navItems.filter(item => !['/maintenance', '/payments'].includes(item.to));
    }
    
    if (hasRole('security')) {
      navItems = navItems.filter(item => item.to !== '/community');
    }
    
    if (hasRole(['admin', 'committee'])) {
      navItems.push({ to: '/admin/users', label: 'Members', icon: PeopleFill });
    } else if (hasRole(['owner', 'tenant'])) {
      navItems.push({ to: '/members', label: 'Members', icon: PeopleFill });
    }
    
    navItems.push({ to: '/profile', label: 'Profile', icon: Person });
  }

  return (
    <aside className="sc-sidebar">
      <div className="sidebar-header">
        <h4 className="m-0">Society Connect</h4>
        <small>Manage your community</small>
      </div>
      <nav className="nav flex-column">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        © {new Date().getFullYear()} Society Connect
      </div>
    </aside>
  );
}
