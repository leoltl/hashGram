import React from 'react';
import dayjs from 'dayjs';

export default function Message({ message, selected }) {
  const time = dayjs(message.created_at);
  return (
    <article className={`chatbox__message${(message.from !== selected) ? ' chatbox__message--reversed' : ''}`}>
      <p>{message.body}</p>
      <small className="chatbox__timestamp">{time.format('HH:mm')}</small>
    </article>
  )
}