import React, { useState } from 'react'
import ColorModal from './ColorModal';

// const Card = ({ data, disabled, onClick: handleClick, width }) => {
//   const colorModalRef = useRef(null);
//   let cardName = data.type === "number" || data.type === "action" ? data.color[0].toUpperCase() + "_" + data.value[0].toUpperCase() + ".png" : (data.value === "wild" ? "W.png" : "W+4.png");

//   if (data.type === "deck") {
//     cardName = "UNO_back.png";
//   }

//   const handleWildClick = () => {
//     colorModalRef.current.style.display = "block";
//   }

//   const handleColor = (color) => {
//     colorModalRef.current.style.display = "none";
//     data.color = color;
//     handleClick(data);
//   }

//   return (
//     <div className={"card" + (disabled ? " disabled" : "")} onClick={disabled ? null : (data.type === "wild" ? handleWildClick : () => handleClick && handleClick(data))} >
//       { // color selection modal
//         data.type === "wild" &&
//         <ColorModal onClick={handleColor} compRef={colorModalRef} />
//       }

//       <img src={require(`../images/cards/${cardName}`)} alt={cardName} style={{ width: width || "12rem" }}/>
//     </div>
//   )
// }

function Card({ data: card, disabled, onClick, width }) {
    const [modalVisible, setModalVisible] = useState(false);

    // Get the card name
    const cardName = card.type === "deck" ?
        "UNO_back.png" :
        card.type === "wild" ?
            (card.value === "wild" ? "W.png" : "W+4.png") :
            card.color[0].toUpperCase() + "_" + card.value[0].toUpperCase() + ".png";

    const handleClick = (card) => {
        if (card.type === "wild") {
            setModalVisible(true);
        } else {
            onClick(card);
        }
    }

    const handleColorSelection = (color) => {
        setModalVisible(false);
        onClick({ ...card, color });
    }

    return (
        <>
            <ColorModal visible={modalVisible} onClose={() => setModalVisible(false)} onColorSelection={handleColorSelection} />

            <div
                className={"card" + (disabled ? " disabled" : "")}
                onClick={disabled ? null : () => { handleClick(card) }}
            >
                <img src={require(`../images/cards/${cardName}`)} alt={cardName} style={{ width: width || "12rem" }} />
            </div>
        </>
    );
}

export default Card;