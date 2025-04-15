import { createRoot } from 'react-dom/client';
import 'ckeditor5/ckeditor5.css';
import './index.scss';
import App from './app.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/home';
import Introduce from './pages/introduce';
import { UserProvider } from './hooks/user.tsx';
import '@ant-design/v5-patch-for-react-19';
import CourseAdmin from './pages/course-admin';
import CoursePreview from './pages/course-preview';
import ActiveAdmin from './pages/active-admin';
import CourseLearning from './pages/course-learning/index.tsx';

createRoot(document.getElementById('root')!).render(
    <UserProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="course-preview" element={<CoursePreview />} />
                    <Route path="course-preview/active-admin" element={<ActiveAdmin />} />
                    <Route path="course-preview/course-admin/:activeId" element={<CourseAdmin />} />
                    <Route path="course-preview/course-learning/:courseId/:chapterId?" element={<CourseLearning />} />
                    <Route path="introduce" element={<Introduce />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </UserProvider>,
);