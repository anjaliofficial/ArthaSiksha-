import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillWrapper = forwardRef((props, ref) => {
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => quillRef.current?.focus(),
    getEditor: () => quillRef.current?.getEditor(),
  }));

  return <ReactQuill ref={quillRef} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
