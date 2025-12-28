import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  dir?: "rtl" | "ltr";
}

/**
 * Rich Text Editor Component using React Quill
 * 
 * Supports rich text formatting, copy-paste with styles, and RTL/LTR support
 */
const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  className,
  dir = "ltr"
}: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (dir === "rtl") {
        quill.format("direction", "rtl");
        quill.format("align", "right");
      } else {
        quill.format("direction", "ltr");
        quill.format("align", "left");
      }
    }
  }, [dir]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      // Toggle to add extra line breaks when pasting HTML
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "color",
    "background",
    "link",
    "image",
  ];

  return (
    <div className={cn("rich-text-editor-wrapper", className)} dir={dir}>
      <style>{`
        .rich-text-editor-wrapper .quill {
          background: white;
        }
        .rich-text-editor-wrapper .ql-container {
          font-family: inherit;
          font-size: 0.875rem;
          min-height: 200px;
          direction: ${dir};
        }
        .rich-text-editor-wrapper .ql-editor {
          min-height: 200px;
          direction: ${dir};
          text-align: ${dir === "rtl" ? "right" : "left"};
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
          ${dir === "rtl" ? "right: 15px; left: auto;" : "left: 15px; right: auto;"}
        }
        .rich-text-editor-wrapper .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
          background: #f9fafb;
        }
        .rich-text-editor-wrapper .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
        }
        .rich-text-editor-wrapper .ql-stroke {
          stroke: #374151;
        }
        .rich-text-editor-wrapper .ql-fill {
          fill: #374151;
        }
        .rich-text-editor-wrapper .ql-picker-label {
          color: #374151;
        }
        .rich-text-editor-wrapper .ql-editor p,
        .rich-text-editor-wrapper .ql-editor ol,
        .rich-text-editor-wrapper .ql-editor ul,
        .rich-text-editor-wrapper .ql-editor pre,
        .rich-text-editor-wrapper .ql-editor blockquote,
        .rich-text-editor-wrapper .ql-editor h1,
        .rich-text-editor-wrapper .ql-editor h2,
        .rich-text-editor-wrapper .ql-editor h3,
        .rich-text-editor-wrapper .ql-editor h4,
        .rich-text-editor-wrapper .ql-editor h5,
        .rich-text-editor-wrapper .ql-editor h6 {
          margin-bottom: 0.5rem;
        }
        .rich-text-editor-wrapper .ql-editor ol,
        .rich-text-editor-wrapper .ql-editor ul {
          padding-${dir === "rtl" ? "right" : "left"}: 1.5rem;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;

