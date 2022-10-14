import React, { useRef } from 'react'

const Card = ({ data, disabled, onClick: handleClick }) => {
  const colorModal = useRef(null);
  let cardName = data.type === "number" || data.type === "action" ? data.color[0].toUpperCase() + "_" + data.value[0].toUpperCase() + ".png" : (data.value === "wild" ? "W.png" : "W+4.png");

  if (data.type === "deck") {
    cardName = "UNO_back.png";
  }

  const handleWildClick = () => {
    colorModal.current.style.display = "block";
  }

  const handleColor = (color) => {
    colorModal.current.style.display = "none";
    data.color = color;
    handleClick(data);
  }

  return (
    <div className={"card" + (disabled ? " disabled" : "")} onClick={disabled ? null : (data.type === "wild" ? handleWildClick : () => handleClick && handleClick(data))}>
      { // color selection modal
        data.type === "wild" &&
        <div className="color-selection" ref={colorModal} style={{ display: "none" }}>
          <button className="color-red" onClick={() => handleColor("red")}>RED</button>
          <button className="color-blue" onClick={() => handleColor("blue")}>BLUE</button>
          <button className="color-green" onClick={() => handleColor("green")}>GREEN</button>
          <button className="color-yellow" onClick={() => handleColor("yellow")}>YELLOW</button>
        </div>
      }
      {/* {JSON.stringify(data)} */}
      <img src={require(`../images/cards/${cardName}`)} alt={cardName} />
      {disabled && "Disabled"}
    </div>
  )
}

export default Card