const Dossier = (props: any) => {
    const onClickHandler = (event: any) => {
        if (event.nativeEvent.button === 0) {
            console.log("Left click!");
            props.selectedDossier(props.id);
        } else if (event.nativeEvent.button === 2) {
            console.log("Right click!");
        }
    }

    return (
        <p onClick={onClickHandler}>
            {props.name}
        </p>
    );
}

export default Dossier;