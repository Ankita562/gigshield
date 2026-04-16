import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import { Home } from "./pages/Home";
import { Forecast } from "./pages/Forecast";
import { Payouts } from "./pages/Payouts";
import { Policy } from "./pages/Policy";
import { Profile } from "./pages/Profile";
import { PremiumSelection } from "./pages/PremiumSelection";
import { Auth } from "./pages/Auth";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Help } from "./pages/Help";
import { Claims } from "./pages/Claims";
import { ProtectedRoute } from "./ProtectedRoute";
import { IdentityVerification } from "./pages/IdentityVerification";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/premium",
    element: (
      <ProtectedRoute>
        <PremiumSelection />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
  path: "/verify-identity",
  element: (
    <ProtectedRoute>
      <IdentityVerification />
    </ProtectedRoute>
  ),
},
  {
    path: "/claims",
    element: (
      <ProtectedRoute>
        <Claims />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/policy",
    element: (
      <ProtectedRoute>
        <Policy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forecast",
    element: (
      <ProtectedRoute>
        <Forecast />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payouts",
    element: (
      <ProtectedRoute>
        <Payouts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/help",
    element: (
      <ProtectedRoute>
        <Help />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);