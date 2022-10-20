import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

function ColorModal({ visible: modalVisible, onClose, onColorSelection }) {
    const [color, setColor] = useState("");

    const handleClose = () => {
        onClose();
        setColor("");
    }

    /**
     * Function to handle color selection and submit of the modal
     * @param {string} color 
     */
    const handleColorSelection = (color) => {
        onColorSelection(color);
        handleClose();
    }

    const handleColorButtonClick = (color) => {
        setColor(color);
    }

    return (
        <Dialog open={modalVisible} onClose={handleClose}>
            <DialogTitle>Choose a color</DialogTitle>
            <DialogContent>
                <ButtonGroup variant="outlined" color="inherit">
                    <Button
                        onClick={() => handleColorButtonClick("red")}
                        style={color === "red" ? { backgroundColor: "red", color: "white", borderColor: "black" } : {}}
                    >
                        Red
                    </Button>
                    <Button
                        onClick={() => handleColorButtonClick("blue")}
                        style={color === "blue" ? { backgroundColor: "blue", color: "white", borderColor: "black" } : {}}
                    >
                        Blue
                    </Button>
                    <Button
                        onClick={() => handleColorButtonClick("green")}
                        style={color === "green" ? { backgroundColor: "green", color: "white", borderColor: "black" } : {}}
                    >
                        Green
                    </Button>
                    <Button
                        onClick={() => handleColorButtonClick("yellow")}
                        style={color === "yellow" ? { backgroundColor: "yellow", color: "black", borderColor: "black" } : {}}
                    >
                        Yellow
                    </Button>
                </ButtonGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleColorSelection(color)} disabled={!color}>Accept</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ColorModal;