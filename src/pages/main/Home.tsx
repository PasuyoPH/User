import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '../../../components'
import { Constants, Items, Merchant } from 'app-types'
import { View, ScrollView, Image, Pressable } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBowlFood, faBurger, faConciergeBell, faHeart, faIceCream, faMagnifyingGlass, faPizzaSlice, faPlus } from '@fortawesome/free-solid-svg-icons'
import ThemedFloatingCard from '../../../components/Display/ThemedFloatingCard'
import { faClockFour } from '@fortawesome/free-regular-svg-icons'
import { Display } from '../../../components'
import { UserAppData } from 'app-types/src/app'
import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import { FloatingCard } from '../../../components/Display'

const http = new Http.Client()

const HomePage = (user: UserAppData) => {
  const [recommended, setRecommended] = useState<Merchant.MerchantData[]>(undefined),
    [newestItems, setNewestItems] = useState<Items.Item[]>(undefined),
    navigation = useNavigation()

  useFocusEffect(
    useCallback(
      () => {
        // fetch recommended list
        const getRecommendedList = async () => {
            if (!user.token) return

            const res = await http.request<Merchant.MerchantData[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.USER_MERCHANT_RECOMMENDED,
                headers: {
                  Authorization: user.token
                }
              }
            )

            console.log('[INFO]: Received recommended merchants:', res.value)
            setRecommended(res.value ?? [])
          },
          getNewestItems = async () => {
            if (!user.token) return

            const res = await http.request<Items.Item[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.ITEMS_NEW,
                headers: {
                  Authorization: user.token
                }
              }
            )

            console.log('[INFO]: Received newest items:', res.value)
            setNewestItems(res.value ?? [])
          }

        getRecommendedList()
          .catch(console.error)

        getNewestItems()
          .catch(console.error)
      },
      []
    )
  )

  useEffect(
    () => {
      console.log('Cart changed')
    },
    [user.cart]
  )

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 8,
            gap: 32
          }
        }
      >
        { /* Main header */ }
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
                Hi, {user.data.fullName.split(/ +/g)[0]}!
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
              <FontAwesomeIcon
                icon={faPlus}
                color={Constants.Colors.Layout.main}
                size={24}
              />

              <FontAwesomeIcon
                icon={faHeart}
                color={Constants.Colors.Layout.danger}
                size={24}
              />

              <Image
                source={
                  { uri: 'https://scontent.fmnl8-2.fna.fbcdn.net/v/t39.30808-6/322113042_513339527267490_2630672777140286584_n.jpg?_nc_cat=105&cb=99be929b-59f725be&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeFiDSKfujbnrZc5hkj-9TuxPaFvLbhzZq09oW8tuHNmreiVqOBaNvtPKm8TzYDZoiuKz86RhfjaaUo3FTJP-j2r&_nc_ohc=mBqiZPw2AWcAX8SdDOO&_nc_ht=scontent.fmnl8-2.fna&oh=00_AfCJbQdFu_xqnwQXGOTdVchhB02f5-LbsBIevN9C4M8_VA&oe=64DE7DD5' }
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
            </View>
          </View>

          {
            user.cart.size > 0 ? (
              <FloatingCard
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }
                }
                color={Constants.Colors.Text.gold}
              >
                <Text.Label
                  color={Constants.Colors.Text.tertiary}
                >
                  Seems like you have items in your cart.
                </Text.Label>

                <View style={{ flexDirection: 'row' }}>
                  <Display.Button
                    bg={Constants.Colors.Text.tertiary}
                    onPress={
                      () => (navigation.navigate as any)('Checkout')
                    }
                  >
                    Checkout
                  </Display.Button>
                </View>
              </FloatingCard>
            ) : null
          }

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }
            }
          >
            <Text.Label color={Constants.Colors.Text.tertiary}>
              What do you want to order today?
            </Text.Label>

            <ThemedFloatingCard>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                color={Constants.Colors.Text.alt}
                size={24}
              />

              <Text.Label
                size={14}
                color={Constants.Colors.Text.alt}
              >
                Search...
              </Text.Label>
            </ThemedFloatingCard>
          </View>
        </View>

        { /* filters */ }
        <ScrollView
          horizontal
          snapToAlignment='start'
          snapToInterval={200}
          decelerationRate={0}
          contentContainerStyle={
            {
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              paddingLeft: 32,
              paddingVertical: 12,
            }
          }
          style={
            { marginRight: 8 }
          }
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4
              }
            }
          >
            <ThemedFloatingCard radius={20}>
              <FontAwesomeIcon
                icon={faConciergeBell}
                color={Constants.Colors.Text.alt}
                size={24}
              />
            </ThemedFloatingCard>
            
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={14}
            >
              All
            </Text.Label>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4
              }
            }
          >
            <ThemedFloatingCard radius={20} hover bgOnHover={Constants.Colors.Layout.green}>
              <FontAwesomeIcon
                icon={faPizzaSlice}
                color={Constants.Colors.Text.alt}
                size={24}
              />
            </ThemedFloatingCard>
            
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={14}
            >
              Pizza
            </Text.Label>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4
              }
            }
          >
            <ThemedFloatingCard radius={20}>
              <FontAwesomeIcon
                icon={faIceCream}
                color={Constants.Colors.Text.alt}
                size={24}
              />
            </ThemedFloatingCard>
            
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={14}
            >
              Ice Cream
            </Text.Label>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4
              }
            }
          >
            <ThemedFloatingCard radius={20}>
              <FontAwesomeIcon
                icon={faBurger}
                color={Constants.Colors.Text.alt}
                size={24}
              />
            </ThemedFloatingCard>
            
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={14}
            >
              Burger
            </Text.Label>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4
              }
            }
          >
            <ThemedFloatingCard radius={20}>
              <FontAwesomeIcon
                icon={faBowlFood}
                color={Constants.Colors.Text.alt}
                size={24}
              />
            </ThemedFloatingCard>
            
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={14}
            >
              Rice Bowl
            </Text.Label>
          </View>
        </ScrollView>
        
        { /* Recommended */ }
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 32,
              gap: 8
            }
          }
        >
          <Text.Header
            weight='bold'
            color={Constants.Colors.Text.tertiary}
            size={28}
          >
            Recommended
          </Text.Header>

          <ScrollView
            contentContainerStyle={
              {
                display: 'flex',
                flexDirection: 'row',
                gap: 8
              }
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={256 + 8}
            decelerationRate={0}
            snapToStart
          >
            {
              (recommended ?? []).map(
                (item, idx) => (
                  <Pressable
                    key={idx}
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 256,
                        gap: 8
                      }
                    }
                    onPress={
                      () => (navigation.navigate as any)(
                        'ViewMerchant',
                        { uid: item.uid }
                      )
                    }
                  >
                    <Image
                      source={
                        { uri: item.banner ?? '' }
                      }
                      style={
                        {
                          width: 256,
                          height: 128,
                          borderRadius: 10
                        }
                      }
                    />

                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column'
                        }
                      }
                    >
                      <View
                        style={
                          {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 4
                          }
                        }
                      >
                        <Text.Header
                          font='Roboto Condensed Bold'
                          color={Constants.Colors.Text.tertiary}
                          size={18}
                        >
                          {item.name}
                        </Text.Header>

                        <Text.Label
                          size={14}
                          color={Constants.Colors.Text.secondary}
                        >
                          - {
                            '₱'.repeat(
                              (item.priceLevels ?? 0) + 1
                            )
                          }
                        </Text.Label>

                        {
                          (item.tags ?? []).map(
                            (text, idx2) => (
                              <Display.Tag
                                key={idx2}
                                text={text}
                              />
                            )
                          )
                        }
                      </View>

                      <View
                        style={
                          {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8
                          }
                        }
                      >
                        <FontAwesomeIcon
                          icon={faClockFour}
                          color={Constants.Colors.Text.secondary}
                        />

                        <Text.Label
                          color={Constants.Colors.Text.secondary}
                        >
                          25 - 30 min
                        </Text.Label>
                      </View>
                    </View>
                  </Pressable>
                )
              )
            }
          </ScrollView>
        </View>

        { /* Recently Added */ }
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 32,
              gap: 8
            }
          }
        >
          <Text.Header
            weight='bold'
            color={Constants.Colors.Text.tertiary}
            size={28}
          >
            What's New?
          </Text.Header>

          <ScrollView
            contentContainerStyle={
              {
                display: 'flex',
                flexDirection: 'row',
                gap: 8
              }
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment='start'
            snapToInterval={200}
            decelerationRate={0}
          >
            {
              (newestItems ?? []).map(
                (item, idx) => (
                  <View
                    style={
                      { borderRadius: 10, overflow: 'hidden' }
                    }
                    key={idx}
                  >
                    <Pressable
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column',
                          maxWidth: 256,
                          gap: 4  
                        }
                      }
                      android_ripple={
                        { color: 'lightgrey' }
                      }
                      onPress={
                        () => (navigation.navigate as any)(
                          'ViewItem',
                          { uid: item.uid }
                        )
                      }
                    >
                      <Image
                        source={
                          { uri: item.banner ?? '' }
                        }
                        style={
                          {
                            width: 256,
                            height: 128,
                            borderRadius: 10
                          }
                        }
                      />

                      <View
                        style={
                          {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 4
                          }
                        }
                      >
                        <View
                          style={
                            {
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 8
                            }
                          }
                        >
                          <Text.Label
                            color={Constants.Colors.Text.tertiary}
                            font='Roboto Condensed Bold'
                            size={18}
                          >
                            {item.name}
                          </Text.Label>

                          <Text.Label
                            color={Constants.Colors.Text.green}
                            style='italic'
                            size={14}
                          >
                            ₱{item.price.toFixed(2)}
                          </Text.Label>
                        </View>

                        <Text.Label
                          color={Constants.Colors.Text.secondary}
                          font='Roboto Condensed Italic'
                          size={18}
                        >
                          Merchant Name
                        </Text.Label>
                      </View>
                    </Pressable>
                  </View>
                )
              )
            }
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomePage