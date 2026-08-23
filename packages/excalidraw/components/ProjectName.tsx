import React, { useState } from "react";

import { focusNearestParent, KEYS } from "@excalidraw/common";

import { useExcalidrawContainer } from "./App";

import "./TextInput.scss";
import "./ProjectName.scss";

const ILLEGAL_CHARS = /[/\\:*?"<>|]/;

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  ignoreFocus?: boolean;
};

export const ProjectName = (props: Props) => {
  const { id } = useExcalidrawContainer();
  const [fileName, setFileName] = useState<string>(props.value);
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && (!fileName || ILLEGAL_CHARS.test(fileName));

  const handleBlur = (event: any) => {
    setTouched(true);
    if (!props.ignoreFocus) {
      focusNearestParent(event.target);
    }
    const value = event.target.value;
    if (value !== props.value) {
      props.onChange(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === KEYS.ENTER) {
      event.preventDefault();
      if (event.nativeEvent.isComposing || event.keyCode === 229) {
        return;
      }
      event.currentTarget.blur();
    }
  };

  return (
    <div className="ProjectName">
      <label className="ProjectName-label" htmlFor="filename">
        {`${props.label}:`}
      </label>
      <input
        type="text"
        className="TextInput"
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        id={`${id}-filename`}
        value={fileName}
        onChange={(event) => setFileName(event.target.value)}
        aria-invalid={isInvalid ? "true" : undefined}
      />
      {isInvalid && (
        <span data-testid="project-name-error">
          {!fileName
            ? "Project name is required"
            : "Project name contains invalid characters"}
        </span>
      )}
    </div>
  );
};
