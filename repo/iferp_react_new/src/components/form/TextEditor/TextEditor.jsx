import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { cloneDeep } from "lodash";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import FilePreview from "components/Layout/FilePreview";
import { trimLeftSpace } from "utils/helpers";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./TextEditor.scss";
import Label from "../Label";

const TextEditor = ({
  placeholder,
  id,
  onChange,
  value,
  error,
  height,
  images = [],
  files = [],
  onRemoveImage,
  onRemoveFile,
  readOnly,
  label,
  isRequired,
  labelClass,
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onChangeEditor = (newState) => {
    const currentContentState = editorState.getCurrentContent();
    const newContentState = newState.getCurrentContent();
    setEditorState(newState);
    if (currentContentState !== newContentState) {
      let val = draftToHtml(convertToRaw(newContentState));
      val = val
        .replace("<p></p>", "")
        .replace("<ul><li></li></ul>", "")
        .replace("<ol><li></li></ol>", "");
      onChange({
        target: {
          id: id,
          value: trimLeftSpace(val),
        },
      });
    }
  };

  useEffect(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!value) {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);
  return (
    <div
      id="text-editor-container"
      className={
        images.length > 0 || files.length > 0 || error ? "border-bottom-0" : ""
      }
    >
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <Editor
        readOnly={readOnly}
        placeholder={placeholder}
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onChangeEditor}
        editorStyle={{ minHeight: height || "100px" }}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "list",
            "textAlign",
            "colorPicker",
            "history",
            "emoji",
          ],
          inline: {
            options: ["bold", "italic", "underline"],
          },
          list: { options: ["unordered", "ordered"] },
        }}
      />
      {(images.length > 0 || files.length > 0) && (
        <div
          style={{ border: `1px solid var(--american-silver)` }}
          className={`border-top-0 d-flex ps-2 pb-2 gap-3`}
        >
          {images.map((elm, index) => {
            return (
              <React.Fragment key={index}>
                <FilePreview
                  url={elm}
                  onRemove={
                    onRemoveImage
                      ? () => {
                          const oldData = cloneDeep(images);
                          onRemoveImage(oldData.filter((e, i) => i !== index));
                        }
                      : null
                  }
                />
              </React.Fragment>
            );
          })}
          {files.map((elm, index) => {
            return (
              <React.Fragment key={index}>
                <FilePreview
                  url={elm}
                  onRemove={
                    onRemoveFile
                      ? () => {
                          const oldData = cloneDeep(files);
                          onRemoveFile(oldData.filter((e, i) => i !== index));
                        }
                      : null
                  }
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {error && (
        <div className="text-13-400 pt-1 w-100 border-top">
          <span style={{ color: "red" }}>{error}</span>
        </div>
      )}
    </div>
  );
};
export default TextEditor;
