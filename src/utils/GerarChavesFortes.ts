import bcrypt from 'bcryptjs';

export function generateRandomString(length: number): string {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(String(process.env.SECRET_JWT), salt);
  return hash.slice(0, length);
}