export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export type UserFilter = 'all' | 'active' | 'inactive';


export const MOCK_USERS: User[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@example.com',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date('2023-02-01'),
  },
  {
    id: 3,
    nombre: 'Pedro',
    apellido: 'Martínez',
    email: 'pedro.martinez@example.com',
    avatar: 'https://via.placeholder.com/150',
    isActive: false,
    createdAt: new Date('2023-03-01'),
  },
  {
    id: 4,
    nombre: 'Pablo',
    apellido: 'Nuñez',
    email: 'pablo.nunez@example.com',
    avatar: 'https://via.placeholder.com/150',
    isActive: false,
    createdAt: new Date('2026-04-21'),
  },
  {
    id: 5,
    nombre: 'Gaston',
    apellido: 'Vera',
    email: 'gaston.vera@example.com',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date('2026-04-21'),
  },
];