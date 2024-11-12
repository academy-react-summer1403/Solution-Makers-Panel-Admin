import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./index.css";

function TextEditor({ value, valueTitle, setValue }) {
  return (
    <CKEditor
      config={{
        language: {
          ui: "en",
          content: "fa",
        },
      }}
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        setValue(valueTitle, data);
      }}
    />
  );
}

export default TextEditor;
