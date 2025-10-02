import { Usuario } from '@prisma/client';

type UsuarioConRoles = Usuario & {
  usuariosRol: {
    rol: {
      nombre: string;
    };
  }[];
};

export function cleanUser(user: UsuarioConRoles) {
  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    cedula: user.cedula,
    roles: user.usuariosRol.map((ur) => ur.rol.nombre),
  };
}
