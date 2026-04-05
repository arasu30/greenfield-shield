import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language, t as translateText } from "./i18n";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Language>(() => {
        const saved = localStorage.getItem("preferredLanguage");
        if (saved && ["en", "hi", "mr", "ta"].includes(saved)) {
            return saved as Language;
        }
        return "en";
    });

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem("preferredLanguage", newLang);
    };

    const t = (key: string) => translateText(lang, key);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
