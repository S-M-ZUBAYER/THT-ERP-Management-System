import { createBrowserRouter } from "react-router-dom";
import Main from "../component/Main/Main";
import ErrorPage from "../component/ErrorPage/ErrorPage";
import PrivateRoute from "../component/PrivateRoute/PrivateRoute";
import Translator from "../component/Translator/Translator";
import LogIn from "../component/LogIn/LogIn";



export const Routes = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <PrivateRoute><Translator></Translator></PrivateRoute>
            },
            {
                path: "/logIn",
                element: <LogIn></LogIn>
            }

        ]
    },

]
)


