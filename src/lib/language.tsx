import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "hi";

export const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
];

const STORAGE_KEY = "fayno-language";

const dictionary = {
  en: {
    settings: "Settings",
    settingsIntro: "Manage your account, language and support options.",
    appearance: "Appearance",
    appearanceHint: "Choose a light or dark look for FAYNO.",
    theme: "Theme",
    language: "App language",
    languageHint: "FAYNO currently supports English and Hindi. English is the default.",
    inviteTitle: "Invite a friend",
    inviteHint: "Share FAYNO so more families can preserve their history.",
    copyLink: "Copy invite link",
    copied: "Invite link copied.",
    share: "Share",
    helpTitle: "Help & feedback",
    helpHint: "Questions, ideas or a problem? Write to us and we'll reply by email.",
    emailUs: "Email us",
    account: "Account",
    logout: "Log out",
    logoutHint: "You'll need your email and password to sign back in.",
    deleteAccount: "Delete account",
    deleteHint: "This permanently removes your profile, family records and photos.",
    deleteConfirmTitle: "Delete your FAYNO account?",
    deleteConfirmBody:
      "This cannot be undone. All your family records, photos and your profile will be permanently deleted.",
    cancel: "Cancel",
    deleteForever: "Delete forever",
    deleted: "Your account has been deleted.",
    deleteFailed: "We couldn't delete your account. Please try again.",
  },
  hi: {
    settings: "सेटिंग्स",
    settingsIntro: "अपना खाता, भाषा और सहायता विकल्प प्रबंधित करें।",
    appearance: "रूप",
    appearanceHint: "FAYNO के लिए हल्का या गहरा रूप चुनें।",
    theme: "थीम",
    language: "ऐप भाषा",
    languageHint: "FAYNO अभी अंग्रेज़ी और हिन्दी का समर्थन करता है। अंग्रेज़ी डिफ़ॉल्ट है।",
    inviteTitle: "मित्र को आमंत्रित करें",
    inviteHint: "FAYNO साझा करें ताकि और परिवार अपना इतिहास सहेज सकें।",
    copyLink: "आमंत्रण लिंक कॉपी करें",
    copied: "आमंत्रण लिंक कॉपी हो गया।",
    share: "साझा करें",
    helpTitle: "सहायता और फ़ीडबैक",
    helpHint: "कोई प्रश्न, सुझाव या समस्या? हमें लिखें, हम ईमेल से उत्तर देंगे।",
    emailUs: "हमें ईमेल करें",
    account: "खाता",
    logout: "लॉग आउट",
    logoutHint: "दोबारा साइन इन करने के लिए ईमेल और पासवर्ड चाहिए होगा।",
    deleteAccount: "खाता हटाएं",
    deleteHint: "इससे आपकी प्रोफ़ाइल, परिवार रिकॉर्ड और तस्वीरें हमेशा के लिए हट जाएंगी।",
    deleteConfirmTitle: "अपना FAYNO खाता हटाएं?",
    deleteConfirmBody:
      "यह पूर्ववत नहीं किया जा सकता। आपके सभी परिवार रिकॉर्ड, तस्वीरें और प्रोफ़ाइल स्थायी रूप से हट जाएंगे।",
    cancel: "रद्द करें",
    deleteForever: "हमेशा के लिए हटाएं",
    deleted: "आपका खाता हटा दिया गया है।",
    deleteFailed: "हम आपका खाता नहीं हटा सके। कृपया पुनः प्रयास करें।",
  },
} as const;

export type TranslationKey = keyof (typeof dictionary)["en"];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "hi") setLanguageState(stored);
    } catch {
      // storage may be blocked
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage may be blocked
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionary[language][key] ?? dictionary.en[key],
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
