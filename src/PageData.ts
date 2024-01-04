import { App, Constants } from 'app-types'
import LoginPage from './pages/auth/Login'
import HomePage from './pages/main/Home'
import ProfilePage from './pages/main/Profile'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import ViewItemPage from './pages/main/ViewItem'
import ViewMerchantPage from './pages/main/ViewMerchant'
import CheckoutPage from './pages/main/Checkout'
import MainPage from './pages/auth/Main'
import ChoosePaymentMethodPage from './pages/payment/ChoosePaymentMethod'
import AddressesPage from './pages/address/Addresses'
import NewAddressPage from './pages/address/NewAddress'
import ChooseAddressPage from './pages/address/ChooseAddress'
import ProcessedPage from './pages/payment/Processed'
import SearchItemPage from './pages/main/SearchItem'
import ViewLikedPage from './pages/main/ViewLiked'
import DeliveryHomePage from './pages/delivery/Home'
import NewDeliveryPage from './pages/delivery/NewDelivery'
import DeliveryCheckoutPage from './pages/delivery/Checkout'
import ConfirmDelivery from './pages/delivery/ConfirmDelivery'
import OrdersPage from './pages/main/Orders'
import ViewJobPage from './pages/main/ViewJob'
import RiderPositionPage from './pages/main/RiderPosition'
import RegisterPage from './pages/auth/Register'
import MerchantTypeFilterPage from './pages/main/MerchantTypeFilter'

const LoginPageData: App.PageItem[] = [
    {
      component: MainPage,
      name: 'Main'
    },
    {
      component: LoginPage,
      name: 'Login'
    },
    {
      component: RegisterPage,
      name: 'Register'
    }
  ],
  DeliverPageData: App.PageItem[] = [
    {
      component: DeliveryHomePage,
      name: 'Home',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      
      component: OrdersPage,
      name: 'Orders',
      hideHeader: true,
      statusBarColor: 'dark',
    },

    {
      component: ConfirmDelivery,
      name: 'Confirm',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: DeliveryCheckoutPage,
      name: 'Checkout',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: NewDeliveryPage,
      name: 'NewDelivery',
      hideHeader: true,
      statusBarColor: 'dark',
    },

    // Default pages
    {
      component: AddressesPage,
      name: 'Addresses',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: NewAddressPage,
      name: 'NewAddress',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ChooseAddressPage,
      name: 'ChooseAddress',
      hideHeader: true,
      statusBarColor: 'dark'
    },
    {
      component: ProfilePage,
      name: 'Profile',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ProcessedPage,
      name: 'Processed',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ViewJobPage,
      name: 'ViewJob',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: RiderPositionPage,
      name: 'RiderPosition',
      hideHeader: true,
      statusBarColor: 'dark'
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
      component: MerchantTypeFilterPage,
      name: 'MerchantTypeFilter',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: OrdersPage,
      name: 'Orders',
      hideHeader: true,
      statusBarColor: 'dark',
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
      component: SearchItemPage,
      name: 'Search',
      hideHeader: true
      /*nav: {
        icon: faSearch,
        to: 'Search',
        lift: true,
        bg: Constants.Colors.Layout.tertiary,
        color: Constants.Colors.Text.alt
      }*/
    },

    {
      component: ViewLikedPage,
      name: 'Favourites',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ProfilePage,
      name: 'Profile',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ChoosePaymentMethodPage,
      name: 'ChoosePayment',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: AddressesPage,
      name: 'Addresses',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: NewAddressPage,
      name: 'NewAddress',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ChooseAddressPage,
      name: 'ChooseAddress',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ProcessedPage,
      name: 'Processed',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: ViewJobPage,
      name: 'ViewJob',
      hideHeader: true,
      statusBarColor: 'dark'
    },

    {
      component: RiderPositionPage,
      name: 'RiderPosition',
      hideHeader: true,
      statusBarColor: 'dark'
    }
  ]

export {
  LoginPageData,
  MainPageData,
  DeliverPageData
}