import { Hono } from 'hono';
// import { requireAuth, requireRole } from '../middleware/auth';
import '../types/hono';

const userRoutes = new Hono<{ Bindings: Env }>();

userRoutes.get('/profile', async (c) => {
  const user = c.get('user');
  return c.json({ success: true, data: user });
});

export default userRoutes;