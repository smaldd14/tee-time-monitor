// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { SignedIn, SignedOut } from '@clerk/clerk-react';
// import { useUserProfile } from '../hooks/useUserProfile';
// import { ForbiddenPage } from '../pages/Forbidden';
// import { Card } from './ui/card';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiresRole?: string[];
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   requiresRole
// }) => {
//   const { data: user, isLoading, error } = useUserProfile();
//   const location = useLocation();

//   return (
//     <>
//       <SignedOut>
//         <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
//       </SignedOut>
      
//       <SignedIn>
//         {isLoading ? (
//           <div className="min-h-screen flex items-center justify-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//               <p className="text-muted-foreground">Loading...</p>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="min-h-screen flex items-center justify-center">
//             <Card className="p-8 text-center max-w-md">
//               <h2 className="text-xl font-semibold mb-4">Error</h2>
//               <p className="text-muted-foreground mb-6">
//                 Unable to verify your permissions. Please try again.
//               </p>
//             </Card>
//           </div>
//         ) : requiresRole && !requiresRole.includes(user?.role || '') ? (
//           <ForbiddenPage />
//         ) : (
//           children
//         )}
//       </SignedIn>
//     </>
//   );
// };