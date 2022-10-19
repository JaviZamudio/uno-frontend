import React from 'react'
import '../styles/UnoButton.css'

export const UnoButton = ({ hand, turn, canPlayAnyCard, onUnoClick: handleUnoClick }) => {
    const disabled = hand.length !== 2 || !turn || !canPlayAnyCard();

    return (
        <button
            className={"uno-button" + (disabled ? " uno-disabled" : "")}
            disabled={disabled}
            onClick={handleUnoClick}
        >
            UNO
        </button>
    )
}
