import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Card from './components/Card';
import './styles/App.css';

const webSocketUrl = "ws://localhost:4000";

function App() {
  const [hand, setHand] = useState([]);
  const [stack, setStack] = useState({});
  const [players, setPlayers] = useState([]); // {name: string, numCards: number, turn 0 | 1 | 2}[]. turn is 0: not turn, 1: turn, 2: next turn
  const name = useRef("");
  const webSocket = useRef(new WebSocket(webSocketUrl));

  // First time loading
  useEffect(() => {
    // ask for name
    // name.current = prompt("What is your name?");
  }, []);

  webSocket.current.onopen = () => {
    console.log("Connected to server");
    // if !name send a random user name
    if (!name.current) {
      name.current = "user" + Math.floor(Math.random() * 1000);
    }
    webSocket.current.send(JSON.stringify({ event: "NAME", data: name.current }));
  };

  webSocket.current.onclose = () => {
    console.log("Disconnected from server");
  };

  webSocket.current.onmessage = ({ data: body }) => {
    const { event, data } = JSON.parse(body);
    console.log({ body });

    function handleHand(data) { // get hand and set hand state
      console.log({ hand: data });
      setHand(data);
    }

    function handleStack(data) { // get stack and set stack state
      console.log({ stack: data });
      setStack(data);
    }

    function handlePlayers(data) { // get players and set players state
      console.log({ players: data });
      setPlayers(data);
    }

    switch (event) {
      case "HAND":
        handleHand(data);
        break;
      case "STACK":
        handleStack(data);
        break;
      case "PLAYER_BOARD":
        handlePlayers(data);
        break;
      default:
        console.log("Unknown event: " + event);
    };
  };

  const myTurn = players.find(player => player.name === name.current)?.turn === 1;

  return (
    <div className="App">
      <h1>UNO</h1>

      {/* Players board. Current player hilighted. */}
      {
        players &&
        <div className="players">
          <h2>Players</h2>
          <table className="players">
            <thead>
              <tr>
                <th>Player</th>
                <th>Cards</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} className={"player" + (player.turn === 1 ? " current" : "")}>
                  <td>{player.name}</td>
                  <td>{player.numCards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

      { // Stack
        Object.keys(stack).length === 0
          ? <p>Waiting for players...</p>
          : <div className="stack">
            <h2>Stack</h2>
            <Card data={stack} />
          </div>
      }

      { // Deck
        <div className="deck">
          <h2>Deck</h2>
          <Card data={{ type: "deck" }} />
        </div>
      }

      {
        // UNO button
        <div className="UNO">
          <h2>UNO</h2>
          <button className="uno" disabled={hand.length !== 2 || !myTurn}>UNO</button>
        </div>
      }

      { // Hand
        hand.length > 0 &&
        <div className="hand">
          <h2>Hand of cards</h2>
          {
            hand.map((card, i) => {
              let disabled = (card.type !== "wild" && card.color !== stack.color && card.value !== stack.value) || !myTurn
              return <Card data={card} key={i} disabled={disabled} />
            })
          }
        </div>
      }
    </div>
  );
}

export default App;
