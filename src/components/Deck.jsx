import React from 'react'
import Card from './Card';

export const Deck = ({ turn, canPlayAnyCard, draw, handleClick }) => {
    // disabled if draw === 0, canPlayAnyCard() === false or turn === false
    const disabled = (!turn || canPlayAnyCard()) && draw === 0;

    return <div className="deck">
        <h2>Deck</h2>
        {((!disabled && turn) || draw > 0) && <p>Click to draw {draw > 0 ? draw + " cards" : "a card"}</p>}

        <Card data={{ type: "deck" }} disabled={disabled} onClick={handleClick} />
    </div>
}
