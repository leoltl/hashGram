import React, { useEffect, useReducer, useState } from 'react';

import ChatBox from './components/ChatBox';
import ChatList from './components/ChatList';

var chatws;

function reducer(state, action) {
  switch(action.type) {
    case 'setHistory':
      return {...state, [action.payload.from]: action.payload.history}
    case 'newMessage':
      return {...state, [action.payload.from]: [action.payload.message, ...state[action.payload.from]]}
    default:
      return state;
  }
}

function App({ online, selected, setSelected, body, setBody, chats, messages, focusChatBox, setFocusChatBox, handleSubmit}) {
  return (
    <div className="app">
      <div className="app__status-bar">
        Status: {online ? "online" : 'offline'}
      </div>
      <div className="chatapp__main-container">
        <ChatList
          chats={chats}
          selected={selected}
          setSelected={setSelected}
          focusChatBox={focusChatBox}
          setFocusChatBox={setFocusChatBox}
        />
        <ChatBox 
          body={body}
          selected={selected}
          setBody={setBody}
          messages={messages[selected]}
          focusChatBox={focusChatBox}
          setFocusChatBox={setFocusChatBox}
          handleSubmit={handleSubmit}
        />
      </div>
    </div> 
  );
}

function AppContainer() {
  const [online, setOnline] = useState(false);
  const [focusChatBox, setFocusChatBox] = useState(false);
  const [selected, setSelected] = useState(null);
  const [body, setBody] = useState('');
  const [chats, setChats] = useState([]) 
  const [messages, dispatch] = useReducer(reducer, {});


  useEffect(() => {
    (function(){
      
      fetch('/api/chats')
        .then(res => res.json())
        .then(chats => setChats(chats));
      
      chatws = new WebSocket("ws://localhost:3000/chat")
      chatws.onmessage = (msg) => {
        const message = JSON.parse(msg.data);
        if (message.type === 'loopback') {
          return dispatch({ type: 'newMessage', payload: { from: message.to, message }});
        }
        if (message.type === 'newMessage') {
          return dispatch({ type: 'newMessage', payload: { from: message.from, message }});
        }
      };
      chatws.onopen = () => setOnline(true);
      chatws.onclose = () => setOnline(false);
      chatws.onerror = console.log
    }())

    return () => {
      chatws.close();
    }
  }, []);
  useEffect(() => {
    (async function () {
      if (selected) {
        fetch(`/api/chat/history?user=${selected}`)
        .then(res => res.json())
        .then(history => dispatch({ type: 'setHistory', payload: { from: selected, history }}))
      }
    }())
  }, [selected])

  function handleSubmit(e) {
    e.preventDefault();
    chatws.send(JSON.stringify({ type: 'newMessage', to: selected, body }));
    setBody('')
  }

  return (
    <App {...{online, selected, setSelected, body, setBody, chats, messages, focusChatBox, setFocusChatBox, handleSubmit}}/>
  )
}

export default AppContainer;
