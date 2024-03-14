import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DonationProvider } from "./contexts/DonationContext";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/ScannerModal";
import DonationsList from "./screens/DonationsList";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <DonationProvider>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarIcon: makeIconRender("home") }}
          />
          <Tab.Screen
            name="List"
            component={DonationsList}
            options={{ tabBarIcon: makeIconRender("cog") }}
          />
        </Tab.Navigator>
      </DonationProvider>
    </NavigationContainer>
  );
}

function makeIconRender(name) {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );
}
