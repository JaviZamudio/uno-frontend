import React from 'react'
import "../styles/PlayersBoard.css";

export const PlayersBoard = ({players, name}) => {
  return (
    <div className="players-board">
      <table className="players">
        <thead>
          <tr>
            <th>Player</th>
            <th>Cards</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index} className={"player" + (player.turn === 1 ? " current" : "") + (player.name === name.current ? " you" : "")}>
              <td>{(player.name === name.current ? "You" : player.name) + (player.turn === 2 ? " (next)" : (player.turn === 1 ? " (playing)" : ""))}</td>
              <td>{player.numCards}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

