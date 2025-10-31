import HomePage from '../pages/Home';
import MonitorPage from '../pages/Monitor';
import SuccessPage from '../pages/Success';
import { ComponentType } from 'react';

export type RouteType = {
  path?: string;
  key: string;
  component: ComponentType<object>;
  children?: RouteType[];
  index?: boolean;
  props?: Record<string, object>;
  requiresAuth?: boolean;
  requiresRole?: string[];
};

export type RoutesConfig = RouteType[];

const routes: RoutesConfig = [
  // Public routes
  {
    path: "/",
    key: "Home",
    component: HomePage,
    index: true,
  },
  {
    path: "/monitor",
    key: "Monitor",
    component: MonitorPage,
  },
  {
    path: "/success",
    key: "Success",
    component: SuccessPage,
  },
];

export default routes;