import React, { useEffect, useState } from "react";
import { 
    View, 
    TouchableOpacity, 
    Text, 
    Image, 
    StyleSheet, 
    ScrollView,
    Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import colors from '../colors';

const { width } = Dimensions.get('window');
const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

const Home = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState({
        name: auth?.currentUser?.displayName || "User",
        email: auth?.currentUser?.email,
        joinDate: "Member since " + new Date().toLocaleDateString(),
        stats: {
            posts: 23,
            followers: 1234,
            following: 567
        }
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
                    <Image
                        source={{ uri: catImageUrl }}
                        style={styles.headerProfileImage}
                    />
                </View>
            ),
            headerTitle: "",
        });
    }, [navigation]);

    const StatBox = ({ icon, title, value }) => (
        <View style={styles.statBox}>
            {icon}
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );

    const MenuItem = ({ icon, title, subtitle, color }) => (
        <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: color }]}>
                {icon}
            </View>
            <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <AntDesign name="right" size={20} color={colors.gray} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: catImageUrl }}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
                <Text style={styles.joinDate}>{userData.joinDate}</Text>

                <View style={styles.statsContainer}>
                    <StatBox 
                        icon={<Ionicons name="document-text" size={24} color={colors.primary} />}
                        title="Posts"
                        value={userData.stats.posts}
                    />
                    <StatBox 
                        icon={<Ionicons name="people" size={24} color={colors.primary} />}
                        title="Followers"
                        value={userData.stats.followers}
                    />
                    <StatBox 
                        icon={<Ionicons name="person-add" size={24} color={colors.primary} />}
                        title="Following"
                        value={userData.stats.following}
                    />
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
                <MenuItem 
                    icon={<MaterialCommunityIcons name="account-edit" size={24} color="white" />}
                    title="Edit Profile"
                    subtitle="Update your personal information"
                    color="#FF6B6B"
                />
                <MenuItem 
                    icon={<Ionicons name="settings-sharp" size={24} color="white" />}
                    title="Settings"
                    subtitle="App preferences and privacy"
                    color="#4ECDC4"
                />
                <MenuItem 
                    icon={<MaterialCommunityIcons name="shield-check" size={24} color="white" />}
                    title="Privacy"
                    subtitle="Manage your privacy settings"
                    color="#45B7D1"
                />
                <MenuItem 
                    icon={<MaterialCommunityIcons name="help-circle" size={24} color="white" />}
                    title="Help & Support"
                    subtitle="Get help and contact us"
                    color="#96CEB4"
                />
            </View>
        </ScrollView>
    );
};

export default Home;

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
    headerProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 5,
    },
    joinDate: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    statBox: {
        alignItems: 'center',
        minWidth: 80,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    statTitle: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 2,
    },
    menuSection: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: colors.gray,
    },
});