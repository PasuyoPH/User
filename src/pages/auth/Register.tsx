import { useState } from 'react'
import { NativeAppEventEmitter, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Display, Form, Text } from '../../../components'
import Button from '../../../components/Form/Button'
import { Http } from 'app-structs'
import * as Types from 'app-types'
import { faEnvelope, faSignIn, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const RegisterPage = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>(null),
    [pinCode, setPinCode] = useState<string>(null),
    [name, setName] = useState<string>(),
    [promo, setPromo] = useState<string>(),
    [email, setEmail] = useState<string>(),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    [http, _] = useState(
      new Http.Client()
    )
  
  const onPressRegister = async () => {
    setResult([false, ''])

    const res = await http.request<string>(
      {
        method: 'post',
        url: Types.Constants.Url.Routes.AUTH,
        data: {
          data: {
            fullName: name,
            email,
            referral: promo,
            phone: phoneNumber,
            pin: pinCode
          }
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
      <Text.Header
        color={Types.Constants.Colors.Text.tertiary}
        size={24}
        weight='bold'
      >
        Create your account
      </Text.Header>

      <View
        style={
          {
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              marginHorizontal: 32,
              width: '100%',
              gap: 10
            }
          }
        >
          <Form.Input
            placeholder='9XXXXXXXXX'
            left={'+63'}
            value={phoneNumber}
            onValue={setPhoneNumber}
            numberOnly
            style={{ flexBasis: '40%' }}
          />

          <Form.Input
            value={pinCode}
            onValue={setPinCode}
            placeholder='Pin Code'
            numberOnly
            maxLength={4}
            password
            style={{ flexBasis: '40%' }}
          />
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              marginHorizontal: 32,
              width: '100%',
              gap: 10
            }
          }
        >
          <Form.Input
            placeholder='Full Name'
            left={
              <FontAwesomeIcon
                icon={faUser}
              />
            }
            value={name}
            onValue={setName}
            style={{ flexBasis: '40%' }}
          />

          <Form.Input
            value={promo}
            onValue={setPromo}
            placeholder='Promo Code'
            style={{ flexBasis: '40%' }}
          />
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              marginHorizontal: 32,
              width: '100%',
              gap: 10
            }
          }
        >
          <Form.Input
            placeholder='Email Address'
            left={
              <FontAwesomeIcon
                icon={faEnvelope}
              />
            }
            value={email}
            onValue={setEmail}
          />
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 32
            }
          }
        >
          <Display.Button
            onPress={onPressRegister}
            text={{ content: 'Register', reverse: true }}
            icon={faSignIn}
            inverted={
              { color: Types.Constants.Colors.Text.main }
            }
            style={{ width: '100%' }}
          />
        </View>

        {
          message ? (
            <View
              style={{ marginHorizontal: 32 }}
            >
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
            </View>
          ) : null
        }
      </View>
    </SafeAreaView>
  )
}

export default RegisterPage