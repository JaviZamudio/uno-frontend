import React from 'react'

const Card = ({data, disabled, onClick: handleClick}) => {
  const color = data.color;
  const value = data.value;
  const type = data.type;
  let cardName = type === "number" || type === "action" ? color[0].toUpperCase() + "_" + value[0].toUpperCase() + ".png" : (value === "wild" ? "W.png" : "W+4.png");

  if (type === "deck") {
    cardName = "UNO_back.png";
  }
  return (
    <div className={ "card" + (disabled ? " disabled" : "") } onClick={!disabled ? handleClick : null}>
      {/* {JSON.stringify(data)} */}
      <img src={require(`../images/cards/${cardName}`)} alt={cardName} />
      {disabled && "Disabled"}
    </div>
  )
}

export default Card