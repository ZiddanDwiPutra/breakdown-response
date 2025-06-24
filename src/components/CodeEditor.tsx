import { CodeiumEditor, type CodeiumEditorProps } from "@codeium/react-code-editor";

export default function CodeEditor(props: CodeiumEditorProps) {

  return (
    <CodeiumEditor theme="vs-light" {...props} value={String(props.value || '')} language={props.language || "json"}/>
  )
}