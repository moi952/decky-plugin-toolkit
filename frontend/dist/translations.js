// Same 15 locales as decky-proton-launch's own i18n/locales/ (this
// package's plugin_update/other_plugins/whats_new/settings_common strings
// are extracted verbatim from its already-reviewed translations — see
// src/locales/*.json). Merge these into the consumer's own
// i18n.init({ resources }) call, e.g.:
//
//   import { pluginToolkitTranslations } from "@moi952/decky-plugin-toolkit";
//   const resources = {
//     "en-US": { ...pluginToolkitTranslations["en-US"], ...myOwnEnUS },
//     "fr-FR": { ...pluginToolkitTranslations["fr-FR"], ...myOwnFrFR },
//   };
import deDE from "./locales/de-DE.json";
import enUS from "./locales/en-US.json";
import esES from "./locales/es-ES.json";
import frFR from "./locales/fr-FR.json";
import itIT from "./locales/it-IT.json";
import jaJP from "./locales/ja-JP.json";
import koKR from "./locales/ko-KR.json";
import nlNL from "./locales/nl-NL.json";
import plPL from "./locales/pl-PL.json";
import ptBR from "./locales/pt-BR.json";
import ptPT from "./locales/pt-PT.json";
import ruRU from "./locales/ru-RU.json";
import trTR from "./locales/tr-TR.json";
import ukUA from "./locales/uk-UA.json";
import zhCN from "./locales/zh-CN.json";
export const pluginToolkitTranslations = {
    "de-DE": deDE,
    "en-US": enUS,
    "es-ES": esES,
    "fr-FR": frFR,
    "it-IT": itIT,
    "ja-JP": jaJP,
    "ko-KR": koKR,
    "nl-NL": nlNL,
    "pl-PL": plPL,
    "pt-BR": ptBR,
    "pt-PT": ptPT,
    "ru-RU": ruRU,
    "tr-TR": trTR,
    "uk-UA": ukUA,
    "zh-CN": zhCN,
};
