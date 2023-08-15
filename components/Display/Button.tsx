import { Constants } from 'app-types'
import { Pressable, type StyleProp, type ViewStyle } from 'react-native'
import * as Text from '../Text'

interface ButtonProps {
  style?: StyleProp<ViewStyle>
  bg?: string
  color?: string // text color
  children?: string | React.ReactNode
  onPress?: () => void
}

const Button = (props: ButtonProps) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={
        {
          borderRadius: 20,
          paddingHorizontal: 24,
          paddingVertical: 8,
          backgroundColor: props.bg ?? Constants.Colors.All.mainDesaturated,
          ...(props.style as any ?? {})
        }
      }
    >
      {
        typeof props.children === 'string' ? (
          <Text.Label
            weight='bold'
            color={props.color ?? Constants.Colors.Text.alt}
          >
            {props.children}
          </Text.Label>
        ) : props.children
      }
    </Pressable>
  )
}

export default Button