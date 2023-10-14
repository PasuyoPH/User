import { faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Constants } from 'app-types'
import { View } from 'react-native'
import { Display, Text } from '../../../components'
import { useNavigation } from '@react-navigation/native'

const ProcessedPage = () => {
  const navigation = useNavigation()

  return (
    <View
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 32,
          gap: 8
        }
      }
    >
      <FontAwesomeIcon
        icon={faCheckCircle}
        size={64}
        color={Constants.Colors.Text.green}
      />

      <Text.Label
        color={Constants.Colors.Text.secondary}
        size={14}
        align='center'
      >
        Your payment has been processed. Please watch for updates for your delivery.
      </Text.Label>

      <Display.Button
        text={
          { content: 'Proceed', reverse: true }
        }
        icon={faAngleRight}
        inverted={
          {
            color: Constants.Colors.All.main
          }
        }
        paddingVertical={8}
        borderRadius={100}
        onPress={
          () => (navigation.navigate as any)('Home')
        }
      />
    </View>
  )
}

export default ProcessedPage