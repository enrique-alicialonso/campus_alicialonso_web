import {
  DEPARTMENT_ID_CIRCO,
  DEPARTMENT_ID_CLASICO,
  DEPARTMENT_ID_CONTEMPORANEO,
  DEPARTMENT_ID_ESPANOL,
  DEPARTMENT_ID_GESTION,
  DEPARTMENT_ID_NONE,
  DEPARTMENT_ID_TEATRO,
  DEPARTMENT_VALUES,
  USER_ROLE_MANAGER,
  USER_ROLE_NONE,
  USER_ROLE_STUDENT,
  USER_ROLE_TEACHER,
  USER_ROLES,
} from './firestore_constants';

/**
 * Parses an unknown value into a valid department ID
 * @param value - Value to parse into a department ID
 * @returns Valid department ID or DEPARTMENT_ID_NONE if no match found
 */
export function parseDepartment(value: unknown): keyof typeof DEPARTMENT_VALUES {
  if (!value) return DEPARTMENT_ID_NONE;

  // Convert to lowercase string for comparison
  const strValue = String(value).toLowerCase().trim();

  // Direct match with department IDs
  if (strValue in DEPARTMENT_VALUES) {
    return strValue as keyof typeof DEPARTMENT_VALUES;
  }

  // Normalized string matching (remove accents, spaces, etc.)
  const normalized = strValue
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

  // Map of normalized department names to IDs
  const normalizedMap: Record<string, keyof typeof DEPARTMENT_VALUES> = {
    clasico: DEPARTMENT_ID_CLASICO,
    clasica: DEPARTMENT_ID_CLASICO,
    ballet: DEPARTMENT_ID_CLASICO,
    danzaclasica: DEPARTMENT_ID_CLASICO,

    contemporaneo: DEPARTMENT_ID_CONTEMPORANEO,
    contemporanea: DEPARTMENT_ID_CONTEMPORANEO,
    danzacontemporanea: DEPARTMENT_ID_CONTEMPORANEO,

    espanol: DEPARTMENT_ID_ESPANOL,
    espanola: DEPARTMENT_ID_ESPANOL,
    española: DEPARTMENT_ID_ESPANOL,
    danzaespanola: DEPARTMENT_ID_ESPANOL,

    teatro: DEPARTMENT_ID_TEATRO,
    danzateatro: DEPARTMENT_ID_TEATRO,

    circo: DEPARTMENT_ID_CIRCO,
    acrobatico: DEPARTMENT_ID_CIRCO,
    acrobatica: DEPARTMENT_ID_CIRCO,
    danzasacrobaticas: DEPARTMENT_ID_CIRCO,

    gestion: DEPARTMENT_ID_GESTION,
    administracion: DEPARTMENT_ID_GESTION,
    gestionyadministracion: DEPARTMENT_ID_GESTION,
  };

  return normalizedMap[normalized] || DEPARTMENT_ID_NONE;
}

/**
 * Usage examples:
 *
 * parseDepartment('clasico') // returns 'clasico'
 * parseDepartment('Danza Clásica') // returns 'clasico'
 * parseDepartment('CONTEMPORÁNEO') // returns 'contemporaneo'
 * parseDepartment('Española') // returns 'espanol'
 * parseDepartment('invalid') // returns 'none'
 * parseDepartment(null) // returns 'none'
 * parseDepartment(undefined) // returns 'none'
 */

/**
 * Determines the user role based on email pattern and admin status
 * @param primaryEmail - User's primary email address
 * @param isAdmin - Whether the user has admin privileges
 * @returns Appropriate user role constant
 *
 * Rules:
 * - If email contains numbers → STUDENT
 * - If no numbers but is admin → MANAGER
 * - If no numbers and not admin → TEACHER
 * - If invalid/empty email → NONE
 */
export function determineUserRole(
  primaryEmail: string | null | undefined,
  isAdmin: boolean | null | undefined,
): keyof typeof USER_ROLES {
  if (!primaryEmail) return USER_ROLE_NONE;

  try {
    // Clean and validate email
    const email = primaryEmail.toLowerCase().trim();
    if (!email || !email.includes('@')) return USER_ROLE_NONE;

    // Check if email contains numbers
    const hasNumbers = /\d/.test(email);

    if (hasNumbers) {
      return USER_ROLE_STUDENT;
    } else if (isAdmin) {
      return USER_ROLE_MANAGER;
    } else {
      return USER_ROLE_TEACHER;
    }
  } catch (error) {
    console.error('Error determining user role:', error);
    return USER_ROLE_NONE;
  }
}

/**
 * Usage examples:
 *
 * determineUserRole('student123@domain.com', false)  // returns 'student'
 * determineUserRole('teacher@domain.com', false)     // returns 'teacher'
 * determineUserRole('admin@domain.com', true)        // returns 'manager'
 * determineUserRole('teacher@domain.com', true)      // returns 'manager'
 * determineUserRole(null, false)                     // returns 'none'
 * determineUserRole('invalid-email', false)          // returns 'none'
 */

/**
 * Generates a unique identifier for a group document by combining group name and academic year
 * @param groupName - Name of the group
 * @param academicYear - Academic year in YY-YY format
 * @returns Serialized string to be used as document ID
 * @throws Error if unable to generate valid UID from inputs
 */
export function generateGroupUid(groupName: string, academicYear: string): string {
  if (!groupName?.trim() || !academicYear?.trim()) {
    throw new Error('Group name and academic year are required to generate UID');
  }

  // Clean and normalize the inputs
  const normalizedName = groupName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

  const normalizedYear = academicYear.trim().replace(/[^0-9-]/g, ''); // Keep only numbers and dashes

  if (!normalizedName || !normalizedYear) {
    throw new Error('Unable to generate valid UID from provided group name and academic year');
  }

  return `${normalizedName}-${normalizedYear}`;
}
