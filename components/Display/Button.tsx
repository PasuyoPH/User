import { Constants } from 'app-types'
import { Animated, Easing, Pressable, type StyleProp, type ViewStyle, type ImageURISource, Image } from 'react-native'
import * as Text from '../Text'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Component, useRef, useEffect } from 'react'
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome'
import { LabelProps } from '../Text/Label'
import useStateRef from 'react-usestateref'

class IconClass extends Component<Props> {
  public render() {
    return (
      <FontAwesomeIcon {...this.props} />
    )
  }
}

class TextLabelClass extends Component<LabelProps> {
  public render() {
    return <Text.Label {...this.props} />
  }
}

interface ImageProps {
  width?: number
  height?: number
  source?: ImageURISource
}

interface InvertedProps {
  color?: string // main color to use
  secondaryColor?: string
  forceFill?: boolean // whether or not to forcefully just fill this value ignoring all transitions
}

interface TextProps {
  color?: string
  size?: number
  content?: React.ReactNode
  reverse?: boolean
}

interface ButtonProps {
  style?: StyleProp<ViewStyle>

  // new props?
  onPress?: () => void
  onDoublePress?: () => void
  onPressIn?: () => void

  bg?: string
  ripple?: boolean

  icon?: IconProp
  text?: TextProps

  inverted?: InvertedProps
  image?: ImageProps // would replace text

  disabled?: boolean
  children?: React.ReactNode // using this would break inverted text
  
  // overrides
  borderRadius?: number
  paddingHorizontal?: number
  paddingVertical?: number
  iconSize?: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable),
  AnimatedIcon = Animated.createAnimatedComponent(IconClass),
  AnimatedText = Animated.createAnimatedComponent(TextLabelClass)

const Button = (props: ButtonProps) => {
  const animationValue = useRef(new Animated.Value(0)).current,
    [_, setLastPress, lastPressRef] = useStateRef(0)

  const animate = async (value: number) => {
    Animated.timing(
      animationValue,
      {
        toValue: value,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.ease
      }
    ).start()
  }

  useEffect(
    () => {
      Animated.timing(
        animationValue,
        {
          toValue: props.inverted?.forceFill ? 1 : 0,
          duration: 100,
          useNativeDriver: false,
          easing: Easing.ease
        }
      ).start()
    },
    [props.inverted?.forceFill]
  )

  return (
    <AnimatedPressable
      android_ripple={
        props.ripple ? (
          { color: Constants.Colors.Text.secondary }
        ) : null
      }
      pointerEvents={props.disabled ? 'none' : 'auto'}
      onPressIn={
        () => {
          if (typeof props.onPressIn === 'function')
            props.onPressIn()

          animate(1)
        }
      }
      onPressOut={
        async () => {
          //animationValue.stopAnimation()
          if (!props.inverted?.forceFill)
            animate(0)
        }
      }
      onPress={
        () => {
          if (typeof props.onDoublePress === 'function') {
            const delta = Date.now() - lastPressRef.current
            if (delta < 200)
              props.onDoublePress()

            setLastPress(Date.now())
          } else {
            if (typeof props.onPress === 'function')
              props.onPress()
          }
        }
      }
      style={
        {
          display: 'flex',
          flexDirection: props.text?.reverse ? 'row-reverse' : 'row',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: props.paddingHorizontal ?? 16,
          paddingVertical: props.paddingVertical ?? 12,
          transform: props.inverted ? [] : (
            [
              {
                scale: animationValue.interpolate(
                  {
                    inputRange: [0, 1],
                    outputRange: [1, 1.05]
                  }
                )
              }
            ]
          ),
          borderRadius: props.borderRadius ?? 12,
          borderWidth: props.inverted ? 1 : 0,
          borderColor: props.inverted ? (
            props.inverted.forceFill ? (
              props.inverted.secondaryColor ?? Constants.Colors.All.whiteSmoke
            ) : (
              animationValue.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [
                    props.inverted.color ?? Constants.Colors.All.main,
                    props.inverted.secondaryColor ?? Constants.Colors.All.whiteSmoke,
                  ]
                }
              )
            )
          ) : undefined,
          backgroundColor: props.inverted ? (
            props.inverted.forceFill ? (
              props.inverted.color ?? Constants.Colors.All.main
            ) : (
              animationValue.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [
                    props.inverted.secondaryColor ?? Constants.Colors.All.whiteSmoke,
                    props.inverted.color ?? Constants.Colors.All.main,
                  ]
                }
              )
            )
          ) : (
            props.bg ?? Constants.Colors.All.main
          ),
          ...(props.style as any ?? {})
        }
      }
    >
      {
        props.children ? (
          props.children
        ) : (
          <>
            {
              props.icon ? (
                <AnimatedIcon
                  icon={props.icon}
                  size={
                    props.iconSize ?? (props.text?.size ?? 16) + 2
                  }
                  color={
                    props.inverted ? (
                      props.inverted.forceFill ? (
                        props.text?.color ?? Constants.Colors.Text.alt
                      ) : (
                        animationValue.interpolate(
                          {
                            inputRange: [0, 1],
                            outputRange: [
                              props.inverted.color ?? Constants.Colors.All.main,
                              props.text?.color ?? Constants.Colors.Text.alt
                            ]
                          }
                        )
                      )
                    ) : (
                      props.text?.color ?? Constants.Colors.Text.alt
                    )
                  }
                />
              ) : null
            }

            {
              props.image ? (
                <Image
                  source={props.image.source}
                  style={
                    {
                      width: props.image.width ?? 32,
                      height: props.image.height ?? 32
                    }
                  }
                />
              ) : (
                props.text ? (
                  typeof props.text.content === 'string' ? (
                    <AnimatedText
                      size={props.text.size}
                      color={
                        props.inverted ? (
                          props.inverted.forceFill ? (
                            props.text?.color ?? Constants.Colors.Text.alt
                          ) : (
                            animationValue.interpolate(
                              {
                                inputRange: [0, 1],
                                outputRange: [
                                  props.inverted.color ?? Constants.Colors.All.main,
                                  props.text?.color ?? Constants.Colors.Text.alt
                                ]
                              }
                            )
                          )
                        ) : (
                          props.text.color ?? Constants.Colors.Text.alt
                        )
                      }
                    >
                      {props.text.content ?? ''}
                    </AnimatedText>
                  ) : ( props.text.content ?? null )
                ) : null
              )
            }
          </>
        )
      }
    </AnimatedPressable>
  )
}

export default Button
export { ButtonProps }