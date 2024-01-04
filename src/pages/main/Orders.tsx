import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Display, Text } from '../../../components'
import { App, Constants, Deliveries, Job, Orders } from 'app-types'
import { View, ScrollView, Pressable } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
import { Http } from 'app-structs'

const http = new Http.Client()

const OrdersPage = (user: App.UserAppData) => {
  const navigation = useNavigation(),
    [data, setData] = useState<
      {
        jobs: (Orders.Order | Deliveries.Data)[],
        statuses: [ { uid: string, pickedUp?: boolean, finished?: boolean } ]
      }
    >()

  useFocusEffect(
    useCallback(
      () => {
        const getData = async () => {
          const result = await http.request<
            {
              jobs: (Orders.Order | Deliveries.Data)[],
              statuses: [ { uid: string, pickedUp?: boolean, finished?: boolean } ]
            }
          >(
            {
              method: 'get',
              url: Constants.Url.Routes.USER_JOBS,
              headers: {
                Authorization: user.token
              }
            }
          )

          setData(result.value)
        }

        getData()
          .catch(console.error)
      },
      []
    )
  )

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingBottom: 32,
          }
        }
        style={
          { paddingHorizontal: 32 }
        }
      >
        <Pressable
          style={
            {
              flexDirection: 'row',
              zIndex: 2,
              paddingVertical: 16
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

        <Text.Header
          color={Constants.Colors.Text.tertiary}
          weight='bold'
        >
          Your Orders
        </Text.Header>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 8,
              gap: 32
            }
          }
        >
          {
            data ? (
              data.jobs
                .sort(
                  (a, b) => b.createdAt - a.createdAt
                )  
                .map(
                  (job, idx) => (
                    <Card.FullJob
                      key={idx}
                      order={job.type === Job.JobTypes.ORDER ? job as Orders.Order : null}
                      delivery={job.type === Job.JobTypes.DELIVERY ? job as Deliveries.Data : null}
                      status={data.statuses.find((status) => status.uid === job.uid)}
                      uid={job.uid}
                      type={job.type}
                    />
                  )
                )
            ) : null
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrdersPage