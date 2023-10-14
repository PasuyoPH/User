import { Constants } from 'app-types'
import * as Display from '../Display'
import * as Text from '../Text'
import { Image, View, Pressable } from 'react-native'
import { RadioButton } from 'react-native-radio-buttons-group'

interface RadioButtonProps {
  index: number
  selected?: boolean
  onPress?: () => void

  // appearance
  name: string
  image?: string
}

const PaymentMethod = (props: RadioButtonProps) => {
  return (
    <Pressable
      onPress={props.onPress}
    >
      <Display.FloatingCard
        color={Constants.Colors.All.whiteSmoke}
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            elevation: 4
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 28
            }
          }
        >
          <Image
            source={
              { uri: props.image }
            }
            style={
              {
                width: 32,
                height: 32
              }
            }
          />

          <Text.Label
            color={Constants.Colors.Text.tertiary}
            font='Wolf Sans'
          >
            {props.name}
          </Text.Label>
        </View>

        <RadioButton
          id={props.index.toString()}
          selected={props.selected}
          color={Constants.Colors.Layout.tertiary}
          onPress={props.onPress}
        />
      </Display.FloatingCard>
    </Pressable>
  )
}

export default PaymentMethod