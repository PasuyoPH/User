import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated'
import { Pressable, ViewStyle, StyleProp, ScrollView } from 'react-native'
import { Portal } from '@gorhom/portal'
import { Constants } from 'app-types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface ModalContainerProps {
  paddingHorizontal?: number
  paddingVertical?: number
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

interface ModalProps {
  show?: boolean
  children?: React.ReactNode
  onDismiss?: () => void

  // overriders
  container?: ModalContainerProps
}

const Modal = (props: ModalProps) => {
  return props.show ? (
    <Portal>
      <AnimatedPressable
        entering={FadeIn}
        exiting={FadeOut}
        style={
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
        onPress={props.onDismiss}
      >
        <AnimatedPressable
          entering={SlideInDown}
          exiting={FadeOut}
          style={
              {
              backgroundColor: Constants.Colors.Layout.primary,
              borderRadius: props.container?.borderRadius ?? 10,
              display: 'flex',
              flexDirection: 'row',
              ...(props.container?.style as any ?? {}),
            }
          }
        >
          <ScrollView
            contentContainerStyle={
              {
                paddingHorizontal: props.container?.paddingHorizontal ?? 32,
                paddingVertical: props.container?.paddingVertical ?? 16,
              }
            }
          >
            {props.children}
          </ScrollView>
        </AnimatedPressable>
      </AnimatedPressable>
    </Portal>
  ) : null
}

export default Modal