import { App, Constants } from 'app-types'
import { Display, Form, Text } from '../../../components'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft, faBox, faCreditCard, faMapMarkerAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

// todo: use get stats to get credits + orders

const ProfilePage = (user: App.UserAppData) => {
  const navigation = useNavigation()

  return (
    <SafeAreaView
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          paddingHorizontal: 36
        }
      }
    >
      <Display.Button
        icon={faAngleLeft}
      />
      
      { /* Header section */ }
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            borderBottomWidth: .5,
            borderColor: 'lightgrey',
            paddingVertical: 32
          }
        }
      >
        <Text.Label
          size={22}
          weight='bold'
        >
          {user.data.fullName}
        </Text.Label>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 8
            }
          }
        >
          <Display.FloatingCard
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                gap: 4,
                elevation: 0,
                borderColor: 'lightgrey',
                borderWidth: .5,
                paddingHorizontal: 16,
                paddingVertical: 4
              }
            }
            color={Constants.Colors.All.whiteSmoke}
            radius={100}
          >
            <FontAwesomeIcon
              icon={faBox}
              color={Constants.Colors.All.brown}
            />

            <Text.Label
              size={10}
              font='monospace'
            >
              0 orders
            </Text.Label>
          </Display.FloatingCard>

          <Display.FloatingCard
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                gap: 4,
                elevation: 0,
                borderColor: 'lightgrey',
                borderWidth: .5,
                paddingHorizontal: 16
              }
            }
            color={Constants.Colors.All.whiteSmoke}
            radius={100}
          >
            <FontAwesomeIcon
              icon={faCreditCard}
              color={Constants.Colors.Text.gold}
            />

            <Text.Label
              size={10}
              font='monospace'
            >
              ₱ 0.00
            </Text.Label>
          </Display.FloatingCard>
        </View>
      </View>

      { /* main body */ }
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 24,
            gap: 22
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }
          }
        >
          <Text.Label
            color={Constants.Colors.Text.primary}
          >
            Email Address
          </Text.Label>

          <Form.Input
            placeholder='Email Address'
            value={user.data.email}
          />
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }
          }
        >
          <Text.Label
            color={Constants.Colors.Text.primary}
          >
            Phone Number
          </Text.Label>

          <Form.Input
            placeholder='9XXXXXXXXX'
            left={'+63'}
            value={user.data.phone.slice(1)}
            numberOnly
          />
        </View>
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 22,
            gap: 8
          }
        }
      >
        <Display.Button
          bg={Constants.Colors.All.lightBlue}
          onPress={
            () => (navigation.navigate as any)('Addresses')
          }
          icon={faMapMarkerAlt}
          text={
            {
              content: 'My Addresses'
            }
          }
        />

        <Display.Button
          bg='transparent'
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              borderRadius: 16,
              padding: 0,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderColor: Constants.Colors.Text.danger,
              borderWidth: 1
            }
          }
          inverted={
            { color: Constants.Colors.Text.danger }
          }
          text={
            { content: 'Delete Account' }
          }
          icon={faTrash}
        />
      </View>
    </SafeAreaView>
  )
}

export default ProfilePage