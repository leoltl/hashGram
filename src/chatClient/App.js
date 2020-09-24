import React, { useEffect, useReducer, useState } from 'react';

import ChatBox from './components/ChatBox';
import ChatList from './components/ChatList';

var chatws;

function App({ online, selected, setSelected, body, setBody, chats, state, focusChatBox, setFocusChatBox, handleSubmit}) {
  return (
    <div className="app">
      <div className="app__status-bar">
        {selected} 
        {selected 
          ? (online ? <div class="online"></div> : <div class="offline"></div>)
          : ''}
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
          messages={state[selected]}
          focusChatBox={focusChatBox}
          setFocusChatBox={setFocusChatBox}
          handleSubmit={handleSubmit}
        />
      </div>
    </div> 
  );
}



function reducer(state, action) {
  switch(action.type) {
    case 'setChats':
      return {...state, chats: action.payload}
    case 'setHistory':
      return {...state, [action.payload.from]: action.payload.history}
    case 'newMessage':
      if (notInChats(state,action.payload.from)) {
        return { ...state, chats: [{ user_handle: action.payload.from }, ...state.chats]}
      }
      return {...state, [action.payload.from]: [action.payload.message, ...(state[action.payload.from] || [])]}
    default:
      return state;
  }
}

function notInChats(state, from) {
  return !state.chats.find(i => i.user_handle === from)
}

function AppContainer() {
  const [online, setOnline] = useState(false);
  const [focusChatBox, setFocusChatBox] = useState(false);
  const [selected, setSelected] = useState(null);
  const [body, setBody] = useState('');
  const [state, dispatch] = useReducer(reducer, {});


  useEffect(() => {
    (function(){
      
      fetch('/api/chats')
        .then(res => res.json())
        .then(chats => dispatch({ type: 'setChats', payload: chats }));
      
      chatws = new WebSocket("ws://localhost:3000/chat")
      chatws.onmessage = (msg) => {
        const message = JSON.parse(msg.data);
        if (message.type === 'loopback') {
          return dispatch({ type: 'newMessage', payload: { from: message.to, message }});
        }
        if (message.type === 'newMessage') {
          return dispatch({ type: 'newMessage', payload: { from: message.from, message }});
        }
        if (message.type === 'checkOnline') {
          return setOnline(message.online)
        }
      };
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
    }());

    if (selected) {
      chatws.send(JSON.stringify({ type: 'checkOnline', user: selected }))
      var checkUser = setInterval(() => {
        chatws.send(JSON.stringify({ type: 'checkOnline', user: selected }))
      }, 5000)
    }
    return () => {
      clearInterval(checkUser)
    }
  }, [selected])

  function handleSubmit(e) {
    e.preventDefault();
    chatws.send(JSON.stringify({ type: 'newMessage', to: selected, body }));
    setBody('')
  }

  return (
    <App {...{
      chats: state.chats,
      setSelected,
      online, selected, body, setBody, state, focusChatBox, setFocusChatBox, handleSubmit }}/>
  )
}

export default AppContainer;
