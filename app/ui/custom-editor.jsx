import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "@/ckeditor5";

export default function CustomEditor({
  name,
  prepareData,
  initialdata,
  parent,
}) {
  return (
    <>
      <CKEditor
        data={initialdata}
        editor={Editor}
        onChange={(event, editor) => {
          const data = editor.getData();
          prepareData("", parent, data, name);
        }}
      />
    </>
  );
}
