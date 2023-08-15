import { Constants } from 'app-types'
import { Text } from 'react-native'

interface LabelProps {
  font?: string
  children?: string[] | string
  size?: number
  color?: string
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  style?: 'normal' | 'italic'
  align?: "auto" | "left" | "right" | "center" | "justify"
}

const Label = (props: LabelProps) => (
  <Text
    style={
      {
        fontFamily: props.font,
        fontSize: props.size ?? 16,
        color: props.color ?? Constants.Colors.Text.primary,
        fontWeight: props.weight ?? 'normal',
        fontStyle: props.style ?? 'normal',
        textAlign: props.align
      }
    }
  >
    {props.children}
  </Text>
)

export default Label