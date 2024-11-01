import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import colors from '../colors';
import { auth, database } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const RoomDetail = ({ route, navigation }) => {
    const { room } = route.params;

    const Amenity = ({ icon, name }) => (
        <View style={styles.amenityItem}>
            <Ionicons name={icon} size={24} color={colors.primary} />
            <Text style={styles.amenityText}>{name}</Text>
        </View>
    );

    const handleBooking = async () => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to book a room.");
            return;
        }
        try {
            await addDoc(collection(database, 'bookings'), {
                userId: auth.currentUser.uid,
                roomId: room.id,
                roomName: room.name,
                roomPrice: room.pricePerNight,
                bookedOn: new Date()
            });
            Alert.alert("Success", "Your booking has been made.");
            navigation.navigate('Home'); // Navigate back to Home screen
        } catch (error) {
            console.error("Error booking room: ", error);
            Alert.alert("Error", "Could not complete the booking.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                source={{ uri: room.imageUrl }} 
                style={styles.image}
            />
            
            <View style={styles.content}>
                <Text style={styles.title}>{room.name}</Text>
                <Text style={styles.location}>
                    <Ionicons name="location" size={16} color={colors.primary} />
                    {room.location}
                </Text>
                <Text style={styles.price}>${room.pricePerNight}/night</Text>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{room.description}</Text>

                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.amenitiesContainer}>
                    <Amenity icon="wifi" name="Free WiFi" />
                    <Amenity icon="bed" name="King Size Bed" />
                    <Amenity icon="cafe" name="Coffee Maker" />
                </View>

                <Text style={styles.sectionTitle}>Location</Text>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: room.latitude,
                        longitude: room.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: room.latitude,
                            longitude: room.longitude
                        }}
                        title={room.name}
                    />
                </MapView>

                <TouchableOpacity 
                style={styles.bookButton}
                onPress={handleBooking}
            >
                <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: width,
        height: 300,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    location: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: colors.gray,
        lineHeight: 24,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginVertical: 10,
    },
    amenityText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    map: {
        height: 200,
        marginVertical: 20,
        borderRadius: 15,
    },
    bookButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RoomDetail;