import { createContext, useContext, useState } from "react";

type GlobalContextType = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const GlobalContext = createContext<GlobalContextType | null>(null);

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <GlobalContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
