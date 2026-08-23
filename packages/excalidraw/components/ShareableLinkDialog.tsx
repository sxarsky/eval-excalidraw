import { useRef, useState } from "react";

import { copyTextToSystemClipboard } from "../clipboard";
import { useCopyStatus } from "../hooks/useCopiedIndicator";
import { useI18n } from "../i18n";

import { Dialog } from "./Dialog";
import { FilledButton } from "./FilledButton";
import { TextField } from "./TextField";
import { copyIcon } from "./icons";

import "./ShareableLinkDialog.scss";

/**
 * Computes a SHA-256 hash of roomId + password using the Web Crypto API.
 * The plaintext password is never transmitted; only the hash is sent to
 * the server as passwordHash in the join request body.
 */
export const computePasswordHash = async (
  roomId: string,
  password: string,
): Promise<string> => {
  const data = new TextEncoder().encode(roomId + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export type ShareableLinkDialogProps = {
  link: string;
  /** Called with the computed SHA-256 passwordHash when user enables password protection */
  onPasswordSet?: (passwordHash: string | null) => void;
  onCloseRequest: () => void;
  setErrorMessage: (error: string) => void;
};

export const ShareableLinkDialog = ({
  link,
  onPasswordSet,
  onCloseRequest,
  setErrorMessage,
}: ShareableLinkDialogProps) => {
  const { t } = useI18n();
  const [, setJustCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const timerRef = useRef<number>(0);
  const ref = useRef<HTMLInputElement>(null);

  const copyRoomLink = async () => {
    try {
      await copyTextToSystemClipboard(link);
    } catch (e) {
      setErrorMessage(t("errors.copyToSystemClipboardFailed"));
    }
    setJustCopied(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setJustCopied(false);
    }, 3000);

    ref.current?.select();
  };
  const { onCopy, copyStatus } = useCopyStatus();
  return (
    <Dialog onCloseRequest={onCloseRequest} title={false} size="small">
      <div className="ShareableLinkDialog">
        <h3>Shareable link</h3>
        <div className="ShareableLinkDialog__linkRow">
          <TextField
            ref={ref}
            label="Link"
            readonly
            fullWidth
            value={link}
            selectOnRender
          />
          <FilledButton
            size="large"
            label={t("buttons.copyLink")}
            icon={copyIcon}
            status={copyStatus}
            onClick={() => {
              onCopy();
              copyRoomLink();
            }}
          />
        </div>
        {passwordEnabled && (
          <div className="ShareableLinkDialog__passwordRow">
            <TextField
              label={t("roomDialog.password_label")}
              placeholder={t("roomDialog.password_placeholder")}
              value={password}
              onChange={(value) => setPassword(value)}
            />
          </div>
        )}
        <label className="ShareableLinkDialog__passwordToggle">
          <input
            type="checkbox"
            checked={passwordEnabled}
            onChange={async (e) => {
              const enabled = e.target.checked;
              setPasswordEnabled(enabled);
              if (!enabled) {
                setPassword("");
                onPasswordSet?.(null);
              }
            }}
          />
          {t("roomDialog.password_toggle")}
        </label>
        {passwordEnabled && password && (
          <FilledButton
            size="medium"
            label={t("roomDialog.password_apply")}
            onClick={async () => {
              const roomId = link.split("/").pop() ?? link;
              const hash = await computePasswordHash(roomId, password);
              onPasswordSet?.(hash);
            }}
          >
            {t("roomDialog.password_apply")}
          </FilledButton>
        )}
        <div className="ShareableLinkDialog__description">
          🔒 {t("alerts.uploadedSecurly")}
        </div>
      </div>
    </Dialog>
  );
};
