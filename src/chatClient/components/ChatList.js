import React, { useMemo } from 'react';
import ChatListItem from './ChatListItem';

function ChatList({ chats, setSelected, focusChatBox, handleClick, selected, newChat, handleNewChat, handleCreateChat }) {
  
  return (
    <section 
      className={`chatlist${focusChatBox ? ' chatlist--unfocus' : ''}`} 
      onClick={handleClick}
    >
      <input name="new-chat" placeholder="Start a new chat..." onChange={handleNewChat} value={newChat} onKeyDown={handleCreateChat}/>
      <button className="secondary"> > </button>
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

function ChatListContainer({ chats, setSelected, focusChatBox, setFocusChatBox, selected, newChat, handleNewChat, handleCreateChat }) {
  function handleClick() {
    focusChatBox ? setFocusChatBox(false) : selected && setSelected(null)
}
  return (
    <ChatList 
      chats={chats}
      selected={selected}
      setSelected={setSelected}
      focusChatBox={focusChatBox}
      newChat={newChat}
      handleNewChat={handleNewChat} 
      handleCreateChat={handleCreateChat}
      handleClick={handleClick}
    />
  )
}

export default ChatListContainer;
