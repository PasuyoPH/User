import { View, Pressable, Image, NativeAppEventEmitter } from 'react-native'
import * as Text from '../Text'
import Button from './Button'
import Modal from './Modal'
import { Account, App, Constants } from 'app-types'
import { faHeart, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// images
import BurgerSvg from '../../assets/burger.svg'

interface HeaderProps {
  hideFavourites?: boolean
}

const Header = (user: Account.UserAccountData & HeaderProps) => {
  const navigation = useNavigation(),
    [modalShown, setModalShown] = useState(false)

  return (
    <>
      <Modal
        show={modalShown}
        onDismiss={
          () => setModalShown(false)
        }
        container={
          {
            style: { marginHorizontal: 32 },
            paddingHorizontal: 16
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }
          }
        >
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4
              }
            }
          >
            <FontAwesomeIcon
              icon={faRefresh}
              size={24}
              color={Constants.Colors.Text.tertiary}
            />

            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={18}
            >
              Switch app mode
            </Text.Label>
          </View>

          { /* list of app modes */ }
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column'
              }
            }
          >
            <Button
              ripple
              bg='transparent'
              style={
                {
                  justifyContent: 'flex-start'
                }
              }
              onPress={
                () => NativeAppEventEmitter.emit('switch-mode', App.AppModes.BILI)
              }
            >
              <View
                style={
                  { flexBasis: '20%' }
                }
              >
                <BurgerSvg
                  width={48}
                  height={48}
                />
              </View>
              
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    flexBasis: '80%'
                  }
                }
              >
                <Text.Header
                  weight='bold'
                  color={Constants.Colors.Text.tertiary}
                  size={18}
                >
                  PaBILI
                </Text.Header>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  size={14}
                >
                  Try out our order services, guaranteed a fast and cheap delivery for your orders.
                </Text.Label>
              </View>
            </Button>

            <Button
              ripple
              bg='transparent'
              style={
                { justifyContent: 'flex-start' }
              }
              onPress={
                () => NativeAppEventEmitter.emit('switch-mode', App.AppModes.DELIVER)
              }
            >
              <View
                style={
                  { flexBasis: '20%' }
                }
              >
                <Image
                  style={
                    { width: 48, height: 48 }
                  }
                  source={require('../../assets/delivery.png')}
                />
              </View>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    flexBasis: '80%'
                  }
                }
              >
                <Text.Header
                  weight='bold'
                  color={Constants.Colors.Text.tertiary}
                  size={18}
                >
                  PaDELIVER
                </Text.Header>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  size={14}
                >
                  Try our fast delivery services guaranteed to get your item to it's destination safely at a fair price.
                </Text.Label>
              </View>
            </Button>
          </View>
        </View>
      </Modal>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 32,
            gap: 32
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          }
        >
          <View style={{ flex: 1 }}>
            <Text.Header
              weight='bold'
              color={Constants.Colors.Text.tertiary}
              size={28}
            >
              Hi, {user.fullName.split(/ +/g)[0]}!
            </Text.Header>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16
              }
            }
          >
            <Button
              text={{ color: Constants.Colors.Layout.main }}
              icon={faRefresh}
              iconSize={24}
              bg='transparent'
              paddingHorizontal={0}
              paddingVertical={0}
              onPress={
                () => setModalShown(true)
              }
            />

            {
              user.hideFavourites ? null : (
                <Button
                  text={{ color: Constants.Colors.Text.danger }}
                  icon={faHeart}
                  iconSize={24}
                  onPress={
                    () => (navigation.navigate as any)('Favourites')
                  }
                  bg='transparent'
                  paddingHorizontal={0}
                  paddingVertical={0}
                />
              )
            }

            <Pressable
              style={
                { borderRadius: 100 }
              }
              onPress={
                () => (navigation.navigate as any)('Profile')
              }
            >
              <Image
                source={
                  { uri: 'https://scontent.fmnl8-3.fna.fbcdn.net/v/t39.30808-6/322113042_513339527267490_2630672777140286584_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeFiDSKfujbnrZc5hkj-9TuxPaFvLbhzZq09oW8tuHNmreiVqOBaNvtPKm8TzYDZoiuKz86RhfjaaUo3FTJP-j2r&_nc_ohc=y96BBpUC-PwAX-VoXl5&_nc_ht=scontent.fmnl8-3.fna&oh=00_AfAZgFAGFT89KQIrskQJGS5Tzp38ko_KslehTT4k_nQDZQ&oe=64F43E95' }
                }
                style={
                  {
                    width: 48,
                    height: 48,
                    borderWidth: 2,
                    borderRadius: 100,
                    borderColor: Constants.Colors.Layout.main
                  }
                }
              />
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
}

export default Header