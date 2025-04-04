import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './app.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/home";
import Introduce from "./pages/introduce";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Home/>}/>
                    <Route path="introduce" element={<Introduce/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
