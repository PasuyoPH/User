import { PageProps, UserAppData } from 'app-types/src/app'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { Constants, Merchant } from 'app-types'
import { Http } from 'app-structs'
import { Image, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '../../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import ThemedFloatingCard from '../../../components/Display/ThemedFloatingCard'
import { FloatingCard } from '../../../components/Display'

const http = new Http.Client()

const ViewMerchantPage = (props: PageProps & UserAppData) => {
  const [merchant, setMerchant] = useState<Merchant.MerchantData>(undefined),
    { uid } = props.route.params as { uid: string }

  useFocusEffect(
    useCallback(
      () => {
        const getMerchantInfo = async () => {
          const res = await http.request<Merchant.MerchantData>(
            {
              method: 'get',
              url: Constants.Url.Routes.MERCHANT(uid),
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
    <SafeAreaView
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          paddingVertical: 8,
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
            gap: 12
          }
        }
      >
        <View
          style={
            {
              elevation: 4,
              padding: 4,
              backgroundColor: Constants.Colors.All.whiteSmoke,
              borderRadius: 100,
            }
          }
        >
          <Image
            source={
              { uri: merchant.logo ?? '' }
            }
            style={
              {
                width: 48,
                height: 48,
                borderRadius: 100
              }
            }
          />
        </View>

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
            size={18}
            color={Constants.Colors.Text.tertiary}
          >
            {merchant.name}
          </Text.Label>

          <Text.Label
            style='italic'
            size={12}
            color={Constants.Colors.Text.secondary}
          >
            {merchant.bio}
          </Text.Label>
        </View>
      </View>

      <FloatingCard
        color={Constants.Colors.Layout.danger}
      >
        <Text.Label
          color={Constants.Colors.Text.alt}
        >
          We are currently closed. Please check in on us later!
        </Text.Label>
      </FloatingCard>
    </SafeAreaView>
  ) : null
}

export default ViewMerchantPage