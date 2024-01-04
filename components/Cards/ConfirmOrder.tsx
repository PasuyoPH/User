import { Address, App, Constants, Deliveries, Items, Merchant, Orders } from 'app-types'
import { View } from 'react-native'
import * as Text from '../Text'
import { useEffect, useState } from 'react'
import * as Time from '../Time'

interface ConfirmOrderCardProps {
  order: Orders.Order
  address: Address.AddressData
  merchant: Merchant.MerchantData
  items: Items.Item[]
  cart: Map<string, App.CartData>
}

const ConfirmOrderCard = (props: ConfirmOrderCardProps) => {
  const [cartItems, setCartItems] = useState<Record<string, App.CartData>>()
  
  useEffect(
    () => {
      let items: Record<string, App.CartData> = {}
      
      for (const [key, value] of props.cart)
        items[key] = value

      setCartItems(
        () => ({ ...items })
      )
    },
    []
  )

  return cartItems ? (
    <View
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          elevation: 4,
          backgroundColor: Constants.Colors.All.whiteSmokeAlt,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 10,
          gap: 8
        }
      }
    >
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: props.merchant.accent ?? Constants.Colors.All.main,
            marginHorizontal: -16,
            marginTop: -8,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingHorizontal: 16,
            padding: 8
          }
        }
      >
        <Text.Header
          weight='bold'
          color={Constants.Colors.Text.alt}
          size={20}
        >
          {props.merchant.name}
        </Text.Header>

        <Text.Label
          font='normal'
          color='lightgrey'
          style='italic'
          size={12}
        >
          {props.merchant.bio ?? 'No bio provided.'}
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
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column'
            }
          }
        >
          <Text.Header
            size={12}
            weight='bold'
            color={Constants.Colors.Text.secondary}
            font='normal'
          >
            DELIVER TO
          </Text.Header>

          <View
            style={
              { flexDirection: 'row' }
            }
          >
            <Text.Label
              size={14}
              color={Constants.Colors.Text.tertiary}
            >
              {
                [
                  props.address.landmark ?? '',
                  props.address.text
                ].join(' ')
                  .trim()
              }
            </Text.Label>
          </View>
        </View>
      </View>

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
              flexDirection: 'column'
            }
          }
        >
          <Text.Header
            size={12}
            weight='bold'
            color={Constants.Colors.Text.secondary}
            font='normal'
          >
            DISTANCE
          </Text.Header>

          <Text.Label
            size={14}
            color={Constants.Colors.Text.tertiary}
          >
            {props.order.distance?.toFixed(2) ?? '0'} km
          </Text.Label>
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
            size={12}
            weight='bold'
            color={Constants.Colors.Text.secondary}
            font='normal'
          >
            ETA
          </Text.Header>

          <Text.Label
            size={14}
            color={Constants.Colors.Text.tertiary}
          >
            {Time.secondsToTime(props.order.eta ?? 0)}
          </Text.Label>
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
            size={12}
            weight='bold'
            color={Constants.Colors.Text.secondary}
            font='normal'
          >
            TOTAL
          </Text.Header>

          <Text.Label
            size={14}
            color={Constants.Colors.Text.green}
          >
            ₱{props.order.total.toFixed(2)}
          </Text.Label>
        </View>
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
          size={14}
          font='normal'
          weight='bold'
          color={Constants.Colors.Text.tertiary}
        >
          ITEMS
        </Text.Label>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 8
            }
          }
        >
          {
            (props.items ?? []).map(
              (item, idx) => (
                <View
                  key={idx}
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 4
                    }
                  }
                >
                  <Text.Label
                    color={Constants.Colors.Text.secondary}
                    size={14}
                    font='normal'
                    weight='bold'
                  >
                    {(cartItems[item.uid]?.quantity ?? 0).toLocaleString()}x
                  </Text.Label>

                  <Text.Label
                    color={Constants.Colors.Text.secondary}
                    size={14}
                    font='normal'
                  >
                    -
                  </Text.Label>

                  <Text.Label
                    color={Constants.Colors.Text.secondary}
                    size={14}
                    font='normal'
                  >
                    {item.name}
                  </Text.Label>
                </View>
              )
            )
          }
        </View>
      </View>
    </View>
  ) : null
}

export default ConfirmOrderCard