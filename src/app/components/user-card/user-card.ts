// UserCard es un componente PRESENTACIONAL (o "tonto"):
// no sabe nada del servicio, no tiene logica de negocio.
// Solo recibe datos por inputs, los muestra y emite eventos hacia arriba.
// Esta separacion facilita la reutilizacion y el testing del componente.
import { Component, input, output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {

  // input() es la API moderna de Angular 17+ para recibir datos del componente padre.
  // input.required<User>() indica que este input es OBLIGATORIO: si el padre no lo
  // proporciona, Angular lanzara un error en tiempo de compilacion.
  // Para leer el valor en el template o en el .ts, se llama como funcion: user()
  user = input.required<User>();

  // output() es la API moderna para emitir eventos hacia el componente padre.
  // <number> indica el tipo del dato que se emite (en este caso el id del usuario).
  // El padre escucha estos eventos con (onToggleStatus)="..." y (onDelete)="..."
  onToggleStatus = output<number>();
  onDelete = output<number>();

  // getInitials(): metodo de presentacion pura — toma la primera letra del nombre
  // y la primera del apellido y las devuelve en mayusculas para mostrar en el avatar.
  // Es logica de VISTA, por eso vive en el componente y no en el servicio.
  getInitials(): string {
    const n = this.user().nombre?.charAt(0) ?? '';
    const a = this.user().apellido?.charAt(0) ?? '';
    return (n + a).toUpperCase();
  }

  // Este metodo es llamado desde el template cuando el usuario hace click en el boton.
  // El componente NO modifica el estado directamente: emite el id hacia arriba
  // y es el padre (UserList) quien decide que hacer con esa informacion.
  toggleStatus(): void {
    this.onToggleStatus.emit(this.user().id);
  }

  deleteUser(): void {
    this.onDelete.emit(this.user().id);
  }
}
