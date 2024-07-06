import React, { useContext, useEffect } from 'react';
import { css } from '@emotion/react';
import { User } from '../../index';
import { CURRENT_CHAT, GROUP_LIST, GRUOP_CHAT } from '../../../context/action';
import { Context } from '../../../context';
import { socketGroup, socketPrivate } from '../../../socket';
import {
  directMsgCss,
  navBarWrapCss,
  titleCss,
  userListCss,
} from './SideBar.style';
import { BiChevronDown } from 'react-icons/bi';

const SideBar = () => {
  const {
    state: { userList, loginInfo, currentChat, groupList },
    dispatch,
  } = useContext(Context);

  useEffect(
    function msgInit() {
      if (currentChat.targetId.length > 1) {
        socketGroup.emit('msgInit', {
          targetId: currentChat.targetId,
        });
      } else {
        socketPrivate.emit('msgInit', {
          targetId: currentChat.targetId,
        });
      }
    },
    [currentChat.targetId]
  );

  useEffect(function msgAlert() {
    socketPrivate.on('msg-alert', setMsgAlert);
    return () => {
      socketPrivate.off('msg-alert', setMsgAlert);
    };
    function setMsgAlert(data) {
      socketPrivate.emit('resJoinRoom', data.roomNumber);
    }
  }, []);

  useEffect(function groupChatReq() {
    socketGroup.on('group-chat-req', setGroupChat);
    return () => {
      socketGroup.off('group-chat-req', setGroupChat);
    };
    function setGroupChat(data) {
      socketGroup.emit('resGroupJoinRoom', {
        roomNumber: data.roomNumber,
        socketId: data.socketId,
      });
    }
  }, []);

  const onUserClickHandler = (e) => {
    const { id } = e.target.dataset;
    dispatch({
      type: CURRENT_CHAT,
      payload: {
        targetId: [id],
        roomNumber: `${loginInfo.userId}-${id}`,
        targetSocketId: e.target.dataset.socket,
      },
    });
  };

  const onMakeGroupChat = () => {
    dispatch({
      type: GRUOP_CHAT,
      payload: {
        textBarStatus: true,
        groupChatNames: [],
      },
    });
  };

  const onGroupUserClickHandler = (e) => {
    const { id } = e.target.dataset;
    dispatch({
      type: CURRENT_CHAT,
      payload: {
        targetId: [...id.split(',')],
        roomNumber: id,
        targetSocketId: e.target.dataset.socket,
      },
    });
    socketGroup.emit('joinGroupRoom', {
      roomNumber: id,
      socketId: e.target.datset.socket,
    });
    dispatch({
      type: GRUOP_CHAT,
      payload: {
        textBarStatus: false,
        groupChatNames: [],
      },
    });
  };

  return (
    <nav css={navBarWrapCss}>
      <div css={titleCss}></div>
      <ul css={userListCss}>
        <li css={directMsgCss} onClick={onMakeGroupChat}>
          <BiChevronDown size="20" />
        </li>
        {userList.map((v, i) => (
          <li key={`${i}-user`}>
            <User
              id={v.userId}
              status={v.status}
              socket={v.socketId}
              type={v.type}
              onClick={
                v.type === 'group'
                  ? onGroupUserClickHandler
                  : onUserClickHandler
              }
            />
          </li>
        ))}
        {groupList.map((v, i) => (
          <li key={`${i}-user`}>
            <User
              id={v.userId}
              status={v.status}
              socket={v.socketId}
              type={v.type}
              onClick={
                v.type === 'group'
                  ? onGroupUserClickHandler
                  : onUserClickHandler
              }
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideBar;
