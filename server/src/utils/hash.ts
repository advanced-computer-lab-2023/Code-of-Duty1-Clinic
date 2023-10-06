import bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, 12);

const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> =>
  bcrypt.compare(password, hashedPassword);

export { hashPassword, comparePasswords };
