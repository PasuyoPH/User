import { View } from 'react-native'
import * as Display from '../Display'
import { faBowlRice, faBurger, faConciergeBell, faIceCream, faPizzaSlice, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { Constants, Filters } from 'app-types'

const FilterData = [
  {
    icon: faConciergeBell,
    color: Constants.Colors.All.mainDesaturated,
  },

  {
    icon: faPizzaSlice,
    color: '#BF8D3C'
  },

  {
    icon: faQuestion,
    color: 'red'
  },

  {
    icon: faIceCream,
    color: '#FB2943'
  },

  {
    icon: faBurger,
    color: Constants.Colors.All.brown
  },

  {
    icon: faQuestion,
    color: Constants.Colors.Text.secondary
  }
] // todo: move icons to database

interface FilterButtonProps {
  filter: Filters.RestaurantFilter
  selected?: boolean
  index: number
  onSelect?: () => void // for selected purposes
  disabled?: boolean
}

const FilterButton = (props: FilterButtonProps) => {
  return (
    <View>
      <Display.Button
        icon={FilterData[props.index].icon}
        paddingHorizontal={14}
        paddingVertical={14}
        text={{ content: props.filter.name, size: 18 }}
        iconSize={24}
        inverted={
          {
            color: FilterData[props.index].color,
            forceFill: props.selected
          }
        }
        onPress={props.onSelect}
        disabled={props.disabled}
      />
    </View>
  )
}

export default FilterButton