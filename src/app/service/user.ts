// Un servicio en Angular es una clase reutilizable que centraliza la lógica de negocio.
// El decorador @Injectable con providedIn: 'root' le indica a Angular que cree
// UNA SOLA instancia de este servicio para toda la aplicación (patrón Singleton).
// Esto significa que todos los componentes que lo inyecten comparten el mismo estado.
import { Injectable, signal, computed, inject } from '@angular/core';
import { User, UserFilter } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  // inject() es la forma moderna de inyectar dependencias en Angular 14+.
  // Reemplaza al constructor con parámetros. HttpClient nos permite hacer
  // peticiones HTTP (GET, POST, etc.) a APIs externas.
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  
  // signal() es la nueva forma de manejar estado reactivo en Angular 17+.
  // Cuando una señal cambia, Angular actualiza automáticamente la vista.
  // 'allUsers' es PRIVADA: solo este servicio puede modificarla.
  // Separamos allUsers (todos) de filter (criterio activo) para poder
  // calcular el total real y el total filtrado de forma independiente.
  private allUsers = signal<User[]>([]);
  private filter   = signal<UserFilter>('all');

  // asReadonly() expone la señal al exterior pero sin el método .set().
  // Los componentes pueden LEER el estado pero no modificarlo directamente.
  // Esto protege la integridad del estado: solo el servicio decide cómo cambia.
  users   = this.allUsers.asReadonly();
  loading = signal(false);
  error   = signal<string | null>(null);

  // Este método realiza la petición HTTP a la API.
  // Es público para que el COMPONENTE decida cuándo llamarlo (desde ngOnInit).
  // El servicio NO debe auto-ejecutarse: él provee la capacidad, el componente decide cuándo usarla.
  loadUser(): void {
    // Avisamos que la carga empezó (para mostrar un spinner o mensaje en la vista)
    this.loading.set(true);
    // Limpiamos cualquier error anterior antes de intentar de nuevo
    this.error.set(null);

    // http.get() devuelve un Observable. Con .subscribe() nos suscribimos
    // para recibir los datos cuando la respuesta llegue del servidor.
    // La API responde con su propio formato, por eso usamos 'any[]' y luego
    // transformamos los datos al formato de nuestra interfaz User.
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // .map() recorre cada usuario de la API y lo convierte a nuestro modelo.
        // La API JSONPlaceholder usa 'name' para el nombre completo
        // y 'username' para el alias. Los asignamos correctamente a nuestro modelo.
        const transformed = data.map(apiUser => ({
          id:        apiUser.id,
          nombre:    apiUser.name,     // 'name' = nombre completo (ej: "Leanne Graham")
          apellido:  apiUser.username, // 'username' = alias (ej: "Bret")
          email:     apiUser.email,
          avatar:    'https://via.placeholder.com/150',
          isActive:  true,
          createdAt: new Date()
        }));
        this.allUsers.set(transformed);
        this.loading.set(false);
      },
      // El segundo callback maneja errores de red o del servidor
      error: (_err) => {
        this.error.set('Error al cargar usuarios');
        this.loading.set(false);
      }
    });
  }

  // Omit<User, 'id' | 'createdAt'> significa: recibimos un User PERO sin los campos
  // 'id' y 'createdAt', porque esos los genera el servicio internamente.
  // El componente no necesita saber cómo se genera el id: eso es responsabilidad del servicio.
  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const newUser: User = {
      ...user,           // spread: copia todos los campos que llegón del componente
      id:        Date.now(), // usamos el timestamp como id único (en producción lo generaría el backend)
      createdAt: new Date()
    };
    // .update() recibe la lista actual y devuelve la nueva lista con el usuario agregado.
    // Usamos el operador spread [...users, newUser] para NO mutar el array original,
    // sino crear uno nuevo. Esto es fundamental para que Angular detecte el cambio.
    this.allUsers.update(users => [...users, newUser]);
  }

  // .filter() devuelve un nuevo array con todos los usuarios EXCEPTO el que tiene ese id.
  deleteUser(userId: number): void {
    this.allUsers.update(users => users.filter(u => u.id !== userId));
  }

  // .map() recorre todos los usuarios. Cuando encuentra el que tiene ese id,
  // devuelve una COPIA del objeto con isActive invertido (!u.isActive).
  // Para los demás, devuelve el objeto sin cambios.
  // El operador spread {...u} crea una copia del objeto para no mutar el original.
  toggleUserStatus(userId: number): void {
    this.allUsers.update(users =>
      users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u)
    );
  }

  // En TypeScript, 'string' (minúscula) es el tipo primitivo correcto.
  // 'String' (mayúscula) es una clase de JavaScript y NO debe usarse como tipo.
  // La guarda (if) verifica que el valor sea uno de los tres permitidos
  // antes de actualizar la señal. 'as UserFilter' indica a TypeScript
  // que confiamos en que el valor ya fue validado por la guarda.
  setFilter(newFilter: string): void {
    if (newFilter === 'active' || newFilter === 'inactive' || newFilter === 'all') {
      this.filter.set(newFilter as UserFilter);
    }
  }

  // computed() define un valor que se RECALCULA automáticamente cada vez que
  // alguna de las señales que lee cambia. Es como una fórmula de Excel.
  // Aquí lee filter() y allUsers(): si cualquiera cambia, filterUsers se actualiza.
  filterUsers = computed(() => {
    const currentFilter = this.filter();
    const all = this.allUsers();

    if (currentFilter === 'active')   return all.filter(u =>  u.isActive);
    if (currentFilter === 'inactive') return all.filter(u => !u.isActive);
    return all; // si el filtro es 'all', devuelve la lista completa
  });

  // totalCount siempre refleja cuántos usuarios hay en total,
  // sin importar qué filtro esté activo.
  totalCount    = computed(() => this.allUsers().length);
  // filteredCount refleja cuántos usuarios muestra el filtro activo.
  filteredCount = computed(() => this.filterUsers().length);

}
