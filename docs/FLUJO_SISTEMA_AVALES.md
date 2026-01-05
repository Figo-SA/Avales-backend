# Sistema de Gestión de Avales - Documentación del Flujo

## Resumen General

Este sistema gestiona el proceso de solicitud y aprobación de avales para eventos deportivos de una federación. El flujo involucra múltiples roles y etapas de revisión antes de la aprobación final del presupuesto.

---

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| `ENTRENADOR` | Crea solicitudes de aval para eventos |
| `DTM` | Director Técnico Metodológico - Revisa y aprueba solicitudes |
| `DTM_EIDE` | DTM de escuela (variante) |
| `PDA` | Plan de Desarrollo Anual - Gestiona presupuestos |
| `CONTROL_PREVIO` | Último control antes de enviar a financiero/contador |
| `SECRETARIA` | Revisión administrativa |
| `FINANCIERO` | Aprobación final de presupuestos |
| `ADMIN` / `SUPER_ADMIN` | Administradores del sistema |

---

## Flujo Principal del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INICIO DE AÑO                                      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ CARGA MASIVA DE EVENTOS                                              │    │
│  │ (Entrenadores + DTM)                                                 │    │
│  │                                                                      │    │
│  │ Se crean:                                                            │    │
│  │ • Evento (datos del evento deportivo)                                │    │
│  │ • EventoItem (presupuesto ESTIMADO por item/mes)                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CUANDO SE ACERCA EL EVENTO                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 1: SOLICITUD DE AVAL (Entrenador)                               │    │
│  │                                                                      │    │
│  │ Se crean:                                                            │    │
│  │ • ColeccionAval (contenedor principal)                               │    │
│  │ • AvalTecnico (detalles técnicos: fechas, transporte, atletas)       │    │
│  │ • AvalObjetivo (objetivos del viaje)                                 │    │
│  │ • AvalCriterio (criterios de selección)                              │    │
│  │ • AvalRequerimiento (requerimientos técnicos)                        │    │
│  │ • DeportistaAval (deportistas seleccionados)                         │    │
│  │ • ColeccionEntrenador (entrenadores asignados)                       │    │
│  │                                                                      │    │
│  │ Estado: SOLICITADO                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 2: REVISIÓN METODÓLOGO/DTM                                      │    │
│  │                                                                      │    │
│  │ • Revisa la solicitud técnica                                        │    │
│  │ • Si RECHAZA: agrega comentario, vuelve al entrenador                │    │
│  │ • Si APRUEBA: pasa al siguiente paso                                 │    │
│  │                                                                      │    │
│  │ Se registra en: HistorialAvalTecnico                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 3: REVISIÓN DTM                                                 │    │
│  │                                                                      │    │
│  │ Se crea:                                                             │    │
│  │ • Dtm (documento de aprobación DTM)                                  │    │
│  │                                                                      │    │
│  │ • Si RECHAZA: agrega comentario, vuelve atrás                        │    │
│  │ • Si APRUEBA: pasa al PDA                                            │    │
│  │                                                                      │    │
│  │ Se registra en: HistorialDtm                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 4: CREACIÓN DEL PDA (Rol PDA)                                   │    │
│  │                                                                      │    │
│  │ Se crean:                                                            │    │
│  │ • Pda (documento PDA)                                                │    │
│  │ • PdaItem (items con presupuesto SOLICITADO)                         │    │
│  │                                                                      │    │
│  │ NOTA: Los items pueden ser DIFERENTES a los del EventoItem           │    │
│  │ porque el PDA puede ajustar según necesidad real.                    │    │
│  │                                                                      │    │
│  │ Se registra en: HistorialPda                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 5: CONTROL PREVIO                                               │    │
│  │                                                                      │    │
│  │ • Revisión de documentación                                          │    │
│  │ • Si hay errores: rechaza con comentario                             │    │
│  │ • Si está correcto: aprueba                                          │    │
│  │                                                                      │    │
│  │ Se registra en: HistorialPda (estado ACEPTADO/RECHAZADO)             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 6: REVISIÓN SECRETARÍA                                          │    │
│  │                                                                      │    │
│  │ • Revisión administrativa final                                      │    │
│  │ • Si hay errores: rechaza con comentario                             │    │
│  │ • Si está correcto: aprueba y pasa a financiero                      │    │
│  │                                                                      │    │
│  │ Se registra en: HistorialColeccion                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PASO 7: APROBACIÓN FINANCIERA (Rol FINANCIERO)                       │    │
│  │                                                                      │    │
│  │ Se crean:                                                            │    │
│  │ • Financiero (datos de pago: cuenta, RUC, etc.)                      │    │
│  │ • FinancieroItem (presupuesto APROBADO/REAL por item)                │    │
│  │                                                                      │    │
│  │ NOTA: El valor puede ser DIFERENTE al solicitado en PdaItem          │    │
│  │ porque financiero asigna según disponibilidad real.                  │    │
│  │                                                                      │    │
│  │ Se registra en: HistorialFinanciero                                  │    │
│  │ Estado final: ACEPTADO                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Evolución del Presupuesto

El presupuesto pasa por 3 etapas con valores potencialmente diferentes:

| Etapa | Tabla | Campo | Descripción |
|-------|-------|-------|-------------|
| 1. Estimado | `EventoItem` | `presupuesto` | Valor planificado en carga masiva (inicio de año) |
| 2. Solicitado | `PdaItem` | `presupuesto` | Valor que solicita el PDA (puede diferir del estimado) |
| 3. Aprobado | `FinancieroItem` | `precioAsignado` | Valor real asignado por financiero |

---

## Flujo de Rechazo

Cuando cualquier revisor rechaza, el flujo retrocede:

```
Si RECHAZADO en cualquier paso:
  1. Se registra el estado RECHAZADO en el historial correspondiente
  2. Se agrega un comentario explicando el motivo
  3. El documento regresa al último editor para correcciones
  4. Una vez corregido, vuelve a iniciar el flujo de revisión
```

---

## Modelo de Datos Principal

```
Evento (evento deportivo)
  └── EventoItem[] (presupuesto estimado por item/mes)
  └── ColeccionAval (solicitud de aval)
        ├── AvalTecnico (detalles técnicos)
        │     ├── AvalObjetivo[] (objetivos)
        │     ├── AvalCriterio[] (criterios)
        │     ├── AvalRequerimiento[] (requerimientos)
        │     ├── DeportistaAval[] (deportistas)
        │     └── HistorialAvalTecnico[] (historial)
        │
        ├── ColeccionEntrenador[] (entrenadores)
        │
        ├── Dtm (aprobación DTM)
        │     └── HistorialDtm[] (historial)
        │
        ├── Pda (documento PDA)
        │     ├── PdaItem[] (presupuesto solicitado)
        │     └── HistorialPda[] (historial)
        │
        ├── Financiero (aprobación financiera)
        │     ├── FinancieroItem[] (presupuesto aprobado)
        │     └── HistorialFinanciero[] (historial)
        │
        └── HistorialColeccion[] (historial general)
```

---

## Observaciones y Posibles Mejoras

### 1. ~~Falta campo de comentario en los historiales~~ CORREGIDO

El historial unificado `HistorialColeccion` tiene el campo `comentario`.

### 2. ~~Faltan roles para Control Previo~~ CORREGIDO

Se agregó el rol `CONTROL_PREVIO` al enum `TipoRol`.

### 3. ~~Historial separado por documento~~ SIMPLIFICADO

Se eliminaron los historiales separados (`HistorialAvalTecnico`, `HistorialPda`, `HistorialDtm`, `HistorialFinanciero`) y ahora todo se maneja en `HistorialColeccion` con el campo `etapa` que indica en qué paso del flujo ocurrió el evento.

### 4. Relación Dtm - AvalTecnico

**Observación:** Actualmente `Dtm` se relaciona con `ColeccionAval`, no directamente con `AvalTecnico`. Esto está bien si el DTM revisa toda la colección, no solo el aval técnico.

### 5. Múltiples registros Pda/Dtm/Financiero por ColeccionAval

**Observación:** Las relaciones son `Pda[]`, `Dtm[]`, `Financiero[]` (arrays), lo que permite múltiples registros por colección.

**Pregunta:** ¿Es intencional? ¿Puede haber más de un PDA por solicitud? Si solo debe haber uno, considerar hacerlo `@unique` como `AvalTecnico`.

### 6. Catálogos: Item vs Rubro - ADVERTENCIA

**Observación:** Existen dos catálogos que podrían estar duplicando el mismo concepto:
- `Item` (relacionado con `Actividad`) → usado en `EventoItem`, `PdaItem`, `FinancieroItem`
- `Rubro` → usado en `AvalRequerimiento`

**Estado:** Se dejó una advertencia en el schema para revisar en el futuro si deben unificarse.

---

## Estados del Sistema

```prisma
enum Estado {
  DISPONIBLE  // Evento disponible para solicitar aval
  SOLICITADO  // Solicitud creada, en proceso de revisión
  RECHAZADO   // Rechazado en alguna etapa
  ACEPTADO    // Aprobado completamente
}
```

---

## Resumen de Tablas por Funcionalidad

### Catálogos (datos maestros)
- `Disciplina` - Deportes
- `Categoria` - Categorías de competencia
- `Actividad` → `Item` - Items presupuestarios
- `Rubro` - Rubros de requerimientos
- `Rol` - Roles del sistema

### Personas
- `Usuario` - Usuarios del sistema
- `Deportista` - Atletas
- `Entrenador` - Entrenadores

### Eventos y Presupuesto Anual
- `Evento` - Eventos deportivos
- `EventoItem` - Presupuesto estimado por evento

### Proceso de Avales
- `ColeccionAval` - Contenedor principal de la solicitud
- `AvalTecnico` - Detalles técnicos de la solicitud
- `AvalObjetivo` - Objetivos del viaje
- `AvalCriterio` - Criterios de selección
- `AvalRequerimiento` - Requerimientos técnicos
- `DeportistaAval` - Deportistas en el aval
- `ColeccionEntrenador` - Entrenadores en el aval

### Documentos de Aprobación
- `Dtm` - Documento de aprobación DTM
- `Pda` → `PdaItem` - Documento PDA con presupuesto solicitado
- `Financiero` → `FinancieroItem` - Aprobación financiera con presupuesto real

### Historial Unificado (auditoría)
- `HistorialColeccion` - Historial de todo el flujo con campo `etapa` (EtapaFlujo)
