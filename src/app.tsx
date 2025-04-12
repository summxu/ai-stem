import {Outlet} from "react-router";
import Header from './components/header';

function App() {
    return (
        <div className="istem-container">
            <Header />
            <Outlet/>
        </div>
    )
}

export default App
