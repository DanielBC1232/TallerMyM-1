import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar el archivo .env correspondiente según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    { idUsuario: user.idUsuario, username: user.username, email: user.email, idRol: user.idRol },
    JWT_SECRET,
    { expiresIn: '5h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export { generateToken, verifyToken, JWT_SECRET };
