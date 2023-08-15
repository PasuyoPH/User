import { Constants } from 'app-types'
import FloatingCard from './FloatingCard'
import { StyleProp, type ViewStyle } from 'react-native'

interface ThemedFloatingCardProps {
  radius?: number
  bg?: string
  bgOnHover?: string
  children?: React.ReactNode
  direction?: 'row' | 'column'
  hover?: boolean
  style?: StyleProp<ViewStyle>,
  emptyStyle?: boolean
}

const ThemedFloatingCard = (props: ThemedFloatingCardProps) => {
  return (
    <FloatingCard
      radius={props.radius ?? 50}
      style={
        {
          ...(
            !props.emptyStyle ? (
              {
                display: 'flex',
                flexDirection: props.direction ?? 'row',
                alignItems: 'center',
                gap: 16
              }
            ) : null
          ),
          ...(
            props.hover ? (
              { top: -12 }
            ) : {}
          ),
          ...(props.style as any ?? {})
        }
      }
      color={
        (
          props.hover ?
            props.bgOnHover :
            props.bg
        ) ?? Constants.Colors.All.mainDesaturated
      }
    >
      {props.children}
    </FloatingCard>
  )
}

export default ThemedFloatingCard