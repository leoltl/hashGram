import React, { useMemo } from 'react';
import ChatListItem from './ChatListItem';

function ChatList({ chats, setSelected, focusChatBox, setFocusChatBox, selected }) {
  function handleClick() {
      focusChatBox ? setFocusChatBox(false) : selected && setSelected(null)
  }
  return (
    <section 
      className={`chatlist${focusChatBox ? ' chatlist--unfocus' : ''}`} 
      onClick={handleClick}
    >
      {chats && 
        chats.map(chat => 
        <ChatListItem
          chat={chat}
          focusChatBox={focusChatBox}
          setSelected={setSelected}
          selected={selected}
          />
        )}
    </section>
  )
}

function ChatListContainer({ chats, setSelected, focusChatBox, setFocusChatBox, selected }) {
  return (
    <ChatList 
      chats={chats}
      selected={selected}
      setSelected={setSelected}
      focusChatBox={focusChatBox}
      setFocusChatBox={setFocusChatBox}
    />
  )
}

export default ChatListContainer;
