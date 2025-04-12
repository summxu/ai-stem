import {Outlet} from "react-router";
import Header from './components/header';
import Footer from "./components/footer";

function App() {
    return (
        <div className="istem-container">
            <Header />
            <Outlet/>
            <Footer />
        </div>
    )
}

export default App
