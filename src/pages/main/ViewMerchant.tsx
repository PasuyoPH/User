import { PageProps, UserAppData } from 'app-types/src/app'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { Constants, Merchant } from 'app-types'
import { Http } from 'app-structs'
import { Image, View, ScrollView, NativeAppEventEmitter } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { SnackbarTypes, colorIsLight } from '../../../components/Display'
import { Display, Text } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { combineAddress } from '../../../components/Text'

const http = new Http.Client()

const ViewMerchantPage = (props: PageProps & UserAppData) => {
  const [merchant, setMerchant] = useState<Merchant.FullMerchantData>(undefined),
    [isScrolling, setIsScrolling] = useState(false),
    { uid } = props.route.params as { uid: string },
    navigation = useNavigation(),
    [addToSnackbar, snackbarContent] = Display.useSnackbar()

  useFocusEffect(
    useCallback(
      () => {
        const getMerchantInfo = async () => {
          const res = await http.request<Merchant.FullMerchantData>(
            {
              method: 'get',
              url: Constants.Url.Routes.MERCHANT_DATA(uid),
              headers: {
                Authorization: props.token
              }
            }
          )

          setMerchant(res.value)
        }

        getMerchantInfo()
          .catch(console.error)
      },
      []
    )
  )

  return merchant ? (
    <>
      <StatusBar
        backgroundColor={merchant.data.accent ?? Constants.Colors.All.main}
        style={
          colorIsLight(merchant.data.accent) ?
            'dark' :
            'light'
        }
      />

      <SafeAreaView
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }
          }
        >
          <Image
            source={
              { uri: merchant.data.banner }
            }
            style={
              {
                width: '100%',
                minHeight: 192,
                position: 'absolute'
              }
            }
          />

          <View
            style={
              {
                width: '100%',
                minHeight: 192,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                position: 'absolute',
                zIndex: 1
              }
            }
          />

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 192,
                paddingHorizontal: 32,
                zIndex: 2,
                gap: 16
              }
            }
          >
            <Text.Header
              color={Constants.Colors.Text.alt}
              weight='bold'
              size={28}
            >
              {merchant.data.name}
            </Text.Header>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'center'
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.alt}
                size={14}
                style='italic'
              >
                {
                  merchant.address ?
                    combineAddress(merchant.address) :
                    'No address found'
                }
              </Text.Label>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                    alignItems: 'center'
                  }
                }
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  color={Constants.Colors.Layout.danger}
                />

                <Text.Label
                  color={Constants.Colors.Text.alt}
                  size={12}
                >
                  {(merchant.likes).toString()} Like{merchant.likes === 1 ? '' : 's'}
                </Text.Label>
              </View>
            </View>
          </View>
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingVertical: 16,
              flex: 1
            }
          }
        >
          {/*<View
            style={
              { paddingHorizontal: 16 }
            }
          >
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              weight='bold'
              size={20}
            >
              Sort By
            </Text.Label>
          </View>

          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8
                }
              }
              onScrollBeginDrag={() => setIsScrolling(true)}
              onScrollEndDrag={() => setIsScrolling(false)}
            >
              <Display.Button
                bg={merchant.data.accent}
                text={{ content: 'Available' }}
                borderRadius={100}
                inverted={
                  { color: merchant.data.accent }
                }
                disabled={isScrolling}
              />

              <Display.Button
                bg={merchant.data.accent}
                text={{ content: 'Recently Added' }}
                borderRadius={100}
                inverted={
                  { color: merchant.data.accent }
                }
                disabled={isScrolling}
              />

              <Display.Button
                bg={merchant.data.accent}
                text={{ content: 'Low Budget' }}
                borderRadius={100}
                inverted={
                  { color: merchant.data.accent }
                }
                disabled={isScrolling}
              />

              <Display.Button
                bg={merchant.data.accent}
                text={{ content: 'High Budget' }}
                borderRadius={100}
                inverted={
                  { color: merchant.data.accent }
                }
                disabled={isScrolling}
              />
            </ScrollView>
          </View>*/}

          <View
            style={
              { paddingHorizontal: 16 }
            }
          >
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              weight='bold'
              size={20}
            >
              All Available Products
            </Text.Label>
          </View>

          <View
            style={
              { flex: 1 }
            }
          >
            <ScrollView
              contentContainerStyle={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: 16,
                  
                }
              }
            >
              {
                merchant.items.map(
                  (item, idx) => (
                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }
                      }
                      key={idx}
                    >
                      <View
                        style={
                          {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 8,
                            flexBasis: '60%'
                          }
                        }
                      >
                        <Image
                          source={
                            { uri: item.image ?? '' }
                          }
                          style={
                            {
                              width: 64,
                              height: 64,
                              resizeMode: 'contain'
                            }
                          }
                        />

                        { /* Divider */ }
                        <View 
                          style={
                            {
                              width: 1,
                              height: '100%',
                              backgroundColor: 'lightgrey'
                            }
                          }
                        />

                        <View
                          style={
                            {
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }
                          }
                        >
                          <View
                            style={
                              {
                                display: 'flex',
                                flexDirection: 'column'
                              }
                            }
                          >
                            <Text.Label
                              weight='bold'
                              color={Constants.Colors.Text.tertiary}
                              size={18}
                            >
                              {item.name}
                            </Text.Label>
                          </View>
                          
                          <Text.Label
                            color={Constants.Colors.Text.green}
                            font='monospace'
                            size={12}
                          >
                            ₱{(item.price + (item.price * .15)).toFixed(2)}
                          </Text.Label>

                          <Text.Label
                            color={Constants.Colors.All.lightBlue}
                            size={12}
                          >
                            {(item.eta ?? 0).toString()} minutes
                          </Text.Label>

                          <Text.Label
                            color={
                              item.available ?
                                Constants.Colors.Text.green :
                                Constants.Colors.Text.danger
                            }
                            size={12}
                          >
                            {
                              item.available ?
                                'Available' :
                                'Unavailable'
                            }
                          </Text.Label>
                        </View>
                      </View>

                      <View
                        style={
                          { flexBasis: '15%' }
                        }
                      >
                        <Display.Button
                          icon={faShoppingCart}
                          iconSize={16}
                          paddingHorizontal={16}
                          paddingVertical={16}
                          bg={
                            item.available ? (
                              props.cart.has(item.uid) ?
                                Constants.Colors.Text.danger :
                                Constants.Colors.Text.green
                            ) : Constants.Colors.Text.secondary
                          }
                          onPress={
                            () => {
                              if (!item.available)
                                return addToSnackbar(item.name + ' is currently unavailable.', SnackbarTypes.INFO)

                              if (props.cart.has(item.uid)) {
                                props.cart.delete(item.uid)
                                addToSnackbar(item.name + ' removed from cart.', SnackbarTypes.DANGER)
                              } else {
                                props.cart.set(item.uid, { quantity: 1 })
                                addToSnackbar(item.name + ' added to cart.', SnackbarTypes.SUCCESS)
                              }

                              NativeAppEventEmitter.emit('set-cart', props.cart)
                            }
                          }
                        />
                      </View>
                    </View>
                  )
                )
              }
            </ScrollView>
          </View>
        </View>

        <View
          style={
            { padding: 16 }
          }
        >
          <Display.Button
            bg={merchant.data.accent ?? Constants.Colors.All.main}
            text={
              { content: 'Proceed to Checkout' }
            }
            inverted={
              { color: merchant.data.accent ?? Constants.Colors.All.main }
            }
            onPress={
              () => (navigation.navigate as any)('Checkout')
            }
          />
        </View>

        {snackbarContent}
      </SafeAreaView>
    </>
  ) : null
}

export default ViewMerchantPage