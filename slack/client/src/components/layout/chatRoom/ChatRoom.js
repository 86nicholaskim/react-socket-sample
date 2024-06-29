import {
  chatRoomWrapCss,
  chatCss,
  textBoxCss,
  chatBoxCss,
  subTitleCss,
  chatBoxGuidCss,
} from './ChatRoom.style';
import { Context } from '../../../context';
import { TextEditor, GroupTextInput } from '../../index';
import { socketPrivate, socketGroup } from '../../../socket';
import logo from '../../../images/logo.png';
import dayjs from 'dayjs';
import { useContext, useEffect, useRef, useState } from 'react';

const ChatRoom = () => {
  const {
    state: { currentChat, loginInfo, gropuChat, userList },
  } = useContext(Context);
  const reactQuillRef = useRef(null);
  const [text, setText] = useState('');
  const [groupUser, setGroupUser] = useState('');
  const [msgList, setMsgList] = useState([]);
  const [groupChatUser, setGroupChatUsers] = useState([]);

  useEffect(function privateMsg() {
    socketPrivate.on('private-msg', setPrivateMsgListHandler);
    return () => {
      socketPrivate.off('private-msg', setPrivateMsgListHandler);
    };

    function setPrivateMsgListHandler(data) {
      const { msg, fromUserId, toUserId, time } = data;
      if (
        currentChat.roomNumber === `${fromUserId}-${toUserId}` ||
        currentChat.roomNumber === `${toUserId}-${fromUserId}`
      ) {
        setMsgList((prev) => [
          ...prev,
          {
            msg,
            userId: fromUserId,
            time,
          },
        ]);
      }
    }
  }, []);
  useEffect(function groupMsg() {}, []);
  useEffect(function privateMsgInit() {}, []);
  useEffect(function groupMsgInit() {}, []);
  useEffect(function msgListInit() {}, []);

  const onPrivateMsgSendHandler = () => {};
  const onGroupSendHandler = () => {};
  const onChangeGroupTextHandler = () => {};
  const groupChatUserCloseClick = () => {};
  const onJoinClick = () => {};
  const onGroupMsgSendHandler = () => {};

  return (
    <article css={chatRoomWrapCss}>
      <div css={subTitleCss}>
        {gropuChat.textBarStatus && <GroupTextInput />}
        {!gropuChat.textBarStatus &&
          currentChat.targetId.map((v) => {
            <span className="user">{v}</span>;
          })}
      </div>
      {currentChat.roomNumber && (
        <ul css={chatBoxCss}>
          {msgList.map((v, i) => (
            <li css={chatCss}>
              <div className="userBox">
                <span className="user">{v.userId}</span>
                <span className="date">{v.time}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!currentChat.roomNumber && (
        <div css={chatBoxGuidCss}>
          <img src={logo} width="100px" height="auto" alt="logo" />
          <div className="guide">Please, Choose a conversation.</div>
        </div>
      )}
      {currentChat.roomNumber && (
        <TextEditor
          onSendHandler={
            currentChat.targetId.length > 1
              ? onGroupMsgSendHandler
              : onPrivateMsgSendHandler
          }
          text={text}
          reactQuillRef={reactQuillRef}
          onChangeTextHandler={setText}
        />
      )}
    </article>
  );
};

export default ChatRoom;
