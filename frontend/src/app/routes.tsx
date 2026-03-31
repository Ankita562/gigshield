// import { createBrowserRouter, Navigate } from "react-router-dom";
// import { Home } from "./pages/Home";
// import { Forecast } from "./pages/Forecast";
// import { Payouts } from "./pages/Payouts";
// import { Policy } from "./pages/Policy";
// import { Profile } from "./pages/Profile";
// import { PremiumSelection } from "./pages/PremiumSelection";
// import { Auth } from "./pages/Auth";
// import { Login } from "./pages/Login";

// export const router = createBrowserRouter([
//   {
//     path: "/Login",
//     element: <Login />,
//   },
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/forecast",
//     element: <Forecast />,
//   },
//   {
//     path: "/payouts",
//     element: <Payouts />,
//   },
//   {
//     path: "/policy",
//     element: <Policy />,
//   },
//   {
//     path: "/profile",
//     element: <Profile />,
//   },
//   {
//     path: "/premium",
//     element: <PremiumSelection />,
//   },
//   {
//     path: "/Auth",
//     element: <Auth/>,
//   },
//   {
//     path: "/Login",
//     element: <Login />,
//   },
//   // Optional: Redirect any unknown path to login
//   {
//     path: "*",
//     element: <Navigate to="/Login" replace />,
//   },
// ]);
import AdminDashboard from './pages/AdminDashboard'; 
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Forecast } from "./pages/Forecast";
import { Payouts } from "./pages/Payouts";
import { Policy } from "./pages/Policy";
import { Profile } from "./pages/Profile";
import { PremiumSelection } from "./pages/PremiumSelection";
import { Auth,RequireAuth } from "./pages/Auth";
import { Signup } from "./pages/Signup";
import {Login} from "./pages/Login";
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/signup",
    element:<Signup/>,
  },
  {
    path: "/",
    element:(<RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: "/forecast",
    element: <Forecast />,
  },
  {
    path: "/payouts",
    element: <Payouts />,
  },
  {
    path: "/policy",
    element: <Policy />,
  },
  {
    path: "/profile",
    element: (<RequireAuth>
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: "/premium",
    element: <PremiumSelection />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  {
  path: "/admin",
  element: <AdminDashboard />,
  },
]);