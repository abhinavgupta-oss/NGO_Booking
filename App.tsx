import React from "react";
import { ToastProvider } from "./src/Component/Toast/ToastContext";
import AppNavigator from "./src/Navigation/AppNavigator";
import NoInternetScreen from "./src/Component/NoInternet/NoInternetScreen";


const App = () => {
  // const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const isConnected = true;

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => unsubscribe();
  // }, []);



  // const requestNotificationPermission = async () => {
  //   if (Platform.OS === 'android' && Platform.Version >= 33) {
  //     try {
  //       const result = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //       );

  //       if (result === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('✅ Notification permission granted');
  //       } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //         Alert.alert(
  //           'Permission Required',
  //           'Please enable notification permission in app settings',
  //           [
  //             { text: 'Cancel', style: 'cancel' },
  //             { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //           ]
  //         );
  //       } else {
  //         console.log('🚫 Notification permission denied');
  //       }
  //     } catch (error) {
  //       console.warn('Permission error:', error);
  //     }
  //   }
  // }; 

  // useEffect(() => {
  //   requestNotificationPermission();
  // }, []);

  // ---------------------- FCM LISTENER (UPDATED) ----------------------
  // useEffect(() => {
  //   const messagingInstance = getMessaging();

  //   // ✅ Foreground
  //   const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
  //     console.log('📩 Foreground:', remoteMessage);
  //     handleNotification(remoteMessage?.data);
  //   });

  //   // ✅ Background → open
  //   const unsubscribeOpened = onNotificationOpenedApp(
  //     messagingInstance,
  //     remoteMessage => {
  //       console.log('📲 Background Open:', remoteMessage);
  //       handleNotification(remoteMessage?.data);
  //     }
  //   );

  //   // ✅ Quit → open
  //   getInitialNotification(messagingInstance).then(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log('🚀 Quit Open:', remoteMessage);
  //       handleNotification(remoteMessage?.data);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeOpened();
  //   };
  // }, []);




  // 🚫 Show No Internet Screen
  if (isConnected === false) {
    return <NoInternetScreen />;
  }

  return (
    <ToastProvider>
      <AppNavigator />
    </ToastProvider>
  );
};

export default App;
