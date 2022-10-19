import React from 'react'
import Card from './Card';

import '../styles/Hand.css';

export const Hand = ({ cards: hand, setHand, webSocket, setTurn, stack, turn, draw }) => {
    return (
        <div className="hand">
            <h2 className='title'>My cards</h2>
            <div className="cards">
                {
                    hand.map((card, i) => {
                        let disabled = (card.type !== "wild" && card.color !== stack.color && card.value !== stack.value) || !turn || draw > 0;
                        const handleClick = (newCard) => {
                            setHand((hand) => hand.filter((_, index) => index !== i));
                            webSocket.current.send(JSON.stringify({ event: "PLAY", data: newCard || card }));
                            setTurn(false);
                        };
                        return <Card data={card} key={i} disabled={disabled} onClick={handleClick} width="150px" />
                    })
                }
            </div>
        </div>
    )
}
