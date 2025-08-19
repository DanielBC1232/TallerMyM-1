import { verifyToken } from '../services/jwtUtils.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
};

export default authMiddleware;
