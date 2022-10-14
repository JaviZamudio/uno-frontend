import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Card from './components/Card';
import { PlayersBoard } from './components/PlayersBoard';
import './styles/App.css';

const webSocketUrl = "ws://localhost:4000";

function App() {
  const [hand, setHand] = useState([]);
  const [stack, setStack] = useState({});
  const [players, setPlayers] = useState([]); // {name: string, numCards: number, turn 0 | 1 | 2}[]. turn is 0: not turn, 1: turn, 2: next turn
  const [turn, setTurn] = useState(false);
  const [draw, setDraw] = useState(0);
  const name = useRef("");
  const webSocket = useRef(new WebSocket(webSocketUrl));

  // First time loading
  useEffect(() => {
    // ask for name
    // name.current = prompt("What is your name?");
    // TODO: remove this:
    setPlayers([
      { name: "Player 1", numCards: 7, turn: 0 },
      { name: "Player 2", numCards: 7, turn: 1 },
      { name: "Player 3", numCards: 7, turn: 2 },
      { name: "Player 4", numCards: 7, turn: 0 },
    ]);
    name.current = "Player 3";
    setHand([
      { type: "number", color: "red", value: "1" },
      { type: "number", color: "yellow", value: "2" },
      { type: "number", color: "green", value: "3" },
      { type: "number", color: "blue", value: "4" },
      { type: "action", color: "red", value: "draw2" },
      { type: "wild", color: "-", value: "wild" },
      { type: "wild", color: "-", value: "wild" },
    ]);
    setStack({ type: "number", color: "red", value: "1" });
    setTurn(true);
    setDraw(0);
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

  function canPlayAnyCard() {
    return hand.some((card) => {
      if (card.type === "wild" || card.value === stack.value || card.color === stack.color) {
        return true;
      }
      return false;
    });
  }

  webSocket.current.onmessage = ({ data: body }) => {
    const { event, data } = JSON.parse(body);
    console.log(body);

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

    function handleTurn() { // get turn and set turn state
      alert("Your turn");
      setTurn(true);
    }

    function handleDraw(data) { // get the cards Drawn and set the hand state
      console.log({ draw: data });
      setHand((hand) => [...data, ...hand]);
    }

    // TODO: handle WINNER, UNO_PENALTY, UNO
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
      case "TURN":
        handleTurn(data);
        break;
      case "DRAW":
        handleDraw(data);
        break;
      case "SKIP":
        if (data.player === name.current) {
          alert("You have been skipped");
        }
        break;
      case "DRAWN":
        if (data.player !== name.current) {
          console.log(data);
        }
        break;
      case "DRAW2":
        setDraw(2);
        alert("Draw 2 cards");
        break;
      case "DRAW4":
        setDraw(4);
        alert("Draw 4 cards");
        break;
      case "REVERSE":
        alert("The order has been reversed");
        break;
      case "WINNER":
        if (data.player === name.current) {
          alert("You won!");
        }
        else {
          alert(`${data.player} won!`);
        }
        break;
      case "UNO_PENALTY":
        alert("You have been penalized for not saying UNO, draw 2 cards");
        setDraw(2);
        break;
      default:
        console.log("Unknown event: " + event);
    };
  };

  return (
    <div className="App">
      <h1 className="uno-title">UNO</h1>

      {/* Players board. Current player hilighted. */}
      {
        players.length > 0 &&
        <PlayersBoard players={players} name={name} />
      }

      { // Stack
        players.length > 0
          ? <div className="stack">
            <h2>Stack</h2>
            {stack.type === "wild" ? <h2>Color: {stack.color}</h2> : null}
            <Card data={stack} />
          </div>
          : <p>Waiting for players...</p>
      }

      { // Deck
        (() => {
          // disabled if draw === 0, canPlayAnyCard() === false or turn === false
          const disabled = (!turn || canPlayAnyCard()) && draw === 0;
          function handleClick() {
            if (draw === 0) {
              webSocket.current.send(JSON.stringify({ event: "DRAW" }));
            }
            if (draw > 0) {
              webSocket.current.send(JSON.stringify({ event: "DRAW" + draw }));
            }

            // set toDraw to 0
            setDraw(0);
          }
          return <div className="deck">
            <h2>Deck</h2>
            {((!disabled && turn) || draw > 0) && <p>Click to draw {draw > 0 ? draw + " cards" : "a card"}</p>}

            <Card data={{ type: "deck" }} disabled={disabled} onClick={handleClick} />
          </div>
        })()
      }

      {
        // TODO: disable if cant play any card
        // UNO button
        <div className="UNO">
          <h2>UNO</h2>
          <button className="uno" disabled={hand.length !== 2 || !turn}>UNO</button>
        </div>
      }

      { // Hand
        hand.length > 0 &&
        <div className="hand">
          <h2>Hand of cards</h2>
          {
            hand.map((card, i) => {
              let disabled = (card.type !== "wild" && card.color !== stack.color && card.value !== stack.value) || !turn || draw > 0;
              const handleClick = (newCard) => {
                setHand((hand) => hand.filter((_, index) => index !== i));
                webSocket.current.send(JSON.stringify({ event: "PLAY", data: newCard || card }));
                setTurn(false);
              };
              return <Card data={card} key={i} disabled={disabled} onClick={handleClick} />
            })
          }
        </div>
      }
    </div>
  );
}

export default App;