import { useState, useRef, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  isTextArea?: boolean;
  textClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  isEditingExternal?: boolean;
  onEditingExternalClose?: () => void;
}

export default function EditableText({
  value,
  onSave,
  isTextArea = false,
  textClassName = "",
  inputClassName = "",
  placeholder = "Click to edit...",
  isEditingExternal = false,
  onEditingExternalClose,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal state if prop updates externally (e.g. backend refresh)
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Listen to triggering requests coming from the parent dropdown menu
  useEffect(() => {
    if (isEditingExternal) {
      setIsEditing(true);
      if (onEditingExternalClose) onEditingExternalClose();
    }
  }, [isEditingExternal, onEditingExternalClose]);

  // Auto-focus mechanisms
  useEffect(() => {
    if (isEditing) {
      if (isTextArea && textAreaRef.current) {
        textAreaRef.current.focus();
        const length = textAreaRef.current.value.length;
        textAreaRef.current.setSelectionRange(length, length);
      } else if (!isTextArea && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select(); // Highlight text for easy overwrite
      }
    }
  }, [isEditing, isTextArea]);

  const handleSave = async () => {
    setIsEditing(false);
    if (currentValue.trim() === "" && !isTextArea) {
      setCurrentValue(value); // Revert if title is empty
      return;
    }
    if (currentValue.trim() !== value.trim()) {
      try {
        await onSave(currentValue);
      } catch (err) {
        setCurrentValue(value); // Rollback on network failure
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isTextArea) {
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const handleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return isTextArea ? (
      <textarea
        ref={textAreaRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleTextAreaKeyDown}
        rows={2}
        className={`w-full bg-white border border-blue-500 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none ${inputClassName}`}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border-b-2 border-blue-500 focus:outline-none px-0 py-0.5 ${inputClassName}`}
      />
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="group/editable flex items-start gap-1 cursor-text select-none rounded hover:bg-gray-100/50 p-1 -m-1 transition duration-200"
    >
      <div className={`flex-1 ${textClassName}`}>
        {currentValue || (
          <span className="text-gray-400 italic">{placeholder}</span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="opacity-0 group-hover/editable:opacity-100 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition duration-150 shrink-0 self-center"
      >
        <FiEdit2 size={13} />
      </button>
    </div>
  );
}
