import * as Types from 'app-types'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Http } from 'app-structs'
import { NativeAppEventEmitter } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { DeliverPageData, LoginPageData, MainPageData } from './PageData'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import useState from 'react-usestateref'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as Linking from 'expo-linking'
import { PortalProvider } from '@gorhom/portal'
import * as Location from 'expo-location'
import { AppModes, CartData } from 'app-types/src/app'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import useStateRef from 'react-usestateref'
import 'react-native-gesture-handler'
import { Display } from '../components'

// for icons to import as text
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

Location.setGoogleApiKey('AIzaSyAe1O4RsaElYL79mHnPSHRGL_lVCf9uP0M')

const http = new Http.Client(),
  NativeStack = createNativeStackNavigator(),
  BottomTabStack = createBottomTabNavigator()

function App() {
  const [user, setUser, userRef] = useStateRef<Types.App.UserAppData>(
      {
        token: null,
        appState: Types.App.AppState.LOADING,
        cart: new Map()
      }
    ),
    [appMode, setAppMode] = useState(AppModes.BILI),
    [fontsLoaded] = useFonts(
      {
        'Century Gothic': require('../assets/fonts/Century-Gothic.ttf'),
        'Century Gothic Bold': require('../assets/fonts/Century-Gothic-Bold.ttf'),
        'Roboto Condensed Italic': require('../assets/fonts/RobotoCondensed-Italic.ttf'),
        'Roboto Condensed Bold': require('../assets/fonts/RobotoCondensed-Bold.ttf'),
        'Highman': require('../assets/fonts/Highman.ttf'),
        'Wolf Sans': require('../assets/fonts/Wolf-Sans-Regular.ttf')
      }
    ),
    [addToSnackbar, snackbarContent] = Display.useSnackbar(),
    url = Linking.useURL()
  
  const fetchUserData = async (token: string) => {
    const res = await http.request<Types.Account.UserAccountData>(
      {
        method: 'get',
        url: Types.Constants.Url.Routes.USER,
        headers: {
          Authorization: token
        }
      }
    )

    console.log(
      res.value ?
        '[INFO]: Received account data with id: ' + res.value?.uid :
        '[INFO]: Failed to fetch account with associated token.'
    )

    setUser(
      (latestUser) => (
        res.value ? (
          {
            ...latestUser,
            data: res.value,
            appState: Types.App.AppState.LOGGED_IN,
            token
          }
        ) : (
          {
            ...latestUser,
            appState: Types.App.AppState.LOGGED_OUT,
            token
          }
        )
      )
    )

    // Save new value to async storage
    await AsyncStorage.setItem('token', token)
  }

  useEffect(
    () => {

      const init = async () => {        
        if (user.token && user.data) return

        const token = await AsyncStorage.getItem('token') ?? undefined
        if (!token)
          return setUser(
            (latestUser) => (
              {
                ...latestUser,
                appState: Types.App.AppState.LOGGED_OUT
              }
            )
          )

        await fetchUserData(token)
      }

      init()
        .catch(console.error)

      NativeAppEventEmitter.addListener( // event should be triggered when we receive token
        'token',
        async (token: string) => {
          if (token) await fetchUserData(token)
          else { // logout
            await AsyncStorage.removeItem('token')
            setUser(
              (latestUser) => (
                {
                  ...latestUser,
                  token: null,
                  appState: Types.App.AppState.LOGGED_OUT
                }
              )
            )
          }
        }
      )

      NativeAppEventEmitter.addListener(
        'set-cart',
        (cart: Map<string, CartData>) => {
          console.log('Set Cart')

          setUser(
            (latestUser) => (
              {
                ...latestUser,
                cart
              }
            )
          )
        }
      )

      NativeAppEventEmitter.addListener(
        'cart-clear',
        () => {
          const cart = new Map() // make a new map
          setUser(
            (latestUser) => (
              {
                ...latestUser,
                cart
              }
            )
          )
        }
      )

      NativeAppEventEmitter.addListener(
        'remove-cart',
        (uid: string) => {
          //addToSnackbar('Item removed from cart.', SnackbarTypes.DANGER)

          const cart = new Map(userRef.current.cart),
            data = cart.get(uid)

          if (data.quantity <= 1)
            cart.delete(uid)
          else {
            data.quantity--
            cart.set(uid, data)
          }

          setUser(
            (latestUser) => (
              {
                ...latestUser,
                cart
              }
            )
          )
        }
      )

      NativeAppEventEmitter.addListener(
        'add-cart',
        (uid: string) => {
          //addToSnackbar('Item added to cart.', SnackbarTypes.SUCCESS)

          const cart = new Map(userRef.current.cart),
            data = cart.get(uid)

          console.log('uid:', uid, 'DATA:', data)

          data.quantity++
          cart.set(uid, data)

          setUser(
            (latestUser) => (
              {
                ...latestUser,
                cart
              }
            )
          )
        }
      )

      NativeAppEventEmitter.addListener(
        'switch-mode',
        (mode: AppModes) => setAppMode(mode)
      )

      return () => {
        NativeAppEventEmitter.removeAllListeners()        
      }
    },
    []
  )

  if (!fontsLoaded) return null

  switch (user.appState) {
    case Types.App.AppState.LOGGED_OUT: {
      return (
        <NavigationContainer>
          <NativeStack.Navigator
            screenOptions={
              {
                headerShown: false,
                contentStyle: {
                  backgroundColor: Types.Constants.Colors.All.whiteSmoke
                }
              }
            }
          >
            {
              LoginPageData.map(
                (page, idx) => (
                  <NativeStack.Screen
                    key={idx}
                    name={page.name}
                    component={page.component}
                  />
                )
              )
            }
          </NativeStack.Navigator>
        </NavigationContainer>
      )
    }

    case Types.App.AppState.LOGGED_IN: {
      switch (appMode) {
        case AppModes.DELIVER: {
          return (
            <NavigationContainer>
              <BottomTabStack.Navigator  
                screenOptions={
                  { headerStyle: { backgroundColor: Types.Constants.Colors.Layout.secondary } }
                }
                sceneContainerStyle={
                  { backgroundColor: Types.Constants.Colors.All.whiteSmoke }
                }
                tabBar={() => null}
                backBehavior='history'
              >
                {
                  DeliverPageData.map(
                    (page, idx) => (
                      <BottomTabStack.Screen
                        key={idx}
                        name={page.name}
                        options={
                          {
                            headerShown: !page.hideHeader,
                            unmountOnBlur: page.unmount ?? true
                          }
                        }
                      >
                        {
                          (props) => (
                            <>
                              <StatusBar
                                style={page.statusBarColor ?? 'dark'}
                              />
                              
                              <PortalProvider>
                                <Animated.View
                                  entering={FadeIn}
                                  exiting={FadeOut}
                                  style={{ flexGrow: 1 }}
                                >
                                  <page.component
                                    {...user}
                                    {...props}
                                    modifyData={setUser}
                                  />

                                  {snackbarContent}
                                </Animated.View>
                              </PortalProvider>   
                            </>
                          )
                        }
                      </BottomTabStack.Screen>
                    )
                  )
                }
              </BottomTabStack.Navigator>
            </NavigationContainer>
          )
        }

        case AppModes.BILI: {
          return (
            <NavigationContainer>
              <BottomTabStack.Navigator  
                screenOptions={
                  { headerStyle: { backgroundColor: Types.Constants.Colors.Layout.secondary } }
                }
                sceneContainerStyle={
                  { backgroundColor: Types.Constants.Colors.All.whiteSmoke }
                }
                tabBar={() => null}
                backBehavior='history'
              >
                {
                  MainPageData.map(
                    (page, idx) => (
                      <BottomTabStack.Screen
                        key={idx}
                        name={page.name}
                        options={
                          {
                            headerShown: !page.hideHeader,
                            unmountOnBlur: page.unmount ?? true
                          }
                        }
                      >
                        {
                          (props) => (
                            <>
                              <StatusBar
                                style={page.statusBarColor ?? 'dark'}
                              />
                              <PortalProvider>
                                <Animated.View
                                  entering={FadeIn}
                                  exiting={FadeOut}
                                  style={{ flexGrow: 1 }}
                                >
                                  <page.component
                                    {...user}
                                    {...props}
                                    modifyData={setUser}
                                  />

                                  {snackbarContent}
                                </Animated.View>
                              </PortalProvider>
                            </>
                          )
                        }
                      </BottomTabStack.Screen>
                    )
                  )
                }
              </BottomTabStack.Navigator>
            </NavigationContainer>
          )
        }

        default: {
          return null
        }
      }
    }

    default: {
      return null
    }
  }
}

export default App