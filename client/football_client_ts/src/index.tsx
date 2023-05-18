import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
    createHashRouter,
} from 'react-router-dom';
import { ErrorPage } from './page/ErrorPage';
import { Home } from './page/Home';
import { Login } from './page/Login';
import { SingUp } from './page/SingUp';
import { UserInfoUpdate } from './page/UserInfoUpdate';
import { Community } from './page/Community';
import { CommunityWrite } from './page/CommunityWrite';
import { CommunityRead } from './page/CommunityRead';
import { FootballInfo } from './page/FootballInfo';
import { FootballNews } from './page/FootballNews';
import { FootballVideo } from './page/FootballVideo';

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage errorCode='' />,
        children: [
            { index: true, element: <Home /> },
            { path: '/Login', element: <Login /> },
            { path: '/SingUp', element: <SingUp /> },
            { path: '/UserInfoUpdate', element: <UserInfoUpdate /> },
            { path: '/FootballVideo', element: <FootballVideo /> },
            { path: '/FootballNews', element: <FootballNews /> },
            { path: '/FootballInfo', element: <FootballInfo /> },
            { path: '/Community', element: <Community /> },
            { path: '/Community/CommunityWrite', element: <CommunityWrite /> },
            { path: '/Community/CommunityRead', element: <CommunityRead /> },
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<RouterProvider router={router}></RouterProvider>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
