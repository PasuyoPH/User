import { useState } from 'react'
import { NativeAppEventEmitter, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Display, Form, Text } from '../../../components'
import { Http } from 'app-structs'
import * as Types from 'app-types'
import { faQuestion, faSignIn } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>(null),
    [pinCode, setPinCode] = useState<string>(null),
    navigation = useNavigation(),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    [http, _] = useState(
      new Http.Client()
    )
  
  const onPressLogin = async () => {
    setResult([false, ''])

    const res = await http.request<string>(
      {
        method: 'post',
        url: Types.Constants.Url.Routes.AUTH_TOKEN,
        data: {
          phone: phoneNumber,
          pin: pinCode
        }
      }
    )

    setResult(
      [res.error, res.message]
    )

    if (!res.error)
      NativeAppEventEmitter.emit('token', res.value)
  }

  return (
    <SafeAreaView
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          gap: 64,
          height: '100%'
        }
      }
    >
      <Image
        source={require('../../../assets/pasuyo.png')}
        style={
          {
            width: '100%',
            height: 128 + (128 / 2),
            resizeMode: 'contain'
          }
        }
      />

      {/*<Text>
        Login PAGE
      </Text>*/}
      
      <View
        style={
          {
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8
          }
        }
      >
        <Form.Input
          placeholder='9XXXXXXXXX'
          left={'+63'}
          value={phoneNumber}
          onValue={setPhoneNumber}
          numberOnly
        />

        <Form.Input
          value={pinCode}
          onValue={setPinCode}
          placeholder='Pin Code'
          numberOnly
          maxLength={4}
          password
        />

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              gap: 8
            }
          }
        >
          <Display.Button
            onPress={
              () => (navigation.navigate as any)('Register')
            }
            text={{ content: 'No account', reverse: true }}
            icon={faQuestion}
            inverted={
              { color: Types.Constants.Colors.Text.danger }
            }
            style={{ flex: 1 }}
          />

          <Display.Button
            onPress={onPressLogin}
            text={{ content: 'Log in', reverse: true }}
            icon={faSignIn}
            inverted={
              { color: Types.Constants.Colors.Text.green }
            }
            style={{ flex: 1 }}
          />
        </View>

        {
          message ? (
            <Text.Label
              color={
                error ?
                  Types.Constants.Colors.Text.danger :
                  Types.Constants.Colors.Text.green
              }
              align='center'
              size={14}
            >
              Error: {message}
            </Text.Label>
          ) : null
        }
      </View>
    </SafeAreaView>
  )
}

export default LoginPage