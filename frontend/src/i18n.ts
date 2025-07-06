import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from '../public/locales/en/common.json';
import ja from '../public/locales/ja/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: en,
      },
      ja: {
        common: ja,
      },
    },
    lng: "ja", // デフォルトの言語
    fallbackLng: "ja", // 翻訳ファイルが存在しない場合のフォールバック言語
    interpolation: {
      escapeValue: false, // XSS対策
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;