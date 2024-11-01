// generateSampleData.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSlPhibTKrXg1llSvtM8ienRZ1Qyv5N34",
    authDomain: "pe-mma-punhe.firebaseapp.com",
    projectId: "pe-mma-punhe",
    storageBucket: "pe-mma-punhe.firebasestorage.app",
    messagingSenderId: "507480918531",
    appId: "1:507480918531:web:573ffa0be34e170bef1c36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleRooms = [
    {
        name: "Luxury Suite Room",
        location: "District 1, Ho Chi Minh City",
        pricePerNight: 150,
        description: "Spacious luxury suite with city view, king-size bed, and modern amenities",
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
        latitude: 10.762622,
        longitude: 106.660172,
        amenities: ["wifi", "tv", "aircon", "kitchen"]
    },
    {
        name: "Cozy Studio Apartment",
        location: "District 2, Ho Chi Minh City",
        pricePerNight: 80,
        description: "Modern studio apartment perfect for solo travelers or couples",
        imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
        latitude: 10.786834,
        longitude: 106.750644,
        amenities: ["wifi", "tv", "aircon"]
    },
    {
        name: "Family Suite",
        location: "District 7, Ho Chi Minh City",
        pricePerNight: 200,
        description: "Large family suite with 2 bedrooms and full kitchen",
        imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
        latitude: 10.729568,
        longitude: 106.718170,
        amenities: ["wifi", "tv", "aircon", "kitchen", "pool"]
    }
];

async function generateSampleData() {
    try {
        for (const room of sampleRooms) {
            const docRef = await addDoc(collection(db, 'rooms'), {
                ...room,
                createdAt: new Date()
            });
            console.log(`Added room: ${room.name} with ID: ${docRef.id}`);
        }
        console.log('Sample data generation complete!');
    } catch (error) {
        console.error('Error generating sample data:', error);
    }
}

// Run the function
generateSampleData().then(() => {
    console.log('Script finished');
    process.exit(0);
}).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
});