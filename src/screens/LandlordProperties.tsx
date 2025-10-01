import PropertyCard from "../components/PropertyCard";
import { View } from "react-native";

const LandlordProperties: React.FC = () => {
    return (
        <View>
            <PropertyCard
                title="Sunflower Apartment"
                address="123 MG Road, Sector 14"
                role="LANDLORD"
                status="ACTIVE"
                onPress={() => console.log('View Property pressed')}
            />
        </View>

    )
}

export default LandlordProperties;