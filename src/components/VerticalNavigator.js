import React from 'react';
import { Text, Pressable, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationHelpersContext, useNavigationBuilder, createNavigatorFactory, TabRouter, TabActions} from '@react-navigation/native';
import designSystemStyles from '../assets/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut } from 'firebase/auth';

import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { clearQuiz } from '../redux/quizSlice';

function VerticalNavigator({initialRouteName, children, screenOptions, tabBarStyle, contentStyle}) {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  const dispatch = useDispatch();
  
  const onSignout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      dispatch(clearUser());
      dispatch(clearQuiz());
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <NavigationContent>
      <View style={{flexDirection: 'row', flex: 1}}>
  
        <View style={[styles.sidebar, tabBarStyle]}>

          <View style={{gap: 10,}}>
            <Image source={require('../assets/images/quasar_logo.png')} style={{width: 125, height: 25,}}/>
            <Text style={designSystemStyles.bodyText}>Studying Made Easy</Text>
          </View>

          <View style={styles.routesContainer}>
            {state.routes.map((route) => (
              <TouchableOpacity
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...TabActions.jumpTo(route.name),
                      target: state.key,
                    });
                  }
                }}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}
              >
                {descriptors[route.key].options.tabBarIcon}
                <Text style={[designSystemStyles.bodyText, {marginLeft: 5}]}>
                  {descriptors[route.key].options.title || route.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => onSignout()}>
            <Icon name='exit-outline' color='black' size={25}/>
            <Text style={[designSystemStyles.bodyText, {marginLeft: 5}]}>Log Out</Text>
          </TouchableOpacity>

        </View>

        <View style={[styles.displayedScreen, contentStyle]}>
          {state.routes.map((route, i) => {
            return (
              <View
                key={route.key}
                style={[
                  StyleSheet.absoluteFill,
                  { display: i === state.index ? 'flex' : 'none' },
                ]}
              >
                {descriptors[route.key].render()}
              </View>
            );
          })}
        </View>
      </View>

    </NavigationContent>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    minWidth: 250,
    borderRightColor: '#000',
    borderRightWidth: 1,
    justifyContent: 'space-between',
    padding: 40,
  },

  routesContainer: {
    gap: 20,
  },
  
  displayedScreen: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  }
})

const createVerticalNavigator = createNavigatorFactory(VerticalNavigator);
export default createVerticalNavigator;
