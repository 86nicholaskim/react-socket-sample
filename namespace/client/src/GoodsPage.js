import React, { useEffect, useState } from 'react';
import { socketGoods } from './socket';

const GoodsPage = () => {
  const [isConnect, setIsConnect] = useState(false);
  useEffect(() => {
    socketGoods.on('connect', onConnect);
    socketGoods.on('disconnect', onDisConnect);

    function onConnect() {
      setIsConnect(true);
    }
    function onDisConnect() {
      setIsConnect(false);
    }
    return () => {
      socketGoods.off('connect', onConnect);
      socketGoods.off('disconnect', onDisConnect);
    };
  }, []);

  const onConnectHandler = () => {
    socketGoods.connect();
  };

  const onDisConnectHandler = () => {
    socketGoods.disconnect();
  };

  return (
    <div className="text-wrap">
      <h1>
        GoodsNameSpace is {isConnect && <em className="active">Connected!</em>}
        {!isConnect && <em className="deactive">Not Connected!</em>}
      </h1>
      <div className="btn-box">
        <button onClick={onConnectHandler} className="active-btnß">
          Connected
        </button>
        <button onClick={onDisConnectHandler} className="deactive-btn">
          Disconnected
        </button>
      </div>
    </div>
  );
};

export default GoodsPage;
