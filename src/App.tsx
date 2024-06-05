import React, { useState, useOptimistic, useTransition } from 'react';
import logo from './logo.svg';
import './App.css';

import { FiSend } from 'react-icons/fi';

import conf from '../package.json'
import { PokeList } from './PokeList'

interface TextMessage {
  text: string;

  /**
   * undefined = pending, true = error, false = sent
   */
  sendError?: boolean;
}

async function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function getMessageStyle(message: TextMessage): React.CSSProperties {
  if (message.sendError === undefined) {
    return { opacity: '.5' };
  }
  if (message.sendError === true) {
    return { color: 'red', textDecoration: 'line-through' };
  }

  return { color: 'green' };
}

function App() {

  console.log('re render')

  const [messages, setMessages] = useState<TextMessage[]>([
    { text: "Hello there!", sendError: false }
  ]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: TextMessage[], newMessage: string) => [
      ...state,
      { text: newMessage }
    ]
  );
  const [isMessagePending, startMessageProcess] = useTransition();

  const sendMessage = (text: string) => {
    console.log('send  ' + text)
    addOptimisticMessage(text);

    startMessageProcess(async () => {
      const waitMillis = 100 + Math.random() * 4000;
      console.log('wait for ' + waitMillis + 'ms')
      await sleep(waitMillis);

      const error: boolean = Math.random() > 0.5;
      const newMessage: TextMessage = { text, sendError: error };
      setMessages(messages => [...messages, newMessage]);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          {optimisticMessages.length} messages:
          {optimisticMessages.map((message, index) =>
            <div style={getMessageStyle(message)} key={index}>- {message.text}</div>
          )}
        </div>

        <form action={(formData: FormData) => sendMessage(formData.get('text') as string)}>

          <input name="text" />
          <button type="submit" disabled={isMessagePending}>
            <FiSend />
          </button>
        </form>

        <p>
          React version : {conf.dependencies.react}
        </p>
        <hr />
        <PokeList></PokeList>
      </header>
    </div>
  );
}

export default App;
