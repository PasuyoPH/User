import * as Types from 'app-types'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Http } from 'app-structs'
import { NativeAppEventEmitter } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { LoginPageData, MainPageData } from './PageData'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import useState from 'react-usestateref'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const http = new Http.Client(),
  NativeStack = createNativeStackNavigator()

function App() {
  const [user, setUser] = useState<Types.App.UserAppData>(
      {
        token: null,
        appState: Types.App.AppState.LOADING,
        cart: new Map()
      }
    ),
    [fontsLoaded] = useFonts(
      {
        'Century Gothic': require('../assets/fonts/Century-Gothic.ttf'),
        'Century Gothic Bold': require('../assets/fonts/Century-Gothic-Bold.ttf'),
        'Roboto Condensed Italic': require('../assets/fonts/RobotoCondensed-Italic.ttf'),
        'Roboto Condensed Bold': require('../assets/fonts/RobotoCondensed-Bold.ttf'),
        'Highman': require('../assets/fonts/Highman.ttf')
      }
    )
  
  const fetchUserData = async (token: string) => {
    console.log('[INFO]: Fetching account data with token:', token)
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
      console.log('[INFO]: Initial load.')
      console.log('[INFO]: Running App:init()')

      const init = async () => {
        console.log('[INFO]: Fetching user token from storage.')
        
        if (user.token && user.data) return console.log('[INFO]: User already logged in. Nothing to do.')

        const token = await AsyncStorage.getItem('token') ?? undefined
        console.log('[INFO]: AsyncStorage.getItem(\'token\') returned:', token)

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
            await AsyncStorage.setItem('token', null)
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
        'remove-cart',
        (uid: string) => {
          const cart = new Map(user.cart),
            data = cart.get(uid)

          if (data.quantity > 0) {
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
          const cart = new Map(user.cart),
            data = cart.get(uid)

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

      return () => {
        NativeAppEventEmitter.removeAllListeners()        
        console.log('[INFO]: App:unmount()')
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
      return (
        <NavigationContainer>
          <NativeStack.Navigator  
            screenOptions={
              {
                headerStyle: { backgroundColor: Types.Constants.Colors.Layout.secondary },
                contentStyle: {
                  backgroundColor: Types.Constants.Colors.All.whiteSmoke
                }
              }
            }
          >
            {
              MainPageData.map(
                (page, idx) => (
                  <NativeStack.Screen
                    key={idx}
                    name={page.name}
                    options={
                      {
                        headerShown: !page.hideHeader,
                        animation: page.animation
                      }
                    }
                  >
                    {
                      (props) => (
                        <>
                          <StatusBar
                            style={page.statusBarColor ?? 'dark'}
                          />

                          <page.component
                            {...user}
                            {...props}
                            modifyData={setUser}
                          />
                        </>
                      )
                    }
                  </NativeStack.Screen>
                )
              )
            }
          </NativeStack.Navigator>
        </NavigationContainer>
      )
    }

    default: {
      return null
    }
  }
}

export default App