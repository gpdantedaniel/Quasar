import React from 'react';
import toast, { useToaster } from 'react-hot-toast/headless';
import { View } from 'react-native';
import Toast from './Toast';

const Notifications = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <View 
      onMouseEnter={startPause} 
      onMouseLeave={endPause}
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 300,
      }}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          t={t}
          updateHeight={(height) => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </View>
  );
};

export default toast
export { Notifications }
// Create toasts anywhere
