import { useState } from "react";

type Props = {
    defaultText: string,
    isEditing: boolean
  }

// EditableTextField is a text field that can be edited when a button is clicked. When the user clicks on the save button the text field is no longer editable and the text is saved. Displays default text when not being edited. The save button is only visible when the text field is being edited.
const EditableTextField = (props: Props) => {
    const [text, setText] = useState(props.defaultText);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    }

    return (
        <>
            {props.isEditing ? <textarea value={text} onChange={handleTextChange}></textarea> : <>{text}</>}
        </>
    );
};

export default EditableTextField;