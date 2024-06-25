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

  const [privateTarget, setPrivateTarget] = useState('');
  const [roomNumber, setRoomNumber] = useState('1');

  useEffect(function sMessage() {
    if (!webSocket) return;
    function sMessageCallback(msg) {
      const { data, id, target } = msg;
      setMsgList((prev) => [
        ...prev,
        {
          msg: data,

          type: target ? 'private' : 'other',
          id,
        },
      ]);
    }
    webSocket.on('sMessage', sMessageCallback);
    return () => {
      webSocket.off('sMessage', sMessageCallback);
    };
  }, []);

  useEffect(function sLogin() {
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

  useEffect(
    function scrollToBottom() {
      const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
      scrollToBottom();
    },
    [msgList]
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    webSocket.emit('login', { userId, roomNumber });
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
      target: privateTarget,
    };
    webSocket.emit('message', sendData);
    setMsgList((prev) => [...prev, { msg, type: 'me', id: userId }]);
    setMsg('');
  };
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  const onSetPrivateTarget = (e) => {
    const { id } = e.target.dataset;
    setPrivateTarget((prev) => (prev === id ? '' : id));
  };

  const onRoomChangeHandler = (e) => {
    setRoomNumber(e.target.value);
  };
  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin && (
          <div className="chat-box">
            <h3>
              Login as a "{userId}" in Room {roomNumber}
            </h3>
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
                  <li
                    className={item.type}
                    key={`${i}_li`}
                    name={item.id}
                    data-id={item.id}
                    onClick={onSetPrivateTarget}
                  >
                    <div
                      className={
                        item.id === privateTarget ? 'private-user' : 'userId'
                      }
                      data-id={item.id}
                      name={item.id}
                    >
                      {item.id}
                    </div>
                    <div className={item.type} data-id={item.id} name={item.id}>
                      {item.msg}
                    </div>
                  </li>
                );
              })}
              <li ref={messageEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              {privateTarget && (
                <div className="private-target">{privateTarget}</div>
              )}
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
              <select onChange={onRoomChangeHandler}>
                <option value="1">Room 1</option>
                <option value="2">Room 2 </option>
              </select>
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
