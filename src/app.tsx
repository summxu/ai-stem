import {Outlet} from "react-router";
import Header from './components/header';
import Footer from "./components/footer";
import LoginModal from "./components/login-modal";
import { LoginProvider, useLoginModal } from "./hooks/useLogin.tsx";
import { LanguageProvider } from "./hooks/useLanguage";

function AppContent() {
    const { isLoginModalVisible, hideLoginModal } = useLoginModal();
    
    return (
        <div className="istem-container">
            <Header />
            <Outlet/>
            <Footer />
            <LoginModal visible={isLoginModalVisible} onClose={hideLoginModal} />
        </div>
    )
}

function App() {
    return (
        <LoginProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </LoginProvider>
    )
}

export default App
