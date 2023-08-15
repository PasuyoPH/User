import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Pressable, View } from 'react-native'
import { Constants, App } from 'app-types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import * as Text from '../Text'

interface ExtraBottomBarProps {
  arrows?: boolean
  allowLift?: boolean
  label?: boolean
  items: App.PageItem[]
}

const BottomBar = (props: BottomTabBarProps & ExtraBottomBarProps) => (
  <View
    style={
      {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: Constants.Colors.Layout.secondary
      }
    }
  >
    {
      props.items.map(
        (item, idx) => {
          const focused = props.state.index === idx

          return item.nav ? (
            <Pressable
              onPress={
                item.nav.to ?
                  () => props.navigation.navigate(item.nav.to) :
                  undefined
              }
              key={idx}
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: item.nav.bg ?? 'unset',
                  ...(
                    props.allowLift && item.nav.lift ? (
                      {
                        top: -32,
                        borderRadius: 100,
                        elevation: 4
                      }
                    ) : (
                      { flex: 1 }
                    )
                  )
                }
              }
            >
              {
                item.nav.icon ? (
                  <FontAwesomeIcon
                    icon={item.nav.icon}
                    color={
                      item.nav.color ? item.nav.color : (
                        focused ?
                          Constants.Colors.Layout.main :
                          Constants.Colors.Text.secondary
                      )
                    }
                    size={18}
                  />
                ) : null
              }

              {
                props.label && item.nav.label ? (
                  <Text.Label
                    color={
                      item.nav.color ? item.nav.color : (
                        focused ?
                          Constants.Colors.Layout.main :
                          Constants.Colors.Text.secondary
                      )
                    }
                    size={12}
                    weight='bold'
                  >
                    {item.nav.label}
                  </Text.Label>
                ) : null
              }

              {
                props.arrows &&
                  focused ? (
                    props.allowLift && item.nav.lift ? null : (
                      <View
                        style={
                          {
                            position: 'absolute',
                            bottom: 0
                          }
                        }
                      >
                        <FontAwesomeIcon
                          icon={faCaretUp}
                          color={Constants.Colors.Layout.main}
                        />
                      </View>
                    )
                  ) : null
              }
            </Pressable>
          ) : null
        }
      )
    }
  </View>
)

export default BottomBar