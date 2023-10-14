import { Constants } from 'app-types'
import { Animated, Easing, StyleProp, TextInput, TextStyle, View, ViewStyle } from 'react-native'
import * as Text from '../Text'
import { Component, useRef } from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome'

interface InvertedProps {
  color: string
}

interface FormProperties {
  placeholder?: string
  value?: string
  disabled?: boolean
  left?: React.ReactNode
  fullWidth?: boolean // defaults to true
  fontSize?: number
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<TextStyle>
  leftStyle?: StyleProp<ViewStyle>
  placeholderColor?: string
  textColor?: string
  leftIcon?: IconProp
  leftIconSize?: number

  // checks
  numberOnly?: boolean
  maxLength?: number
  password?: boolean

  inverted?: InvertedProps

  onValue?: (value: string) => void
  onSubmit?: () => void
}

class IconClass extends Component<Props> {
  public render() {
    return (
      <FontAwesomeIcon {...this.props} />
    )
  }
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput),
  AnimatedIcon = Animated.createAnimatedComponent(IconClass)

const Form = (props: FormProperties) => {
  const value = useRef(new Animated.Value(0)).current

  return (
    <View
      style={
        {
          display: 'flex',
          flexDirection: 'row',
          ...(props.containerStyle as any ?? {})
        }
      }
    >
      {
        props.left || props.leftIcon ? (
          <Animated.View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: props.inverted ? (
                  value.interpolate(
                    {
                      inputRange: [0, 1],
                      outputRange: [props.inverted.color, 'transparent']
                    }
                  )
                ) : 'lightgrey',
                flexBasis: '20%',
                backgroundColor: props.inverted ? (
                  value.interpolate(
                    {
                      inputRange: [0, 1],
                      outputRange: ['transparent', props.inverted.color]
                    }
                  )
                ) : '#e8edee',
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                borderRightWidth: 0,
                ...(props.leftStyle as any ?? {})
              }
            }
          >
            {
              props.leftIcon ? (
                <AnimatedIcon
                  size={props.leftIconSize ?? 20}
                  icon={props.leftIcon}
                  color={
                    props.inverted ? (
                      value.interpolate(
                        {
                          inputRange: [0, 1],
                          outputRange: [props.inverted.color, Constants.Colors.Text.alt]
                        }
                      )
                    ) : Constants.Colors.Text.alt
                  }
                />
              ) : null
            }

            {
              typeof props.left === 'string' ? (
                <Text.Label
                  weight='bold'
                  color={Constants.Colors.Text.tertiary}
                >
                  {props.left}
                </Text.Label>
              ) : props.left
            }
          </Animated.View>
        ) : null
      }

      <AnimatedTextInput
        onSubmitEditing={props.onSubmit}
        placeholder={props.placeholder}
        value={props.value}
        onFocus={
          () => Animated.timing(
            value,
            {
              easing: Easing.ease,
              duration: 100,
              useNativeDriver: false,
              toValue: 1
            }
          ).start()
        }
        onBlur={
          () => Animated.timing(
            value,
            {
              easing: Easing.ease,
              duration: 100,
              useNativeDriver: false,
              toValue: 0
            }
          ).start()
        }
        style={
          {
            borderWidth: 1,
            borderColor: props.inverted ? (
              value.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [props.inverted.color, 'transparent']
                }
              )
            ) : 'lightgrey',
            paddingHorizontal: 18,
            paddingVertical: 8,
            backgroundColor: props.inverted ? (
              value.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: ['transparent', props.inverted.color]
                }
              )
            ) : '#e8edee', // todo: add to color palette
            fontSize: props.fontSize ?? 16,
            color: props.inverted ? (
              value.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [props.inverted.color, Constants.Colors.Text.alt]
                }
              )
            ) : Constants.Colors.Text.secondary,
            width: typeof props.fullWidth !== 'boolean' ? '100%' : (
              props.fullWidth ? '100%' : undefined
            ),
            ...(
              props.left || props.leftIcon ? (
                {
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                  borderLeftWidth: 0,
                  flexBasis: '80%'
                }
              ) : (
                { borderRadius: 12 }
              )
            ),
            ...(props.style as any ?? {})
          }
        }
        keyboardType={
          props.numberOnly ?
            'number-pad' :
            'default'
        }
        onChangeText={
          (text: string) => {
            if (typeof props.onValue !== 'function') return
            else props.onValue(text)
          }
        }
        maxLength={props.maxLength}
        secureTextEntry={props.password}
        selectTextOnFocus={!props.disabled}
        editable={!props.disabled}
        placeholderTextColor={
          props.placeholderColor ? (
            props.inverted ? (
              value.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [props.inverted.color, props.placeholderColor]
                }
              )
            ) : 'lightgrey'
          ) : undefined
        }
      />
    </View>
  )
}

export default Form