import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

import {
    translations,
    Language,
} from "./translations";

type TranslationData = typeof translations[Language];

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: TranslationData;
}

const LanguageContext =
    createContext<LanguageContextType | undefined>(
        undefined
    );

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({
    children,
}: LanguageProviderProps) {
    const [language, setLanguage] =
        useState<Language>("EN");

    const t = translations[language];

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}