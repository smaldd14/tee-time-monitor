import { User } from '@/types'

declare module 'hono' {
  interface ContextVariableMap {
    user: User;
    clerkUserId: string;
  }
}