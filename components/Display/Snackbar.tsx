import { Portal } from '@gorhom/portal'
import Animated, { FadeOut, SlideInDown } from 'react-native-reanimated'
import React from 'react'
import { View } from 'react-native'
import * as Text from '../Text'
import useStateRef from 'react-usestateref'
import { Constants } from 'app-types'

type AddToSnacbkarFn = (content: string, type?: SnackbarTypes) => void

enum SnackbarTypes {
  INFO,
  DANGER,
  SUCCESS
}

interface SnackbarElement {
  content: string
  key: number
  type?: SnackbarTypes
}  

const useSnackbar: () => [AddToSnacbkarFn, React.ReactNode] = () => {
  const [_, setElements, elements] = useStateRef<SnackbarElement[]>([]),
    [__, setKey, key] = useStateRef(0)

  const addElement: AddToSnacbkarFn = (content: string, type?: SnackbarTypes) => {
      if (elements.current.length >= 5)
        elements.current.shift()

      const newKey = key.current + 1

      setElements(
        () => [
          ...elements.current,
          {
            content,
            key: newKey,
            type: type ?? SnackbarTypes.INFO
          }
        ]
      )
      setKey(newKey)

      setTimeout(
        () => {
          setElements(
            () => elements.current.filter(
              (data) => data.key !== newKey
            )
          )
        },
        2500
      )
    },
    convertTypeToColor = (data: SnackbarElement) => {
      switch (data.type) {
        case SnackbarTypes.INFO:
          return [Constants.Colors.All.lightBlue, Constants.Colors.Text.alt]

        case SnackbarTypes.DANGER:
          return [Constants.Colors.Text.danger, Constants.Colors.Text.alt]

        case SnackbarTypes.SUCCESS:
          return [Constants.Colors.Text.green, Constants.Colors.Text.alt]

        default:
          return []
      }
    }

  return [
    addElement,
    elements.current.length < 1 ?
      null : (
        <Portal>
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                justifyContent: 'center',
                width: '80%',

                // positioning
                bottom: 0,
                zIndex: 2,
                margin: 32,
                gap: 16
              }
            }
          >
            {
              elements.current.map(
                (element, idx) => {
                  const [bgColor, textColor] = convertTypeToColor(element)

                  return (
                    <Animated.View
                      entering={SlideInDown}
                      exiting={FadeOut}
                      key={idx}
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: bgColor,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          borderRadius: 10,
                          elevation: 4
                        }
                      }
                    >
                      <Text.Label
                        color={textColor}
                        size={14}
                      >
                        {element.content}
                      </Text.Label>
                    </Animated.View>
                  )
                }
              )
            }
          </View>
        </Portal>
      )
  ]
}

export default useSnackbar
export { SnackbarTypes }