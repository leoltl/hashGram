import React, { useLayoutEffect, useRef } from 'react';
import Message from './ChatBoxMessage';

function ChatBox({ body, setBody, messages, focusChatBox, setFocusChatBox, handleSubmit, selected }) {
  function handleChange(e) {
    setBody(e.target.value)
  }

  const messagesEndRef = useRef(null)
  const messageWrapperRef = useRef(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messageWrapperRef.current.scrollTo(0, messagesEndRef.current.getBoundingClientRect().top)
    }
  }

  useLayoutEffect(scrollToBottom, [messages]);
  console.log('paint')
  return (
    <section 
      className={`chatbox${focusChatBox ? '' : ' chatbox--unfocus'}`} 
      onClick={() => !focusChatBox && setFocusChatBox(true)}>
      <div className="chatbox__messages-wrapper" ref={messageWrapperRef}>
        <div className="chatbox__messages">
          {messages && 
            messages.map(message => <Message message={message} selected={selected} />)}
        </div>
        <div ref={messagesEndRef}> </div>
      </div>
      <form onSubmit={handleSubmit} >
        <input name="message" value={body} onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
    </section>
  )
}

function ChatBoxContainer({ body, setBody, messages, focusChatBox, setFocusChatBox, handleSubmit, selected }) {
  return (
    <ChatBox
      body={body}
      setBody={setBody}
      messages={messages}
      focusChatBox={focusChatBox}
      setFocusChatBox={setFocusChatBox}
      handleSubmit={handleSubmit}
      selected={selected}
    />
  )
}

export default ChatBoxContainer;
