import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Deck } from './components/Deck';
import { Hand } from './components/Hand';
import { Notifications } from './components/Notifications';
import { PlayersBoard } from './components/PlayersBoard';
import { Spinner } from './components/Spinner';
import { Stack } from './components/Stack';
import { UnoButton } from './components/UnoButton';
import './styles/App.css';

const webSocketUrl = `ws://${window.location.hostname}:4000`;

function App() {
  const [hand, setHand] = useState([]);
  const [stack, setStack] = useState({});
  const [players, setPlayers] = useState([]); // {name: string, numCards: number, turn 0 | 1 | 2}[]. turn is 0: not turn, 1: turn, 2: next turn
  const [turn, setTurn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dialog, setDialog] = useState(null); // {title: string, text: string}
  const [draw, setDraw] = useState(0);
  const name = useRef("");
  const webSocket = useRef();

  // First time loading
  useEffect(() => {
    webSocket.current = new WebSocket(webSocketUrl);
    webSocket.current.onopen = onOpen;
    webSocket.current.onmessage = onMessage;
    webSocket.current.onclose = onClose;
    // ask for name
    name.current = prompt("What is your name?");
  }, []);

  // Effect for the notifications to disappear after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      setTimeout(() => {
        setNotifications(notifications => { return notifications.slice(1) });
      }, 3000);
    }
  }, [notifications]);

  function onOpen () {
    console.log("Connected to server");
    // if !name send a random user name
    if (!name.current) {
      name.current = "user" + Math.floor(Math.random() * 1000);
    }
    webSocket.current.send(JSON.stringify({ event: "NAME", data: name.current }));
  };

  function onClose () {
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

  function onMessage ({ data: body }) {
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
      console.log({ turn: data });
      setTurn(true);
      setDialog({ title: "Your turn", text: "It's your turn" });
    }

    function handleDraw(data) { // get the cards Drawn and set the hand state
      console.log({ draw: data });
      setHand((hand) => [...data, ...hand]);
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
      case "TURN":
        handleTurn(data);
        break;
      case "DRAW":
        handleDraw(data);
        break;
      case "SKIP":
        if (data.player === name.current) {
          setDialog({ title: "Skip", text: "You have been skipped" });
        }
        break;
      case "DRAWN":
        if (data.player !== name.current) {
          setNotifications(notifications => { return [...notifications, `${data.player} drew ${data.amount} cards!`] });
        }
        break;
      case "DRAW2":
        setDraw(2);
        setDialog({ title: "Draw 2", text: "You have to draw 2 cards" });
        break;
      case "DRAW4":
        setDraw(4);
        setDialog({ title: "Draw 4", text: "You have to draw 4 cards" });
        break;
      case "REVERSE":
        setNotifications(notifications => { return [...notifications, `The direction was reversed!`] });
        break;
      case "WINNER":
        const myDialog = {title: "Winner", text: `${data.player} won!`};

        if (data.player === name.current) {
          myDialog.text = "You won!";
        }

        setDialog(myDialog);
        break;
      case "UNO_PENALTY":
        setDialog({ title: "Uno Penalty", text: "You didn't say uno!" });
        setDraw(2);
        break;
      case "UNO":
        if (data.player !== name.current) {
          setNotifications(notifications => { return [...notifications, `${data.player} said uno!`] });
        }
        break;
      default:
        console.log("Unknown event: " + event);
    };
  };

  function handleDeckClick() {
    if (draw === 0) {
      webSocket.current.send(JSON.stringify({ event: "DRAW" }));
    }
    if (draw > 0) {
      webSocket.current.send(JSON.stringify({ event: "DRAW" + draw }));
    }

    // set toDraw to 0
    setDraw(0);
  }

  function handleUnoClick() {
    webSocket.current.send(JSON.stringify({ event: "UNO" }));
  }

  return (
    <div className="App">
      {/* Header */}
      <div className="header">
        <h1 className="uno-title">UNO</h1>
        {
          players.length > 0 &&
          <PlayersBoard players={players} name={name} />
        }
      </div>

      {/* Waiting for players */}
      {
        players.length === 0 &&
        <div className="waiting-for-players">
          <h2>Waiting for players...</h2>
          <Spinner size={70} />
        </div>
      }

      { // Table
        players.length > 0 &&
        <div className="table">
          <Deck onClick={handleDeckClick} draw={draw} canPlayAnyCard={canPlayAnyCard} handleClick={handleDeckClick} turn={turn} />
          <Stack stack={stack} />
        </div>
      }

      { // UNO Button
        players.length > 0 &&
        <UnoButton canPlayAnyCard={canPlayAnyCard} hand={hand} onUnoClick={handleUnoClick} turn={turn} />
      }

      { // Hand
        hand.length > 0 &&
        <Hand cards={hand} draw={draw} setHand={setHand} webSocket={webSocket} stack={stack} turn={turn} setTurn={setTurn} />
      }

      { // Notification
        notifications.length > 0 &&
        <Notifications notifications={notifications} />
      }

      { // Dialog
        dialog &&
        <Dialog open={dialog !== null} onClose={() => setDialog(null)}>
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialog.text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(null)} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  );
}

export default App;