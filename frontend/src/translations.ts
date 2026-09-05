// Resource bundles for this package's own components (PluginUpdateBanner/
// Section use "plugin_update", OtherPluginRow uses "other_plugins",
// WhatsNewCard uses "whats_new" for its fixed strings only — the actual
// changelog entries are per-consumer, never here). Merge these into the
// consumer's own i18n.init({ resources }) call, e.g.:
//
//   import { pluginToolkitTranslations } from "@moi952/decky-plugin-toolkit";
//   const resources = {
//     "en-US": { ...pluginToolkitTranslations["en-US"], ...myOwnEnUS },
//     "fr-FR": { ...pluginToolkitTranslations["fr-FR"], ...myOwnFrFR },
//   };
export const pluginToolkitTranslations = {
  "en-US": {
    plugin_update: {
      banner: "Plugin update available: {{version}}",
      section_label: "Plugin update",
      current: "Current version: {{version}}",
      latest: "Latest version: {{version}}",
      up_to_date: "Plugin is up to date",
      check_failed: "Couldn't check for updates right now",
      view_release: "View release",
      check_button: "Check for updates",
      checking: "Checking…",
      install_button: "Install {{version}}",
      installing: "Installing…",
      downloading: "Downloading…",
      install_failed_title: "Plugin update failed",
      no_backend: "Decky's installer isn't reachable right now.",
      install_timeout: "No response from Decky Loader — the install may have stalled. Try again.",
      choose_version_label: "Install a specific version",
      no_releases: "No releases found",
      already_installed: "Already installed ({{version}})",
    },
    other_plugins: {
      install_latest: "Install latest version",
      installing: "Installing…",
      install_failed: "Couldn't fetch the latest release. Try again later.",
      view_on_github: "View on GitHub",
    },
    whats_new: {
      older: "Older",
      newer: "Newer",
      support_note: "If you'd like to support the plugin's development, it's always welcome — see the Support section in Settings.",
    },
    // Section titles/labels for a Settings page assembled from this
    // package's pieces (see decky-proton-launch's own SettingsView.tsx,
    // the reference this wording is copied from verbatim) — always the
    // same wording, so every consumer's Settings page reads identically.
    settings_common: {
      whats_new_history: "Update history",
      github_section_title: "GitHub",
      feature_request_button: "Request a feature",
      feature_request_hint: "Scan with your phone, or press to open in your browser",
      bug_report_button: "Report a bug",
      bug_report_hint: "Scan with your phone, or press to open in your browser",
      support_section_title: "Support",
      kofi_button: "Support me on Ko-fi",
      kofi_hint: "Scan with your phone, or press to open in your browser",
      kofi_description: "This plugin is free and always will be. If you'd still like to lend a hand, every coffee helps.",
      other_plugins_section_title: "My other plugins",
    },
  },
  "fr-FR": {
    plugin_update: {
      banner: "Mise à jour du plugin disponible : {{version}}",
      section_label: "Mise à jour du plugin",
      current: "Version actuelle : {{version}}",
      latest: "Dernière version : {{version}}",
      up_to_date: "Le plugin est à jour",
      check_failed: "Impossible de vérifier les mises à jour pour l'instant",
      view_release: "Voir la release",
      check_button: "Vérifier les mises à jour",
      checking: "Vérification…",
      install_button: "Installer {{version}}",
      installing: "Installation…",
      downloading: "Téléchargement…",
      install_failed_title: "Échec de la mise à jour",
      no_backend: "L'installeur de Decky n'est pas joignable pour le moment.",
      install_timeout: "Aucune réponse de Decky Loader — l'installation a peut-être bloqué. Réessaie.",
      choose_version_label: "Installer une version spécifique",
      no_releases: "Aucune release trouvée",
      already_installed: "Déjà installé ({{version}})",
    },
    other_plugins: {
      install_latest: "Installer la dernière version",
      installing: "Installation…",
      install_failed: "Impossible de récupérer la dernière release. Réessaie plus tard.",
      view_on_github: "Voir sur GitHub",
    },
    whats_new: {
      older: "Plus ancien",
      newer: "Plus récent",
      support_note: "Si tu veux soutenir le développement du plugin, c'est toujours bienvenu — section Soutien des Réglages.",
    },
    settings_common: {
      whats_new_history: "Historique des mises à jour",
      github_section_title: "GitHub",
      feature_request_button: "Demander une fonctionnalité",
      feature_request_hint: "Scanne avec ton téléphone, ou appuie pour ouvrir dans le navigateur",
      bug_report_button: "Signaler un bug",
      bug_report_hint: "Scanne avec ton téléphone, ou appuie pour ouvrir dans le navigateur",
      support_section_title: "Soutien",
      kofi_button: "Me soutenir sur Ko-fi",
      kofi_hint: "Scanne avec ton téléphone, ou appuie pour ouvrir dans le navigateur",
      kofi_description: "Ce plugin est gratuit et le restera. Si tu veux quand même donner un coup de pouce, chaque café compte.",
      other_plugins_section_title: "Mes autres plugins",
    },
  },
} as const;
