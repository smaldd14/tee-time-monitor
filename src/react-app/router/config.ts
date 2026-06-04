import HomePage from '../pages/Home';
import MonitorPage from '../pages/Monitor';
import SuccessPage from '../pages/Success';
import SubscribePage from '../pages/Subscribe';
import ConnectPage from '../pages/Connect';
// import AgentPage from '../pages/Agent';
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
  {
    path: "/subscribe",
    key: "Subscribe",
    component: SubscribePage,
  },
  {
    path: "/connect",
    key: "Connect",
    component: ConnectPage,
  },
  // {
  //   path: "/agent",
  //   key: "Agent",
  //   component: AgentPage,
  // },
];

export default routes;