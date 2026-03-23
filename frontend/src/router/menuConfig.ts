import { type UserRole } from '../models/auth';
import {
  Dashboard,
  School,
  LibraryBooks,
  People,
  Group,
  Assignment,
  BarChart,
  CardMembership,
  Settings,
  Notifications,
} from '@mui/icons-material';

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[]; // Which roles can see this item
}

export const menuConfig: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    roles: ['admin', 'manager', 'teacher', 'user'],
  },
  {
    title: 'My Learning',
    path: '/my-learning',
    icon: School,
    roles: ['user'],
  },
  {
    title: 'Course Catalog',
    path: '/catalog',
    icon: LibraryBooks,
    roles: ['admin', 'manager', 'user', 'guest'],
  },
  {
    title: 'My Courses',
    path: '/teacher/courses', // We'll update paths to be flat later
    icon: School,
    roles: ['teacher'],
  },
  {
    title: 'Course Builder',
    path: '/course-builder',
    icon: LibraryBooks,
    roles: ['admin', 'teacher'],
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: People,
    roles: ['admin', 'manager'],
  },
  {
    title: 'Groups',
    path: '/admin/groups',
    icon: Group,
    roles: ['admin', 'manager'],
  },
  {
    title: 'Enrollments',
    path: '/admin/enrollments',
    icon: Assignment,
    roles: ['admin', 'manager', 'teacher'],
  },
  {
    title: 'Reports & Analytics',
    path: '/reports',
    icon: BarChart,
    roles: ['admin', 'manager', 'teacher'],
  },
  {
    title: 'Certificates',
    path: '/certificates',
    icon: CardMembership,
    roles: ['admin', 'user'],
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: Notifications,
    roles: ['admin', 'manager', 'teacher', 'user'],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ['admin'],
  },
];
