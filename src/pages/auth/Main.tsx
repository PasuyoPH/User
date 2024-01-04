import { Dimensions, View, ScrollView, ActivityIndicator, Image } from 'react-native'
import { Display, Text } from '../../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Constants } from 'app-types'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useCallback, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { faSignIn } from '@fortawesome/free-solid-svg-icons'

const deviceWidth = Dimensions.get('window').width

const MainPage = () => {
  const navigation = useNavigation(),
    [tutorial, setTutorial] = useState<boolean>(undefined)

  useEffect(
    () => {
      if (tutorial === false)
        (navigation.navigate as any)('Login')
    },
    [tutorial]
  )

  useFocusEffect(
    useCallback(
      () => {
        const init = async () => {
          const hasSeenTutorial = await AsyncStorage.getItem('seenTutorial')
          if (hasSeenTutorial) setTutorial(false)
          else setTutorial(true)
        }

        init()
          .catch(console.error)
      },
      []
    )
  )

  return typeof tutorial === 'boolean' ? (
    tutorial ? (
      <View style={{ height: '100%' }}>
        <ScrollView
          pagingEnabled={true}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <SafeAreaView
            style={
              {
                width: deviceWidth,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
                gap: 8
              }
            }
          >
            <Image
              source={require('../../../assets/services.png')}
              style={
                {
                  resizeMode: 'contain',
                  width: '100%',
                  height: 512
                }
              }
            />

            <Text.Label
              font='Highman'
              size={32}
              color={Constants.Colors.All.main}
            >
              Wide Variety Of Services
            </Text.Label>
  
            <Text.Label
              align='center'
              size={14}
              color={Constants.Colors.Text.secondary}
            >
              Explore our different variety of services best for your needs.
            </Text.Label>

            <View
              style={
                {
                  position: 'absolute',
                  bottom: 0,
                  padding: 32
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={14}
                style='italic'
              >
                Swipe to continue
              </Text.Label>
            </View>
          </SafeAreaView>
  
          <SafeAreaView
            style={
              {
                width: deviceWidth,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
                gap: 8
              }
            }
          >
            <Image
              source={require('../../../assets/fast.png')}
              style={
                {
                  resizeMode: 'contain',
                  width: '100%',
                  height: 512
                }
              }
            />

            <Text.Label
              font='Highman'
              size={32}
              color={Constants.Colors.All.main}
            >
              Fast Delivery
            </Text.Label>
  
            <Text.Label
              align='center'
              size={14}
              color={Constants.Colors.Text.secondary}
            >
              Fast delivery within a reasonable amount of time of ordering.
            </Text.Label>

            <View
              style={
                {
                  position: 'absolute',
                  bottom: 0,
                  padding: 32
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={14}
                style='italic'
              >
                Swipe to continue
              </Text.Label>
            </View>
          </SafeAreaView>
  
          <SafeAreaView
            style={
              {
                width: deviceWidth,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
                gap: 32
              }
            }
          >
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%'
                }
              }
            >
              <Image
                source={require('../../../assets/fee.png')}
                style={
                  {
                    resizeMode: 'contain',
                    width: '100%',
                    height: 512
                  }
                }
              />

              <Text.Label
                font='Highman'
                size={32}
                color={Constants.Colors.All.main}
              >
                Low Delivery Fees
              </Text.Label>
  
              <Text.Label
                align='center'
                size={14}
                color={Constants.Colors.Text.secondary}
              >
                Low delivery fees to keep not that much of a convenience to customers.
              </Text.Label>
            </View>
  
            <Display.Button
              inverted={
                {
                  color: Constants.Colors.Text.green
                }
              }
              onPress={
                () => {
                  AsyncStorage.setItem('seenTutorial', 'true');
                  (navigation.navigate as any)('Login')
                }
              }
              text={
                { content: 'Proceed to Login', reverse: true }
              }
              icon={faSignIn}
            />
          </SafeAreaView>
        </ScrollView>
      </View>
    ) : null
  ) : (
    <View
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1
        }
      }
    >
      <ActivityIndicator
        size={32}
        color={Constants.Colors.All.main}
      />
    </View>
  )
}

export default MainPage