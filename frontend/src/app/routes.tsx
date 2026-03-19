import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Forecast } from "./pages/Forecast";
import { Payouts } from "./pages/Payouts";
import { Policy } from "./pages/Policy";
import { Profile } from "./pages/Profile";
import { PremiumSelection } from "./pages/PremiumSelection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
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
    element: <Profile />,
  },
  {
    path: "/premium",
    element:<PremiumSelection />,
  },
]);