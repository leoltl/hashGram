import React, { useEffect, useReducer, useState } from 'react';

import ChatBox from './components/ChatBox';
import ChatList from './components/ChatList';

var chatws;

function App({ online, selected, setSelected, body, setBody, chats, state, err, focusChatBox, setFocusChatBox, handleSubmit, newChat, handleNewChat, handleCreateChat }) {
  console.log('app err', err)
  return (
    <div className="app">
      {err 
        ? `Page has error: ${JSON.stringify(err)}` 
        : (
          <>
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
                newChat={newChat}
                handleNewChat={handleNewChat} 
                handleCreateChat={handleCreateChat}
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
          </>
      )}
    </div> 
  );
}



function reducer(state, action) {
  switch(action.type) {
    case 'avatar':
      const chats = [action.payload, ...state.chats.filter(chat => chat.user_handle !== action.payload.user_handle)];
      return {...state, chats};
    case 'setChats':
      return {...state, chats: action.payload}
    case 'setHistory':
      return {...state, [action.payload.from]: action.payload.history}
    case 'newMessage':
      if (notInChats(state,action.payload.from)) {
        return { ...state, 
                chats: [{ user_handle: action.payload.from }, ...state.chats],
                [action.payload.from]: [action.payload.message]
              }
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
  const [newChat, setNewChat] = useState('');
  const [err, setErr] = useState(null); 

  function handleNewChat(e) {
    setNewChat(e.target.value);
  }

  function handleCreateChat(e) {
    if(e.keyCode === 13) {
      chatws.send(JSON.stringify({ type: 'avatar', user: newChat }))
      setSelected(newChat);
      setNewChat('');
    }
  }

  useEffect(() => {
    (function(){
      
      fetch('/api/chats')
        .then(res => res.json())
        .then(chats => dispatch({ type: 'setChats', payload: chats }))
        .catch(e => setErr(e))
      
      chatws = new WebSocket('wss://leoltlleoltl-hashgram.herokuapp.com/chat')
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
        if (message.type === 'avatar') {
          return dispatch({ type: 'avatar', payload: message.payload })
        }
      };
      chatws.onclose = (e) => {
        console.log('close', )
        setErr('Can\'t establish server connection, please reauthenticate and retry.')
      }
      chatws.onerror = (e) => {
        console.log(e)
        setErr('Can\'t establish server connection, please reauthenticate and retry.')
      }
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
    if (selected) {
      chatws.send(JSON.stringify({ type: 'newMessage', to: selected, body }));
      setBody('')
    }
  }

  return (
    <App {...{
      chats: state.chats,
      setSelected, online, selected, body, setBody, state, err,
      focusChatBox, setFocusChatBox, handleSubmit, newChat, handleNewChat, handleCreateChat }}/>
  )
}

export default AppContainer;
