import { Constants } from 'app-types'
import * as Display from '../Display'
import * as Text from '../Text'
import { Image, View, Pressable } from 'react-native'
import { RadioButton } from 'react-native-radio-buttons-group'
import { useEffect, useState } from 'react'
import UploadImage from './UploadImage'

interface CompletedProps {
  img?: string // url of image upon completion
}

interface RadioButtonProps {
  index: number
  selected?: boolean
  token: string // user token

  // appearance
  name: string
  image?: string
  requireImage?: boolean

  // callbacks
  onPress?: () => void
  onComplete?: (data: CompletedProps) => void // wait for this to be fired to continue the payment. This is instantly fired if no image is required, but if image required, this will be fired upon completion
}

const PaymentMethod = (props: RadioButtonProps) => {
  const [_, setImgUrl] = useState<string>(),
    [originalImg, setOriginalImg] = useState<string>(),
    [imageModalShown, setImageModalShown] = useState(false)

  useEffect(
    () => {
      if (!props.requireImage && typeof props.onComplete === 'function')
        props.onComplete({})
    },
    []
  )

  return (
    <>
      <Display.Modal
        show={imageModalShown}
        onDismiss={
          () => setImageModalShown(false)
        }
        container={
          {
            style: {
              margin: 32
            }
          }
        }
      >
        <UploadImage
          token={props.token}
          onUpload={
            (uri, original) => {
              setOriginalImg(original)
              setImgUrl(uri)

              setImageModalShown(false)

              if (typeof props.onComplete === 'function')
                props.onComplete({ img: uri })
            }
          }
        />
      </Display.Modal>
      
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column'
          }
        }
      >
        <Pressable
          onPress={props.onPress}
        >
          <Display.FloatingCard
            color={Constants.Colors.All.whiteSmoke}
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'space-between',
                elevation: 4
              }
            }
          >
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 28
                }
              }
            >
              <Image
                source={
                  { uri: props.image }
                }
                style={
                  {
                    width: 32,
                    height: 32
                  }
                }
              />

              <Text.Label
                color={Constants.Colors.Text.tertiary}
                font='Wolf Sans'
              >
                {props.name}
              </Text.Label>
            </View>

            <RadioButton
              id={props.index.toString()}
              selected={props.selected}
              color={Constants.Colors.Layout.tertiary}
              onPress={props.onPress}
            />
          </Display.FloatingCard>
        </Pressable>

        {
          props.requireImage && props.selected ? (
            <Pressable
              style={
                { marginTop: 16 }
              }
              onPress={
                () => setImageModalShown(true)
              }
            >
              {
                originalImg ? (
                  <Image
                    style={
                      {
                        width: '100%',
                        height: 196
                      }
                    }
                    source={{ uri: originalImg }}
                  />
                ) : (
                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 32,
                        width: '100%',
                        height: 196,
                        backgroundColor: Constants.Colors.Text.secondary + '80'
                      }
                    }
                  >
                    <Text.Label
                      color={Constants.Colors.Text.alt}
                      align='center'
                    >
                      Attach receipt of payment.
                    </Text.Label>
                  </View>
                )
              }
            </Pressable>
          ) : null
        }
      </View>
    </>
  )
}

export default PaymentMethod