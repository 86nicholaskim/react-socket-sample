import logo from './images/iologo.png';
import { useState, useRef, useEffect } from 'react';
import './App.css';

import { io } from 'socket.io-client';

const webSocket = io('http://localhost:5000');

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState('');
  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!webSocket) return;
    function sMessageCallback(msg) {
      const { data, id } = msg;
      setMsgList((prev) => [
        ...prev,
        {
          msg: data,
          type: 'other',
          id,
        },
      ]);
    }
    webSocket.on('sMessage', sMessageCallback);
    return () => {
      webSocket.off('sMessage', sMessageCallback);
    };
  }, []);

  useEffect(() => {
    if (!webSocket) return;
    function sLoginCallback(msg) {
      setMsgList((prev) => [
        ...prev,
        {
          msg: `${msg} joins the chat`,
          type: 'welcome',
          id: '',
        },
      ]);
    }
    webSocket.on('sLogin', sLoginCallback);
    return () => {
      webSocket.off('sLogin', sLoginCallback);
    };
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {};
    scrollToBottom();
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    webSocket.emit('login', userId);
    setIsLogin(true);
  };
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      data: msg,
      id: userId,
    };
    webSocket.emit('message', sendData);
    setMsgList((prev) => [...prev, { msg, type: 'me', id: userId }]);
    setMsg('');
  };
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin && (
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((item, i) => {
                if (item.type === 'welcome') {
                  return (
                    <li className="welcome" key={`${i}_li`}>
                      <div className="line" />
                      <div>{item.msg}</div>
                      <div className="line" />
                    </li>
                  );
                }
                return (
                  <li className={item.type} key={`${i}_li`}>
                    <div className="userId">{item.id}</div>
                    <div className={item.type}>{item.msg}</div>
                  </li>
                );
              })}
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
        {!isLogin && (
          <div className="login-box">
            <div className="login-title">
              <img src={logo} width="40px" height="40px" alt="logo" />
              <div>IOChat</div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
