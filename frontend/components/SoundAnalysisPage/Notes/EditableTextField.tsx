import { useState } from "react";

type Props = {
  defaultText: string,
  isEditing: boolean
}

/**
 * EditableTextField is a text field that can be edited. It can be used to display text or to edit text.
 * @param props - The default text to display and whether the text field is being edited or not.
 * @returns A text field we can edit.
 */
const EditableTextField = (props: Props) => {
  const [text, setText] = useState(props.defaultText);

  /**
   * Handles the text change event. It updates the text state.
   * @param event - The text change event.
   */
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }

  return (
    <>
      {props.isEditing ? <textarea value={text} onChange={handleTextChange}></textarea> : <div>{text}</div>}
    </>
  );
};

export default EditableTextField;
