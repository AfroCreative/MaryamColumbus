export type Theme = "light" | "dark";

/** localStorage key holding the visitor's explicit choice, if any. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint so a saved choice applies without a
 * flash of the other theme. With no saved choice the CSS follows the
 * system setting.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
