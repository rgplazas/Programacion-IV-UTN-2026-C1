// Un componente en Angular es la unidad básica de la UI.
// Este componente actua como CONTENEDOR: orquesta la lista de usuarios
// y delega al servicio toda la lógica de negocio.
// La separación de responsabilidades es clave: el componente solo sabe cómo
// MOSTRAR y REACCIONAR, el servicio sabe cómo GESTIONAR los datos.
import { Component, inject, OnInit } from '@angular/core';
import { UserCard } from '../user-card/user-card';
import { UserService } from '../../service/user';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-user-list',
  // Para usar <app-user-card> en el template, debemos declararlo en imports.
  // En Angular 17+ con componentes standalone, los imports van aquí
  // y no en un NgModule como en versiones anteriores.
  imports: [UserCard],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})

// implements OnInit obliga a la clase a definir el método ngOnInit().
// ngOnInit es un hook del ciclo de vida de Angular: se ejecuta automáticamente
// DESPUÉS de que Angular terminó de crear el componente e inicializar sus inputs.
// Es el lugar correcto para iniciar cargas de datos, a diferencia del constructor
// que se ejecuta antes de que Angular esté completamente listo.
export class UserList implements OnInit {
  // inject() es la forma moderna de obtener una instancia del servicio.
  // Como el servicio es Singleton, todos los componentes que lo inyecten
  // acceden al MISMO estado compartido.
  private userService = inject(UserService);

  subtitle = 'Gestión de usuarios';

  // Asignamos las señales y computed del servicio a propiedades del componente.
  // De esta forma el template puede invocarlas directamente como funciones: filterUsers()
  // Cuando la señal cambie en el servicio, Angular actualiza la vista automáticamente.
  filterUsers   = this.userService.filterUsers;
  totalCount    = this.userService.totalCount;
  filteredCount = this.userService.filteredCount;
  loading       = this.userService.loading;
  error         = this.userService.error;

  // ngOnInit: aquí le decimos al servicio que cargue los datos.
  // El componente es quien decide CUÁNDO cargar, el servicio decide CÓMO cargar.
  // Si el constructor del servicio lo hiciera automáticamente, perderíamos
  // esa capacidad de control (por ejemplo, no podríamos recargar en otro momento).
  ngOnInit(): void {
    this.userService.loadUser();
  }

  // El componente recibe el objeto completo y lo pasa directo al servicio.
  // No reconstruye el objeto campo por campo: eso sería duplicar responsabilidad.
  // El tipo Omit<User, 'id' | 'createdAt'> asegura que quien llame a este método
  // no necesite proveer el id ni la fecha, ya que el servicio los genera.
  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    this.userService.addUser(user);
  }

  // Los métodos de abajo son simples puentes entre el template y el servicio.
  // El template no puede llamar al servicio directamente, lo hace a través del componente.
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId);
  }

  toggleUserStatus(userId: number): void {
    this.userService.toggleUserStatus(userId);
  }

  setFilter(newFilter: string): void {
    this.userService.setFilter(newFilter);
  }
}
