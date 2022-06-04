import bcrypt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
};

export const comparePasswords = async (password: string, passwordHash: string): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, passwordHash);
    return result;
  } catch (err) {
    return false;
  }
};
