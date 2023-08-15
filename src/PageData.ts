import { App, Constants } from 'app-types'
import LoginPage from './pages/auth/Login'
import HomePage from './pages/main/Home'
import ProfilePage from './pages/main/Profile'
import { faHeart, faHouse, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import ViewItemPage from './pages/main/ViewItem'
import ViewMerchantPage from './pages/main/ViewMerchant'
import CheckoutPage from './pages/main/Checkout'
import MainPage from './pages/auth/Main'

const LoginPageData: App.PageItem[] = [
    {
      component: MainPage,
      name: 'Main'
    },
    {
      component: LoginPage,
      name: 'Login'
    }
  ],
  MainPageData: App.PageItem[] = [
    {
      component: HomePage,
      name: 'Home',
      hideHeader: true,
      statusBarColor: 'dark',
      nav: {
        icon: faHouse,
        to: 'Home',
        label: 'Home'
      }
    },

    {
      component: ViewItemPage,
      name: 'ViewItem',
      hideHeader: true,
      statusBarColor: 'light',
      animation: 'slide_from_right'
    },

    {
      component: ViewMerchantPage,
      name: 'ViewMerchant',
      hideHeader: true,
      statusBarColor: 'dark',
      animation: 'default'
    },

    {
      component: CheckoutPage,
      name: 'Checkout',
      hideHeader: true,
      statusBarColor: 'dark',
      animation: 'slide_from_right'
    },

    {
      component: null,
      name: 'Explore',
      /*nav: {
        icon: faBasketShopping,
        to: 'Explore'
      }*/
    },

    {
      component: null,
      name: 'Search',
      /*nav: {
        icon: faSearch,
        to: 'Search',
        lift: true,
        bg: Constants.Colors.Layout.tertiary,
        color: Constants.Colors.Text.alt
      }*/
    },

    {
      component: null,
      name: 'Favourites'
    },

    {
      component: ProfilePage,
      name: 'Profile',
      hideHeader: true,
      statusBarColor: 'light'
    }
  ]

export {
  LoginPageData,
  MainPageData
}