/** Keep in sync with osstel-backend `src/config/limits.js`. */
export const LIMITS = {
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 72,
  USER_ID_MAX: 20,
} as const;

export function passwordLengthHint() {
  return `${LIMITS.PASSWORD_MIN}-${LIMITS.PASSWORD_MAX} characters`;
}
