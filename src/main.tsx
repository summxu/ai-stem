import {createRoot} from 'react-dom/client'
import 'ckeditor5/ckeditor5.css';
import './index.scss'
import App from './app.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/home";
import Introduce from "./pages/introduce";
import {UserProvider} from "./hooks/user.tsx";
import '@ant-design/v5-patch-for-react-19';
import CourseAdmin from './pages/course-admin';

createRoot(document.getElementById('root')!).render(
    <UserProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Home/>}/>
                    <Route path="introduce" element={<Introduce/>}/>
                    <Route path="course-admin" element={<CourseAdmin/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </UserProvider>
)