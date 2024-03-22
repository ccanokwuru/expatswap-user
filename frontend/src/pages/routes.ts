import { createBrowserRouter } from "react-router-dom";
import { Index } from "./Index";
import { Create } from "./Create";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/create",
    element: <Create />,
  },
]);
export default routes;
