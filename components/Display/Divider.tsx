import { Constants } from 'app-types'
import { View } from 'react-native'

interface DividerProps {
  color?: string
  width?: number,
  vertical?: boolean
  length?: string | number
}

const Divider = (props: DividerProps) => (
  <View
    style={
      {
        display: 'flex',
        flexDirection: 'row',
        [props.vertical ? 'height' : 'width']: props.length ?? '100%'
      }
    }
  >
    <View
      style={
        {
          [props.vertical ? 'height' : 'width']: '100%',
          borderWidth: props.width ?? .3,
          borderColor: props.color ?? Constants.Colors.Layout.secondary
        }
      }
    />
  </View>
)

export default Divider