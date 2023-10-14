import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

interface IconButtonProps {
  color?: string
  size?: number
  icon: IconProp
  bg?: string
}

const IconButton = (props: IconButtonProps) => (
  <Button
    bg={props.bg}
    style={
      {
        paddingHorizontal: 12,
        paddingVertical: 12
      }
    }
  >
    <FontAwesomeIcon
      icon={props.icon}
      color={props.color}
      size={props.size ?? 16}
    />
  </Button>
)

export default IconButton