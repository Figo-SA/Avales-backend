import { Usuario } from '@prisma/client';

export type UsuarioConRoles = Usuario & {
  usuariosRol: {
    rol: {
      nombre: string;
    };
  }[];
};
