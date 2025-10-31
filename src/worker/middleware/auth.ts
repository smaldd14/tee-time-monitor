// import { Context, Next } from 'hono';
// import { verifyToken } from '@clerk/backend';
// import { users } from '../db';
// import '../types/hono';

// export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
//   const authorization = c.req.header('Authorization');

//   if (!authorization?.startsWith('Bearer ')) {
//     return c.json({ success: false, error: 'No authorization header' }, 401);
//   }
  
//   const token = authorization.slice(7);
  
//   try {
//     const payload = await verifyToken(token, {
//       secretKey: c.env.CLERK_SECRET_KEY,
//     });
    
//     if (!payload.sub) {
//       return c.json({ success: false, error: 'Invalid token' }, 401);
//     }
    
//     // Get user from database
//     const user = await users.getUserByClerkId(c.env.DB, payload.sub);
    
//     if (!user) {
//       return c.json({ success: false, error: 'User not found' }, 404);
//     }
    
//     c.set('user', user);
//     c.set('clerkUserId', payload.sub);
    
//     await next();
//   } catch (error) {
//     console.error('Auth error:', error);
//     return c.json({ success: false, error: 'Invalid token' }, 401);
//   }
// }

// export function requireRole(role: 'contractor' | 'client' | 'admin') {
//   return async (c: Context<{ Bindings: Env }>, next: Next) => {
//     const user = c.get('user');
    
//     if (!user) {
//       return c.json({ success: false, error: 'User not authenticated' }, 401);
//     }
    
//     if (user.role !== role) {
//       return c.json({ success: false, error: `Access denied. Required role: ${role}` }, 403);
//     }
    
//     await next();
//   };
// }