import React from 'react';

export default function ChatListItem({ chat, focusChatBox, setSelected, selected }) {
  function handleClick(event) {
    event.stopPropagation();
    setSelected(selected && selected === chat.user_handle ? null : chat.user_handle);
  }
  return (
    <section className={`chatlist__item${focusChatBox ? ' chatlist__item--unfocus' : ''}`} onClick={handleClick}>
      <img alt={`profile picture of ${chat.user_handle}`} src={`https://www.gravatar.com/avatar/${chat.avatar}?d=identicon&s=24`} />
      <span className="chatlist__user">{chat.user_handle}</span>
    </section>
  )
}