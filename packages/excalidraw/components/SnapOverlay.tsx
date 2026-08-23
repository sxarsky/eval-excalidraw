import { t } from "../i18n";

import "./SnapOverlay.scss";

/**
 * Overlay shown when Shift+Alt is held during line drawing (illegal combo).
 * Renders in the DOM so it is visible to the user and assertable by Playwright.
 */
export const SnapOverlay = () => (
  <div className="SnapOverlay" data-testid="snap-overlay">
    <span>{t("hints.snapAngleIllegal")}</span>
  </div>
);
