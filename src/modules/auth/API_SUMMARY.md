# Auth API

Base URL: `/api/v1/auth`

## Endpoints

### POST /login
Iniciar sesión
```
Body: { email, password }
Response: LoginResponse
```

### POST /logout
Cerrar sesión (limpia cookie)
```
Response: { status: "success", message: "Sesión cerrada", data: null }
```

### GET /check-status
Verificar estado de autenticación (requiere auth)
```
Response: LoginResponse
```

### GET /profile
Obtener perfil del usuario autenticado (requiere auth)
```
Response: UserProfile
```

### POST /forgot-password
Solicitar código de recuperación
```
Body: { email }
Response: { message: "..." }
```

### POST /reset-password
Restablecer contraseña con código
```
Body: { email, code, newPassword }
Response: { message: "..." }
```

### POST /change-password
Cambiar contraseña (requiere auth)
```
Body: { currentPassword, newPassword }
Response: { message: "..." }
```

---

## DTOs

### LoginRequest
```typescript
{
  email: string,     // "usuario@ejemplo.com"
  password: string   // min 6 caracteres
}
```

### LoginResponse
```typescript
{
  id: number,
  email: string,
  nombre: string,
  apellido: string,
  cedula: string,
  roles: string[],   // ["ADMIN", "SECRETARIA"]
  token: string      // JWT
}
```

### ForgotPasswordRequest
```typescript
{
  email: string
}
```

### ResetPasswordRequest
```typescript
{
  email: string,
  code: string,        // 6 dígitos
  newPassword: string  // min 6 caracteres
}
```

### ChangePasswordRequest
```typescript
{
  currentPassword: string,
  newPassword: string
}
```
