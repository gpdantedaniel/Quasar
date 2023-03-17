import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import designSystemStyles from "../../assets/styles";
import Icon from "react-native-vector-icons/Ionicons";

const Toast = ({ t, updateHeight, offset }) => {
  // Animations for enter and exit
  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const posAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: t.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, t.visible]);

  useEffect(() => {
    Animated.spring(posAnim, {
      toValue: t.visible ? offset : -80,
      useNativeDriver: false,
    }).start();
  }, [posAnim, offset, t.visible]);


  const getIconByType = (type) => {
    switch(type) {
      case 'loading':
        return <ActivityIndicator color={'#1C25FF'}/>
      case 'success':
        return <Icon name={'checkmark-circle'} size={25} color={'green'}/>
      case 'error': 
        return <Icon name={'close-circle'} size={25} color={'red'}/>
      default: 
        return
    }
  }

  return (
    <Animated.View 
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: t.visible ? 9999 : undefined,
        opacity: fadeAnim,
        flex: 1,
        transform: [
          {
            translateY: posAnim,
          },
        ],
      }}>
      <View
        onLayout={(event) =>
          updateHeight(event.nativeEvent.layout.height)
        }
        style={[designSystemStyles.toast,]}
        key={t.id}>
        {t.type !== "blank" 
          ? getIconByType(t.type)
          : <Text style={designSystemStyles.bodyText}>{t.icon}</Text>
        }
        <Text style={[designSystemStyles.bodyText,]}>
          {t.message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Toast