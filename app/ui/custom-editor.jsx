import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "@/ckeditor5";

export default function CustomEditor({ name, prepareData, initialdata }) {
  return (
    <>
      <CKEditor
        data={initialdata}
        editor={Editor}
        onChange={(event, editor) => {
          const data = editor.getData();
          prepareData("", data, name);
        }}
      />
    </>
  );
}
