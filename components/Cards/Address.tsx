import { faHouseChimney, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Address, Constants } from 'app-types'
import { Animated, Easing, Pressable, View } from 'react-native'
import * as Text from '../Text'
import * as Display from '../Display'
import { Http } from 'app-structs'
import { useRef } from 'react'

interface AddressCardProps {
  token: string
  address: Address.AddressData

  hideButtons?: boolean

  // callbacks, to be executed when their original fn is done & worked
  onDelete?: () => void
  onPress?: () => void // execute only when main card is clicked
}

const http = new Http.Client(),
  AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const AddressCard = (props: AddressCardProps) => {
  const animationValue = useRef(new Animated.Value(0)).current
  
  const deleteAddress = async () => {
    const result = await http.request(
      {
        method: 'delete',
        url: Constants.Url.Routes.ADDRESS(props.address.uid),
        headers: {
          Authorization: props.token
        }
      }
    )

    if (!result.error && typeof props.onDelete === 'function')
      props.onDelete()
  }

  return (
    // we can't use our buttons, we need to make new ones from scratch to support this custom design
    <AnimatedPressable
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: Constants.Colors.All.lightBlue,
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 12,
          gap: 8,
          transform: [
            {
              scale: animationValue.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [1, 1.01]
                }
              )
            }
          ]
        }
      }
      onPressIn={
        () => {
          Animated.timing(
            animationValue,
            {
              toValue: 1,
              duration: 100,
              easing: Easing.ease,
              useNativeDriver: false
            }
          ).start()
        }
      }
      onPressOut={
        () => Animated.timing(
          animationValue,
          {
            toValue: 0,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: false
          }
        ).start()
      }
      onPress={props.onPress}
    >
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center'
          }
        }
      >
        <FontAwesomeIcon
          color={Constants.Colors.Text.alt}
          icon={faHouseChimney}
          size={22}
        />

        <Text.Label
          color={Constants.Colors.Text.alt}
          font='normal'
          weight='bold'
          size={20}
        >
          {props.address.template}
        </Text.Label>
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }
        }
      >
        <Text.Label
          font='normal'
          size={12}
          color={Constants.Colors.Layout.secondary}
          style='italic'
        >
          {props.address.landmark ?? 'No landmark available'}
        </Text.Label>

        <Text.Label
          font='normal'
          size={14}
          color={Constants.Colors.Layout.secondary}
        >
          {props.address.text}
        </Text.Label>
      </View>

      {
        props.hideButtons ? null : (
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 8
              }
            }
          >
            <Display.Button
              icon={faPenToSquare}
              bg={Constants.Colors.All.main}
              paddingHorizontal={8}
              paddingVertical={8}
              text={{ size: 10 }}
            />

            <Display.Button
              icon={faTrash}
              bg={Constants.Colors.Text.danger}
              paddingHorizontal={8}
              paddingVertical={8}
              text={{ size: 10 }}
              onPress={deleteAddress}
            />
          </View>
        )
      }
    </AnimatedPressable>
  )
}

export default AddressCard