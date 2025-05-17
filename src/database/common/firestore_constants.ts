export const DEPARTMENT_ID_CLASICO = 'clasico' as const;
export const DEPARTMENT_ID_CONTEMPORANEO = 'contemporaneo' as const;
export const DEPARTMENT_ID_ESPANOL = 'espanol' as const;
export const DEPARTMENT_ID_TEATRO = 'teatro' as const;
export const DEPARTMENT_ID_CIRCO = 'circo' as const;
export const DEPARTMENT_ID_GESTION = 'gestion' as const;
export const DEPARTMENT_ID_NONE = 'none' as const;

export const DEPARTMENT_VALUES = {
  [DEPARTMENT_ID_CLASICO]: 'Danza Clásica',
  [DEPARTMENT_ID_CONTEMPORANEO]: 'Danza Contemporánea',
  [DEPARTMENT_ID_ESPANOL]: 'Danza Española',
  [DEPARTMENT_ID_TEATRO]: 'Danza Teatro',
  [DEPARTMENT_ID_CIRCO]: 'Danzas Acrobáticas',
  [DEPARTMENT_ID_GESTION]: 'Gestión y Administración',
  [DEPARTMENT_ID_NONE]: 'Sin asignar',
} as const;

export const DEPARTMENT_EMAILS = {
  [DEPARTMENT_ID_CLASICO]: 'oscar.torrado@alicialonso.org',
  [DEPARTMENT_ID_CONTEMPORANEO]: 'enrique.velasco@alicialonso.org',
  [DEPARTMENT_ID_ESPANOL]: 'jose.buzon@alicialonso.org',
  [DEPARTMENT_ID_TEATRO]: 'jorge.gallego@alicialonso.org',
  [DEPARTMENT_ID_CIRCO]: 'jorge.gallego@alicialonso.org',
  [DEPARTMENT_ID_GESTION]: 'jorge.gallego@alicialonso.org',
} as const;

export const PROGRAM_GRADO = 'grado' as const;
export const PROGRAM_TITULO = 'titulo' as const;

export const PROGRAM_VALUES = {
  [PROGRAM_GRADO]: 'Grado en Artes Visuales y Danza',
  [PROGRAM_TITULO]: 'Título Superior en Danza',
} as const;

export const ORG_UNIT_PATH_BY_PROGRAM = {
  [PROGRAM_GRADO]: '/Estudiantes/Grado',
  [PROGRAM_TITULO]: '/Estudiantes/Titulo',
} as const;

export const USER_ROLE_STUDENT = 'student' as const;
export const USER_ROLE_TEACHER = 'teacher' as const;
export const USER_ROLE_MANAGER = 'manager' as const;
export const USER_ROLE_NONE = 'none' as const;

export const USER_ROLES = {
  [USER_ROLE_STUDENT]: 'Estudiante',
  [USER_ROLE_TEACHER]: 'Profesor',
  [USER_ROLE_MANAGER]: 'Gestor',
  [USER_ROLE_NONE]: 'Sin asignar',
} as const;

export const USER_STATUS_ACTIVE = 'active' as const;
export const USER_STATUS_SUSPENDED = 'suspended' as const;
export const USER_STATUS_DELETED = 'deleted' as const;

export const USER_STATUS = {
  [USER_STATUS_ACTIVE]: 'Activo',
  [USER_STATUS_SUSPENDED]: 'Suspendido',
  [USER_STATUS_DELETED]: 'Eliminado',
} as const;

/** Pending user email confirmation */
export const ACCOUNT_REQUEST_STATE_PENDING = 'pending' as const;
/** Awaiting manager approval */
export const ACCOUNT_REQUEST_STATE_AWAITING = 'awaiting' as const;
/** Account created */
export const ACCOUNT_REQUEST_STATE_CREATED = 'created' as const;
/** Error creating the account */
export const ACCOUNT_REQUEST_STATE_ERROR = 'error' as const;
/** Denied account creation */
export const ACCOUNT_REQUEST_STATE_DENIED = 'denied' as const;

export const ACCOUNT_REQUEST_STATE = {
  [ACCOUNT_REQUEST_STATE_PENDING]: 'Pendiente de confirmación',
  [ACCOUNT_REQUEST_STATE_AWAITING]: 'En espera de confirmación',
  [ACCOUNT_REQUEST_STATE_CREATED]: 'Cuenta creada',
  [ACCOUNT_REQUEST_STATE_ERROR]: 'Error',
  [ACCOUNT_REQUEST_STATE_DENIED]: 'Denegada',
} as const;

export const ATTENDANCE_STATUS_PRESENT = 'present' as const;
export const ATTENDANCE_STATUS_ABSENT = 'absent' as const;
export const ATTENDANCE_STATUS_LATE = 'late' as const;
export const ATTENDANCE_STATUS_EXCUSED = 'excused' as const;
export const ATTENDANCE_STATUS_NONE = 'none' as const;

export const ATTENDANCE_STATUS = {
  [ATTENDANCE_STATUS_PRESENT]: 'Presente',
  [ATTENDANCE_STATUS_ABSENT]: 'Ausente',
  [ATTENDANCE_STATUS_LATE]: 'Tarde',
  [ATTENDANCE_STATUS_EXCUSED]: 'Justificado',
  [ATTENDANCE_STATUS_NONE]: 'Sin asignar',
} as const;
