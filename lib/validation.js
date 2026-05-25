export const validateEmail = (email) => {
  // Robust regex: at least 5 characters before @ + domain + . + at least 2 char TLD
  const emailRegex = /^[a-zA-Z0-9._%+-]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) {
    if (email.includes('@') && email.split('@')[0].length < 5) {
      return "Email prefix must be at least 5 characters";
    }
    return "Invalid email format";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must contain at least one special character";
  return null;
};

export const validateName = (name) => {
  if (!name) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};
