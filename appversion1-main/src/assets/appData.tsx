import {Price1} from '../assets/images/price1.svg'
import {Price2} from '../assets/images/price2.svg'
import {Price3} from '../assets/images/price3.svg'
import {Price4} from '../assets/images/price4.svg'
import {SelectedPrice1} from '../assets/images/selectedPrice1.svg'
import {SelectedPrice2} from '../assets/images/selectedPrice2.svg'
import {SelectedPrice3} from '../assets/images/selectedPrice3.svg'
import {SelectedPrice4} from '../assets/images/selectedPrice4.svg'

export const sustainabilityPref = [
    {
        id: 'PLANFULL',
        icon: require('../assets/images/plantBased.png'),
        title: 'Plant-based',
        description: 'A restaurant receives the Plant-Based icon if its entire menu is plant-based.'
    },
    {
        id: 'PLANFRIE',
        icon: require('../assets/images/PBConscious.png'),
        title: 'Plant-based Friendly',
        description: 'A restaurant receives the Plant-Based Friendly if it offers at least two main dishes on its menu that do not contain any animal products.'
    },
    {
        id: 'VEGEFULL',
        icon: require('../assets/images/vegFriendly.png'),
        title: 'Vegetarian',
        description: 'A restaurant receives the Vegetarian icon if its entire menu excludes meat, poultry, and seafood products.'
    },
    {
        id: 'VEGEFRIE',
        icon: require('../assets/images/vegConscious.png'),
        title: 'Vegetarian Friendly',
        description: 'A restaurant receives the Vegetarian Friendly icon if at least two main dishes on the menu are vegetarian.'
    },
    {
        id: 'COVICONS',
        icon: require('../assets/images/covidM.png'),
        title: 'Safety Conscious',
        description: 'We consider a restaurant to be Safety Conscious if it follows strict protocols to ensure the safety of it\'s diners and staff'
    },
    {
        id: 'WASTCONS',
        icon: require('../assets/images/wasteC.png'),
        title: 'Waste Conscious',
        description: 'A Waste Conscious restaurant effectively reduces, reuses, and recycles its food and material waste, such as through composting organic matter, properly managing inventory, and always recycling paper, glass, and aluminum products.'
    },
    {
        id: 'PLASFREE',
        icon: require('../assets/images/plasticC.png'),
        title: 'Plastic Free',
        description: 'A restaurant receives the Plastic-Free icon if it has received a plastic-free certification or does not use single-use plastics or any plastic packaging or storage.'
    },
    {
        id: 'PLASCONS',
        icon: require('../assets/images/plasticConscious.png'),
        title: 'Plastic Conscious',
        description: 'A restaurant receives the Plastic-Free icon if it minimizes its use of plastic in packaging or storage.'
    },
    {
        id: 'SUSTMEAT',
        icon: require('../assets/images/sustMeat.png'),
        title: 'Sustainable Meat',
        description: 'A restaurant receives the Sustainable Meat icon if it continuously provides meat or poultry menu items that are certified organic or another ecological certification, or local to the region and at least one of the following: grass-fed, hormone-free, and/or free-range.'
    },
    
    {
        id: 'SUSTSEAF',
        icon: require('../assets/images/sustSeafood.png'),
        title: 'Sustainable Seafood',
        description: 'A restaurant receives the Sustainable Seafood icon if it continuously provides fish or other seafood menu items that are from suppliers with a certification recognized by the Global Sustainable Seafood Initiative and/or that are caught or produced locally.'
    },
    {
        id: 'SUSTPROD',
        icon: require('../assets/images/sustProduce.png'),
        title: 'Sustainable Produce',
        description: 'A restaurant receives the Sustainable Produce icon if it grows its own food and/or continuously serves produce that is certified organic or grown locally in the region.'
    },
    {
        id: 'RENWENEG',
        icon: require('../assets/images/renewEnergy.png'),
        title: 'Renewable Energy',
        description: 'A restaurant receives the Renewable Energy icon if it produces its own renewable energy or if it purchases renewable electricity and/or gas through its supplier.'
    },
    {
        id: 'ENEGEFFI',
        icon: require('../assets/images/energyEfficient.png'),
        title: 'Energy Efficient',
        description: 'An Energy Efficient restaurant implements a number of measures to reduce its energy consumption, such as using energy efficient appliances, heating, cooling, and lighting and training staff to minimize consumption.'
    },
    {
        id: 'WATREFFI',
        icon: require('../assets/images/waterEfficient.png'),
        title: 'Water Efficient',
        description: 'A Water Efficient restaurant implements a number of measures to reduce its water usage, such as using water efficient dishwashers, low flow sinks, and low flush toilets.'
    },
]

export const saList = [
    {
      id: 'OUTDOOR_DINING',
      name: 'Outdoor Dining'
    },
    {
      id: 'ROOFTOP_DINING',
      name: 'Rooftop Dining'
    },
    {
      id: 'HANDICAP_ACCESSIBLE',
      name: 'Handicap Accessible'
    },
    {
      id: 'DOGS_ALLOWED',
      name: 'Dogs Allowed'
    },
    {
      id: 'FREE_WIFI',
      name: 'Free Wifi'
    },
    {
      id: 'SCENIC_VIEW',
      name: 'Scenic View'
    },
    {
      id: 'COCKTAILS',
      name: 'Cocktails'
    },
    {
      id: 'AIR_CON',
      name: 'Air Conditioning'
    },
    {
      id: 'KIDS_MENU',
      name: `Kid's Menu`
    },
    {
      id: 'LIVE_MUSIC',
      name: 'Live music'
    },
    {
      id: 'SHOW',
      name: 'Show/Performance'
    },
    {
      id: 'RESERVATION_REQUIRED',
      name: 'Reservation Required'
    },
    {
      id: 'NO_RESERVATION_REQUIRED',
      name: 'No reservation required'
    },
    {
      id: 'BOTTOMLESS',
      name: 'Bottomless mimosas/drinks'
    },
    {
      id: 'FINE_DINING',
      name: 'Fine Dining'
    },
    {
      id: 'CASUAL_DINING',
      name: 'Casual Dining'
    },
    {
      id: 'OWN_DELIVERY',
      name: 'Own-Delivery'
    },
    {
      id: 'PARTY_VIBE',
      name: 'Party Vibe'
    },
    {
      id: 'QUIET',
      name: 'Quiet'
    },
    {
      id: 'ROMANTIC',
      name: 'Romantic'
    },
    {
      id: 'BRUNCH',
      name: 'Brunch'
    },
    {
      id: 'BUFFET',
      name: 'Buffet'
    },
    {
      id: 'DAILY_SPECIAL',
      name: 'Daily Special'
    }
  ]


export const priceList = [
    {
      id: 'price1',
      icon: Price1,
      selectedIcon: SelectedPrice1,
      price: 1
    },
    {
      id: 'price2',
      icon: Price2,
      selectedIcon: SelectedPrice2,
      price: 2
    },
    {
      id: 'price3',
      icon: Price3,
      selectedIcon: SelectedPrice3,
      price: 3
    },
    {
      id: 'price4',
      icon: Price4,
      selectedIcon: SelectedPrice4,
      price: 4
    }
  ]
  
  export const cuisinesList = [
    {
      id: 'AFGANI',
      name: 'Afghani'
    },
    {
      id: 'AFRICAN',
      name: 'African'
    },
    {
      id: 'ALGERIAN',
      name: 'Algerian'
    },
    {
      id: 'AMERICAN',
      name: 'American'
    },
    {
      id: 'ARABIC',
      name: 'Arabic'
    },
    {
      id: 'ARGENTINEAN',
      name: 'Argentinean'
    },
    {
      id: 'ASIAN',
      name: 'Asian'
    },
    {
        id: 'ASSYRIAN',
        name: 'Assyrian'
    },
    {
        id: 'AUSTRALIAN',
        name: 'Australian'
    },
    {
        id: 'BAR',
        name: 'Bar'
    },
    {
        id: 'BARBECUE',
        name: 'Barbecue'
    },
    {
        id: 'BASQUE',
        name: 'Basque'
    },
    {
        id: 'BEER_PUB',
        name: 'Beer/Pub'
    },
    {
        id: 'BELGIAN',
        name: 'Belgian'
    },
    {
        id: 'BRAZILIAN',
        name: 'Brazilian'
    },
    {
        id: 'BRITISH',
        name: 'British'
    },
    {
        id: 'CAFE',
        name: 'Cafe'
    },
    {
        id: 'CAJUN_CREOLE',
        name: 'Cajun & Creole'
    },
    {
        id: 'CARIBBEAN',
        name: 'Caribbean'
    },
    {
        id: 'CATALAN',
        name: 'Catalan'
    },
    {
        id: 'CENTRAL_AMERICAN',
        name: 'Central American'
    },
    {
        id: 'CENTRAL_ASIAN',
        name: 'Central Asian'
    },
    {
        id: 'CENTRAL_EUROPEAN',
        name: 'Central European'
    },
    {
        id: 'CHINESE',
        name: 'Chinese'
    },
    {
        id: 'COFFEE_SHOP',
        name: 'Coffee Shop'
    },
    {
        id: 'COLOMBIAN',
        name: 'Colombian'
    },
    {
        id: 'MODERN',
        name: 'Contemporary/Modern'
    },
    {
        id: 'COSTA_RICAN',
        name: 'Costa Rican'
    },
    {
        id: 'CROATIAN',
        name: 'Croatian'
    },
    {
        id: 'CUBAN',
        name: 'Cuban'
    },
    {
        id: 'DANISH',
        name: 'Danish'
    },
    {
        id: 'DELI',
        name: 'Deli'
    },
    {
        id: 'DINER',
        name: 'Diner'
    },
    {
        id: 'DUTCH',
        name: 'Dutch'
    },
    {
        id: 'EASTERN_EUROPEAN',
        name: 'Eastern European'
    },
    {
        id: 'ECUADOREAN',
        name: 'Ecuadorean'
    },
    {
        id: 'EGYPTIAN',
        name: 'Egyptian'
    },
    {
        id: 'ETHIOPIAN',
        name: 'Ethiopian'
    },
    {
        id: 'EUROPEAN',
        name: 'European'
    },
    {
        id: 'FAST_FOOD',
        name: 'Fast Food'
    },
    {
        id: 'FILIPINO',
        name: 'Filipino'
    },
    {
        id: 'FRENCH',
        name: 'French'
    },
    {
        id: 'FUSION',
        name: 'Fusion'
    },
    {
        id: 'GASTROPUB',
        name: 'Gastropub'
    },
    {
        id: 'GEORGIAN',
        name: 'Georgian'
    },
    {
        id: 'GERMAN',
        name: 'German'
    },
    {
        id: 'GREEK',
        name: 'Greek'
    },
    {
        id: 'GRILL',
        name: 'Grill'
    },
    {
        id: 'HAWAIIAN',
        name: 'Hawaiian'
    },
    {
        id: 'HEALTHY',
        name: 'Healthy'
    },
    {
        id: 'HUNGARIAN',
        name: 'Hungarian'
    },
    {
        id: 'INDIAN',
        name: 'Indian'
    },
    {
        id: 'INDONESIAN',
        name: 'Indonesian'
    },
    {
        id: 'INTERNATIONAL',
        name: 'International'
    },
    {
        id: 'IRISH',
        name: 'Irish'
    },
    {
        id: 'ISRAELI',
        name: 'Israeli'
    },
    {
        id: 'ITALIAN',
        name: 'Italian'
    },
    {
        id: 'JAMAICAN',
        name: 'Jamaican'
    },
    {
        id: 'JAPANESE',
        name: 'Japanese'
    },
    {
        id: 'KOREAN',
        name: 'Korean'
    },
    {
        id: 'LATIN',
        name: 'Latin'
    },
    {
        id: 'LEBANESE',
        name: 'Lebanese'
    },
    {
        id: 'MALAYSIAN',
        name: 'Malaysian'
    },
    {
        id: 'MEDITERRANEAN',
        name: 'Mediterranean'
    },
    {
        id: 'MEXICAN',
        name: 'Mexican'
    },
    {
        id: 'MIDDLE_EASTERN',
        name: 'Middle Eastern'
    },
    {
        id: 'MOROCCAN',
        name: 'Moroccan'
    },
    {
        id: 'NEPALI',
        name: 'Nepali'
    },
    {
        id: 'NEW_ZEALAND',
        name: 'New Zealand'
    },
    {
        id: 'NORWEGIAN',
        name: 'Norwegian'
    },
    {
        id: 'PAKISTANI',
        name: 'Pakistani'
    },
    {
        id: 'PERSIAN',
        name: 'Persian'
    },
    {
        id: 'PERUVIAN',
        name: 'Peruvian'
    },
    {
        id: 'PIZZA',
        name: 'Pizza'
    },
    {
        id: 'POLISH',
        name: 'Polish'
    },
    {
        id: 'POLYNESIAN',
        name: 'Polynesian'
    },
    {
        id: 'PORTUGUESE',
        name: 'Portuguese'
    },
    {
        id: 'PUERTO_RICAN',
        name: 'Puerto Rican'
    },
    {
        id: 'RUSSIAN',
        name: 'Russian'
    },
    {
        id: 'SCANDINAVIAN',
        name: 'Scandinavian'
    },
    {
        id: 'SCOTTISH',
        name: 'Scottish'
    },
    {
        id: 'SEAFOOD',
        name: 'Seafood'
    },
    {
        id: 'SINGAPOREAN',
        name: 'Singaporean'
    },
    {
        id: 'SOUPS',
        name: 'Soups'
    },
    {
        id: 'SOUTH_AMERICAN',
        name: 'South American'
    },
    {
        id: 'SPANISH',
        name: 'Spanish'
    },
    {
        id: 'STEAKHOUSE',
        name: 'Steakhouse'
    },
    {
        id: 'STREET_FOOD',
        name: 'Street Food'
    },
    {
        id: 'SUSHI',
        name: 'Sushi'
    },
    {
        id: 'SWEDISH',
        name: 'Swedish'
    },
    {
        id: 'SWISS',
        name: 'Swiss'
    },
    {
        id: 'SZECHUAN',
        name: 'Szechuan'
    },
    {
        id: 'TAIWANESE',
        name: 'Taiwanese'
    },
    {
        id: 'TAPAS',
        name: 'Tapas'
    },
    {
        id: 'THAI',
        name: 'Thai'
    },
    {
        id: 'TIBETAN',
        name: 'Tibetan'
    },
    {
        id: 'TUNISIAN',
        name: 'Tunisian'
    },
    {
        id: 'TURKISH',
        name: 'Turkish'
    },
    {
        id: 'VENEZUELAN',
        name: 'Venezuelan'
    },
    {
        id: 'VIETNAMESE',
        name: 'Vietnamese'
    },
    {
        id: 'WINE_BAR',
        name: 'Wine Bar'
    },
    {
        id: 'WOK',
        name: 'Wok'
    }
]
  
  export const dietList = [
    
    {
        id: 'GLUTEN_FREE',
        name: 'Gluten-free options'
      },
    {
      id: 'HALAL',
      name: 'Halal options'
    },
    {
        id: 'KOSHER',
        name: 'Kosher'
      },
  ]
  
  export const googleLink = 'https://play.google.com/store/apps/details?id=com.verdantip.verdantips'
  export const appleLink = ''
  