import React, { useEffect, useState } from "react";
import { 
    View, 
    TouchableOpacity, 
    Text, 
    Image, 
    StyleSheet, 
    FlatList,
    Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import MapView, { Marker } from 'react-native-maps';
import colors from '../colors';

const { width } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const [rooms, setRooms] = useState([]);
    const [bookedRooms, setBookedRooms] = useState([]);
    const [isBookingExpanded, setIsBookingExpanded] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState({
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <FontAwesome name="search" size={24} color={colors.gray} style={{marginLeft: 15}}/>
            ),
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={onSignOut} style={styles.logoutButton}>
                        <AntDesign name="logout" size={24} color={colors.gray} />
                    </TouchableOpacity>
                </View>
            ),
            headerTitle: "Room Finder",
        });
    }, [navigation]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsCollection = collection(database, 'rooms');
                const roomSnapshot = await getDocs(roomsCollection);
                const roomList = roomSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRooms(roomList);
            } catch (error) {
                console.error("Error fetching rooms: ", error);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchBookedRooms = async () => {
            if (auth.currentUser) {
                try {
                    const bookingsRef = collection(database, 'bookings');
                    const q = query(bookingsRef, where("userId", "==", auth.currentUser.uid));
                    const bookingsSnapshot = await getDocs(q);
                    const bookedList = bookingsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setBookedRooms(bookedList);
                } catch (error) {
                    console.error("Error fetching booked rooms: ", error);
                }
            }
        };
        fetchBookedRooms();
    }, []);

    const RoomCard = ({ room }) => (
        <TouchableOpacity 
            style={styles.roomCard}
            onPress={() => navigation.navigate('RoomDetail', { room })}
        >
            <Image
                source={{ uri: room.imageUrl }}
                style={styles.roomImage}
            />
            <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomLocation}>
                    <Ionicons name="location" size={16} color={colors.primary} />
                    {room.location}
                </Text>
                <Text style={styles.roomPrice}>${room.pricePerNight}/night</Text>
            </View>
        </TouchableOpacity>
    );

    const toggleBookingSection = () => {
        setIsBookingExpanded(!isBookingExpanded);
    };

    const renderBookingSection = () => (
        <View style={styles.bookingSection}>
            <TouchableOpacity onPress={toggleBookingSection} style={styles.viewAllButton}>
                <Text style={styles.sectionTitle}>Your Bookings</Text>
                <AntDesign name={isBookingExpanded ? "up" : "down"} size={16} color={colors.primary} />
            </TouchableOpacity>
            {isBookingExpanded && (
                <FlatList
                    data={bookedRooms}
                    renderItem={({ item }) => (
                        <View style={styles.bookedRoomCard}>
                            <Text style={styles.bookedRoomTitle}>{item.roomName}</Text>
                            <Text style={styles.bookedRoomPrice}>${item.roomPrice}/night</Text>
                            <Text style={styles.bookedRoomDate}>Booked On: {new Date(item.bookedOn.seconds * 1000).toDateString()}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // Prevent nested scrolling
                />
            )}
        </View>
    );

    return (
        <FlatList
            data={rooms}
            ListHeaderComponent={() => (
                <>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={selectedRegion}
                        >
                            {rooms.map((room) => (
                                <Marker
                                    key={room.id}
                                    coordinate={{
                                        latitude: room.latitude,
                                        longitude: room.longitude
                                    }}
                                    title={room.name}
                                    description={`$${room.pricePerNight}/night`}
                                    onPress={() => navigation.navigate('RoomDetail', { room })}
                                />
                            ))}
                        </MapView>
                    </View>
                    {renderBookingSection()}
                    <Text style={styles.sectionTitle}>Available Rooms</Text>
                </>
            )}
            renderItem={({ item }) => <RoomCard room={item} />}
            keyExtractor={item => item.id}
            ListFooterComponent={<View style={{ height: 20 }} />} // Optional footer space
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    logoutButton: {
        marginRight: 15,
    },
    mapContainer: {
        height: 300,
        margin: 15,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    map: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
        color: '#333',
    },
    bookingSection: {
        paddingHorizontal: 15,
    },
    viewAllButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    bookedRoomCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    bookedRoomTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bookedRoomPrice: {
        fontSize: 14,
        color: colors.primary,
        marginVertical: 5,
    },
    bookedRoomDate: {
        fontSize: 12,
        color: colors.gray,
    },
    roomCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    roomImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    roomInfo: {
        padding: 15,
    },
    roomName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    roomLocation: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 5,
    },
    roomPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 5,
    },
});

export default Home;
