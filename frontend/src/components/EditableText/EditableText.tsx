import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Icon, TextInput } from "@trussworks/react-uswds";

import "./EditableText.scss";

interface EditableTextProps {
  text: string;
  onChange: (text: string) => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  onEdit: () => void;
  isEditing: boolean;
  isError: boolean;
  errorMessage: string;
  onValidate: (text: string) => boolean | string[];
  textFormatter: (text: string) => ReactNode | string;
  dataTestId?: string;
}

export const EditableText: FC<EditableTextProps> = ({
  text,
  dataTestId,
  onChange = () => {},
  onSave = () => {},
  onEdit = () => {},
  onCancel = () => {},
  textFormatter = (text) => text,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const _onEdit = () => {
    setIsEditing(true);
    onEdit();
  };

  const _onSave = () => {
    setIsEditing(false);
    onSave(value);
  };

  const _onCancel = () => {
    setValue(text);
    setIsEditing(false);
    onCancel();
  };
  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      _onSave();
    }
    if (e.key === "Escape") {
      _onCancel();
    }
  };

  return (
    <>
      {isEditing ? (
        <TextInput
          inputRef={inputRef}
          className="margin-0 padding-0"
          type="text"
          value={value}
          onChange={_onChange}
          onBlur={_onSave}
          onKeyDown={_onKeyDown}
          id={value}
        />
      ) : (
        <div
          data-testid={dataTestId}
          className="display-flex flex-align-center hover-display-icon"
          onClick={_onEdit}
        >
          <div className="font-sans-md font-weight-semibold">
            {textFormatter(value)}
          </div>
          <div className="flex-1"></div>
          <div className="padding-left-1 padding-right-1 custom-tooltip-container display-flex flex-align-end">
            <Icon.Edit aria-hidden={true} />
          </div>
        </div>
      )}
    </>
  );
};
