import { Constants } from 'app-types'
import * as Text from '../Text'
import FloatingCard from './FloatingCard'

interface TagProps {
  text: string
  size?: number
  bold?: boolean
  color?: string
}

const Tag = (props: TagProps) => (
  <FloatingCard
    color={Constants.Colors.Layout.primary}
    style={
      { padding: 4, elevation: 1 }
    }
    radius={4}
  >
    <Text.Label
      size={props.size ?? 12}
      weight={props.bold ? 'bold' : 'normal'}
      color={props.color ?? Constants.Colors.Text.secondary}
    >
      {props.text.toUpperCase()}
    </Text.Label>
  </FloatingCard>
)

export default Tag