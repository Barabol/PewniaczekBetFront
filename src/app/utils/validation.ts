export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Hasło musi mieć minimum 8 znaków');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Hasło musi zawierać wielką literę');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Hasło musi zawierać małą literę');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Hasło musi zawierać cyfrę');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateStake(stake: number, minStake: number = 1, maxStake: number = 10000): {
  isValid: boolean;
  error?: string;
} {
  if (stake < minStake) {
    return { isValid: false, error: `Minimalna stawka to ${minStake} PLN` };
  }

  if (stake > maxStake) {
    return { isValid: false, error: `Maksymalna stawka to ${maxStake} PLN` };
  }

  return { isValid: true };
}
