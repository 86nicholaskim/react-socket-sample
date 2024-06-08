import logo from './images/websocket.png';
import './App.css';
import { useEffect, useRef, useState } from 'react';

// websocket
const webSocket = new WebSocket('ws:localhost:5000');

function App() {
  const messageEndRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgList, setMsgList] = useState([]);

  // websocket connect , listening message
  useEffect(() => {
    if (!webSocket) return;

    webSocket.onopen = function () {
      console.log('open', webSocket.protocol);
    };

    webSocket.onmessage = function (e) {
      const { data, id, type } = JSON.parse(e.data);
      setMsgList((prev) => [
        ...prev,
        {
          msg: type === 'welcome' ? `${data} joins the chat` : data,
          type,
          id,
        },
      ]);
    };
  }, []);

  // scroll
  useEffect(() => {
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: 'id',
      data: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };

  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };

  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = { type: 'msg', data: msg, id: userId };
    webSocket.send(JSON.stringify(sendData));
    setMsgList((prev) => [...prev, { msg, type: 'me', id: userId }]);
  };

  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="wrap">
        {/* chatting mode */}
        {isLogin && (
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((m, i) =>
                m.type === 'welcome' ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{m.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li className={m.type} key={`${i}_li`}>
                    <div className="userId">{m.id}</div>
                    <div className={m.type}>{m.msg}</div>
                  </li>
                )
              )}
              <li ref={messageEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        )}
        {/* login mode */}
        {isLogin === false && (
          <>
            <div className="login-box">
              <div className="login-title">
                <img src={logo} width="40px" height="40px" alt="logo" />
                <div>WebChat</div>
              </div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
