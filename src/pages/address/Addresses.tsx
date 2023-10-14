import { Address, Constants } from 'app-types'
import { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import { UserAppData } from 'app-types/src/app'
import { Card, Display, Text } from '../../../components'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons'

const http = new Http.Client()

const AddressesPage = (user: UserAppData) => {
  const [addresses, setAddresses] = useState<Address.AddressData[]>(null),
    navigation = useNavigation()

  useFocusEffect(
    useCallback(
      () => {
        // load addresses
        const getAddresses = async () => {
          const res = await http.request<Address.AddressData[]>(
            {
              method: 'get',
              url: Constants.Url.Routes.ADDRESSES,
              headers: {
                Authorization: user.token
              }
            }
          )

          setAddresses(res.value ?? [])
        }

        getAddresses()
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
            padding: 32,
            gap: 32
          }
        }
      >
        <View style={{ flexDirection: 'row' }}>
          <Display.Button
            icon={faAngleLeft}
            bg='transparent'
            text={{ color: Constants.Colors.Text.tertiary }}
            paddingHorizontal={0}
            paddingVertical={0}
            onPress={
              () => navigation.goBack()
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
          <Text.Header
            weight='bold'
            color={Constants.Colors.Text.tertiary}
          >
            My Addresses
          </Text.Header>

          <Text.Label
            style='italic'
            color={Constants.Colors.Text.secondary}
          >
            Save, edit or add new addresses.
          </Text.Label>
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }
          }
        >
          {
            Array.isArray(addresses) ? (
              addresses.length >= 1 ? (
                addresses.map(
                  (address, idx) => (
                    <Card.Address
                      key={idx}
                      token={user.token}
                      address={address}
                      onDelete={
                        () => {
                          const tempAddresses = [...addresses]
                          setAddresses(null)

                          // remove from array
                          setAddresses(
                            tempAddresses.filter(
                              (add) => add.uid !== address.uid
                            )
                          )
                        }
                      }
                    />
                  )
                )
              ) : (
                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  align='center'
                  size={14}
                >
                  Add a new address now!
                </Text.Label>
              )
            ) : (
              <ActivityIndicator
                color={Constants.Colors.Text.main}
                size={32}
              />
            )
          }

          { /* Add new Address Button */ }
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 8
              }
            }
          >
            <Display.Button
              inverted={
                { color: Constants.Colors.Text.green }
              }
              text={
                { content: 'New Address' }
              }
              icon={faPlus}
              onPress={
                () => (navigation.navigate as any)('NewAddress')
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddressesPage