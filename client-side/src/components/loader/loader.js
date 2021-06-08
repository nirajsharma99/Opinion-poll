import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../lottie/data2.json';

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid',
    },
  };
  return (
    <div
      className="position-fixed"
      style={{
        zIndex: 1001,
        background: 'rgba(255,255,255,0.9)',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Lottie options={defaultOptions} height={'100vh'} width={'100vw'} />
    </div>
  );
};
export default Loader;
