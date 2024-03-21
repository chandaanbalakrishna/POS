// BackgroundNotificationScheduler.js

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const BackgroundNotificationScheduler = () => {
  useEffect(() => {
    scheduleBackgroundNotification();
  }, []);
  
  const scheduleBackgroundNotification = async () => {
    const triggerTime = new Date();
    triggerTime.setHours(19, 0, 0); // Set the trigger time to 7:00 PM

    const secondsUntilTrigger = Math.round((triggerTime.getTime() - Date.now()) / 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pos Notification',
        body: 'Please Update the task and OutTime for the day',
      },
      trigger: {
        seconds: secondsUntilTrigger > 0 ? secondsUntilTrigger : 0,
      },
    });
  };
  return null;
};

export default BackgroundNotificationScheduler;
