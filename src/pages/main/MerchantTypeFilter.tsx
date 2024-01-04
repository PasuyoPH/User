import { App, Constants, Merchant } from 'app-types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, View } from 'react-native'
import { Display, Text } from '../../../components'
import { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

const http = new Http.Client(),
  dimensions = Dimensions.get('window'),
  imageHeight = Math.round(dimensions.width * 6 / 16)

const MerchantTypeFilterPage = (props: App.UserAppData & App.PageProps) => {
  const [merchants, setMerchants] = useState<Merchant.MerchantData[]>(),
    { type, name } = props.route.params as { type: number, name: string },
    navigation = useNavigation()

  const getMerchants = async () => {
    setMerchants(undefined)

    const result = await http.request<Merchant.MerchantData[]>(
      {
        method: 'get',
        url: Constants.Url.Routes.MERCHANT_TYPE(type),
        headers: {
          Authorization: props.token
        }
      }
    )

    setMerchants(result.value)
  }

  useFocusEffect(
    useCallback(
      () => {
        getMerchants()
          .catch(console.error)
      },
      []
    )
  )

  return (
    <SafeAreaView
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1
        }
      }
    >
      <Pressable
        style={
          {
            flexDirection: 'row',
            zIndex: 2,
            padding: 16
          }
        }
        onPress={
          () => (navigation.navigate as any)('Home')
        }
      >
        <Display.Button
          icon={faAngleLeft}
          bg='transparent'
          text={
            { color: Constants.Colors.Text.tertiary }
          }
          paddingHorizontal={0}
          paddingVertical={0}
          onPress={
            () => (navigation.navigate as any)('Home')
          }
          iconSize={18}
        />
      </Pressable>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              flexBasis: '80%',
              paddingHorizontal: 16
            }
          }
        >
          <Text.Header
            weight='bold'
            size={20}
            color={Constants.Colors.Text.tertiary}
          >
            Showing filters for:
          </Text.Header>

          <Text.Label
            color={Constants.Colors.Text.secondary}
            size={14}
          >
            {name}
          </Text.Label>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 8
          }
        }
        style={
          { margin: 16 }
        }
        showsVerticalScrollIndicator={false}
      >
        {
          Array.isArray(merchants) && merchants.length >= 1 ? (
            merchants.map(
              (merchant, idx) => (
                <Pressable
                  key={idx}
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }
                  }
                  onPress={
                    () => (navigation.navigate as any)(
                      'ViewMerchant',
                      { uid: merchant.uid }
                    )
                  }
                >
                  <Image
                    style={
                      {
                        width: '100%',
                        height: imageHeight,
                        borderRadius: 10
                      }
                    }
                    source={
                      { uri: merchant.banner }
                    }
                  />

                  <View
                    style={
                      {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        width: '100%',
                        height: imageHeight,
                        position: 'absolute',
                        borderRadius: 10
                      }
                    }
                  />

                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                      }
                    }
                  >
                    <Text.Label
                      color={Constants.Colors.Text.alt}
                      size={28}
                      font='normal'
                      weight='bold'
                    >
                      {merchant.name}
                    </Text.Label>

                    <Text.Label
                      style='italic'
                      color='lightgrey'
                      size={14}
                      align='center'
                    >
                      {merchant.bio ?? 'No bio provided.'}
                    </Text.Label>
                  </View>

                  <View
                    style={
                      {
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        padding: 16
                      }
                    }
                  >
                    <Text.Label
                      weight='bold'
                      color={
                        merchant.open ?
                          Constants.Colors.All.lightGreen :
                          Constants.Colors.Text.danger
                      }
                    >
                      {
                        merchant.open ?
                          'Open' :
                          'Closed'
                      }
                    </Text.Label>
                  </View>
                </Pressable>
              )
            )
          ) : (
            merchants ? (
              <Text.Label
                color={Constants.Colors.Text.secondary}
                style='italic'
              >
                Can't find any items that match.
              </Text.Label>
            ) : (
              <ActivityIndicator
                color={Constants.Colors.All.main}
                size={32}
              />
            )
          )
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default MerchantTypeFilterPage