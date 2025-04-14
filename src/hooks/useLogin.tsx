import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoginContextType {
  isLoginModalVisible: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
}

const UseLogin = createContext<LoginContextType>({
  isLoginModalVisible: false,
  showLoginModal: () => {},
  hideLoginModal: () => {},
});

export const useLoginModal = () => useContext(UseLogin);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const hideLoginModal = () => {
    setIsLoginModalVisible(false);
  };

  return (
    <UseLogin.Provider
      value={{
        isLoginModalVisible,
        showLoginModal,
        hideLoginModal,
      }}
    >
      {children}
    </UseLogin.Provider>
  );
};