import { actionClearCanvas } from "../actions";
import { atom, useAtom } from "../editor-jotai";
import { t } from "../i18n";

import { useApp, useExcalidrawActionManager } from "./App";
import ConfirmDialog from "./ConfirmDialog";

export const activeConfirmDialogAtom = atom<
  "clearCanvas" | "removeAllLibrary" | null
>(null);

export const ActiveConfirmDialog = () => {
  const [activeConfirmDialog, setActiveConfirmDialog] = useAtom(
    activeConfirmDialogAtom,
  );
  const actionManager = useExcalidrawActionManager();
  const app = useApp();

  if (!activeConfirmDialog) {
    return null;
  }

  if (activeConfirmDialog === "clearCanvas") {
    return (
      <ConfirmDialog
        onConfirm={() => {
          actionManager.executeAction(actionClearCanvas);
          setActiveConfirmDialog(null);
        }}
        onCancel={() => setActiveConfirmDialog(null)}
        title={t("clearCanvasDialog.title")}
      >
        <p className="clear-canvas__content"> {t("alerts.clearReset")}</p>
      </ConfirmDialog>
    );
  }

  if (activeConfirmDialog === "removeAllLibrary") {
    return (
      <ConfirmDialog
        onConfirm={() => {
          app.library.setLibrary([]);
          setActiveConfirmDialog(null);
        }}
        onCancel={() => setActiveConfirmDialog(null)}
        title={t("confirmDialog.resetLibrary")}
      >
        <p>{t("alerts.resetLibrary")}</p>
      </ConfirmDialog>
    );
  }

  return null;
};
