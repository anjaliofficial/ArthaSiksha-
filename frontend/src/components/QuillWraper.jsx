import React, { useRef, useImperativeHandle, forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * A wrapper component for ReactQuill that uses React's forwardRef and
 * useImperativeHandle to expose the internal editor instance.
 * This is the modern pattern to avoid the 'findDOMNode is deprecated' warning.
 */
const QuillWrapper = forwardRef(
  (
    {
      value,
      onChange,
      onFocus,
      onBlur,
      modules,
      formats,
      placeholder,
      ...restProps
    },
    ref
  ) => {
    // Internal ref to hold the ReactQuill component instance
    const quillRef = useRef(null);

    // Use useImperativeHandle to customize the instance value that is exposed
    // to parent components via their ref
    useImperativeHandle(ref, () => ({
      // Expose the Quill editor instance itself
      getEditor: () => (quillRef.current ? quillRef.current.getEditor() : null),
      // Expose the focus function for convenience
      focus: () => quillRef.current && quillRef.current.focus(),
    }));

    return (
      <ReactQuill
        ref={quillRef} // Assign the internal ref to the ReactQuill component
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        {...restProps} // Pass any other props
      />
    );
  }
);

// Set display name for better debugging
QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
