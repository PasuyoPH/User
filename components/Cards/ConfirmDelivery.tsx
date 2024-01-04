import { Address, Constants, Deliveries } from 'app-types'
import { View } from 'react-native'
import * as Text from '../Text'

import * as Time from '../Time'

interface ConfirmDeliveryCardProps {
  delivery: Deliveries.Data
  pickup: Address.AddressData
  dropoff: Address.AddressData
}

const ConfirmDeliveryCard = (props: ConfirmDeliveryCardProps) => {
  return (
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
            backgroundColor: Constants.Colors.All.main,
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
          {props.delivery.name}
        </Text.Header>

        <Text.Label
          font='normal'
          color={Constants.Colors.All.whiteSmoke}
          style='italic'
          size={14}
        >
          Weight: {props.delivery.weight.toFixed(2)}kg
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
            FROM
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
                  props.pickup.landmark ?? '',
                  props.pickup.text
                ].join(' ')
                  .trim()
              }
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
          <Text.Header
            size={12}
            weight='bold'
            color={Constants.Colors.Text.secondary}
            font='normal'
          >
            TO
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
                  props.dropoff.landmark ?? '',
                  props.dropoff.text
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
            flexDirection: 'row',
            justifyContent: 'space-between'
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
            {props.delivery.distance.toFixed(2)}km
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
            {Time.secondsToTime(props.delivery.eta)}
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
            FEE
          </Text.Header>

          <Text.Label
            size={14}
            color={Constants.Colors.Text.green}
          >
            ₱{props.delivery.fee.toFixed(2)}
          </Text.Label>
        </View>
      </View>
    </View>
  )
}

export default ConfirmDeliveryCard