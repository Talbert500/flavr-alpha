import { useRef } from 'react'
import { ImageBackground, Animated, Image, ScrollView, Text, View, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements'
import { styles } from '../styles'
import { ref, onValue, orderByChild, query } from 'firebase/database'
import { collection, getDoc, doc } from 'firebase/firestore'
import { storage } from '../firebase-config';
import { useEffect, useState } from 'react';
import Card from '../Components/Card'
import { setFoodItemId } from '../redux/action'
import { uploadBytes, getDownloadURL, ref as tef, list } from 'firebase/storage';
import { BlurView } from 'expo-blur';
import { setSearchedRestaurantImage, setSearchedRestaurant, setNewRestaurant } from '../redux/action'
import { auth, database, db } from '../firebase-config'
import { Link } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from '@use-expo/font';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Footer from '../Components/Footer';

function RestaurantScreen({ route, navigation }) {

    const { userId, loginSession } = route.params;

    let [fontsLoaded] = useFonts({
        'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../assets/fonts/proxima_nova_black.otf')
    });

    const dispatch = useDispatch();
    const [rawMenuData, setRawMenuData] = useState([]);
    const [menuData, setMenuItem] = useState([]);


    const [loading, setLoading] = useState(false)

    const [restaurant_city, setrestaurant_city] = useState("");
    const [restaurant_state, setrestaurant_state] = useState("");
    const [restaurant_zip, setrestaurant_zip] = useState("");
    const [restaurant_website, setWebsite] = useState('')
    const [searchedRestaurant, setRestaurantName] = useState("");
    const [restaurantDesc, setRestaurantDec] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [restaurant_address, setRestaurantAddress] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const [restaurantColor, setRestaurantColor] = useState("");
    const [restaurantImage, setRestaurantImage] = useState("");


    function setLocalData() {
        console.log(restaurantDesc)
        console.log(restaurantId)
        console.log(restaurantColor)
        console.log(searchedRestaurant)
        dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurant_address, restaurantPhone, restaurantId, restaurantColor))
    }

    const setRestaurant = async () => {
        console.log("userid passed", loginSession)

        //const restId = auth.currentUser.uid;
        const docRef = doc(db, "restaurants", loginSession);
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
            console.log(snapshot.data())

            setWebsite(snapshot.data().restaurant_website)
            setRestaurantId(snapshot.data().restaurant_id)
            setRestaurantPhone(snapshot.data().restaurant_phone)
            setRestaurantAddress(snapshot.data().restaurant_address)
            setRestaurantDec(snapshot.data().restaurant_desc)
            setRestaurantName(snapshot.data().restaurant_name)
            setRestaurantColor(snapshot.data().restaurant_color)

            setrestaurant_city(snapshot.data().restaurant_city)
            setrestaurant_state(snapshot.data().restaurant_state)
            setrestaurant_zip(snapshot.data().restaurant_zip)

            const imageRef = tef(storage, 'imagesRestaurant/' + snapshot.data().restaurant_id);
            console.log("getting image-----------")
            await getDownloadURL(imageRef).then((url) => {
                setRestaurantImage(url)
                console.log(url)
                console.log(restaurantImage)
                setLoading(false);
                dispatch(setSearchedRestaurantImage(url))

            })
        } else {
            console.log("No souch document!")
        }
    }
    const getMenu = async () => {
        const menu = query(ref(database, 'restaurants/' + restaurantId + '/menus/'));
        onValue(menu, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                setRawMenuData("")
                Object.values(data).map((foodData) => {
                    setRawMenuData((food) => [...food, foodData]);
                })
            }
        })
    }
    useEffect(() => {
        dispatch(setSearchedRestaurant(null, null, null, null, null, null))
        setLoading(true);
        setRestaurant();
        getMenu();


    }, [])

    function getQRCode() {
        console.log("Order QR Codes")
    };


    const topMenuItems = () => {
        const topMenuItems = rawMenuData.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)
        if (topMenuItems.length > 3) {
            topMenuItems.length = 3
            setMenuItem(rawMenuData.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1));
        } else {
            setMenuItem(rawMenuData.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1));
        }

    }
    const userSignOut = () => {
        signOut(auth).then(() => {
            dispatch(setSearchedRestaurant(null, null, null, null, null, null))
            dispatch(setNewRestaurant(null, null, null, null, null))
            if (Platform.OS === 'web') {
                navigation.navigate("RestaurantHome")
            } else {
                navigation.navigate("Home")
            }

        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            {Platform.OS === 'web' ? (
                <View style={{ width: '100%', padding: 5, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", position: 'absolute', zIndex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Image
                            style={{
                                justifyContent: 'flex-start',
                                width: 125,
                                height: 50,
                                resizeMode: "contain",
                                opacity: Platform.OS === 'web' ? 1 : 0
                            }}
                            source={require('../assets/logo_name_simple.png')} />
                    </TouchableOpacity>
                </View>
            ) : (<></>)
            }
            <ScrollView showsVerticalScrollIndicator={false}>
                {!loading ?
                    (
                        <ImageBackground style={{ justifyContent: 'center', paddingTop: "9%", height: Platform.OS === "web" ? 400 : 200 }} resizeMode="cover" source={{ uri: restaurantImage }}>
                            <LinearGradient
                                colors={['#00000000', '#000000']}
                                style={{ height: '100%', width: '100%', }}>
                                <View style={{ width: "100%", maxWidth: 700, flex: 1, alignSelf: 'center' }}>
                                    <View style={{
                                        margin: 10,
                                        alignSelf: Platform.OS === "web" ? 'center' : '',
                                        flex: 1,
                                        justifyContent: "flex-end",
                                        marginRight: 'auto',

                                    }}>
                                        <Text style={{ color: "white", fontWeight: "bold" }}>Viewing as Admin</Text>

                                        <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.headerText, { color: "white", }]}>{searchedRestaurant} </Text>
                                        <Text style={{ color: "white", fontWeight: "bold" }}>2304 Overall Ratings</Text>


                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground >
                    ) : (
                        <ActivityIndicator size="large" style={{ height: 300 }} color="#F6AE2D" />
                    )}

                <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%' }}>
                    <View style={{ margin: 10 }}>
                        <View style={{ flexDirection: 'row', margin: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button onPress={() => {
                                navigation.navigate("EditMenu", {
                                    userId: loginSession

                                }), setLocalData()
                            }} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Edit Menu"></Button>

                            <Button onPress={() =>
                                navigation.navigate("RestaurantWeb", {
                                    restId: loginSession

                                })}
                                buttonStyle={[styles.button, { backgroundColor: "white", borderColor: restaurantColor, borderWidth: 1 }]} titleStyle={[styles.buttonTitle, { color: restaurantColor }]} title="View Menu">
                            </Button>
                            <Button onPress={getQRCode}
                                buttonStyle={[styles.button, { backgroundColor: "white", borderColor: restaurantColor, borderWidth: 1 }]} titleStyle={[styles.buttonTitle, { color: restaurantColor }]} title="Order QR Menu">
                            </Button>
                        </View>
                        <Image
                            style={{ width: 200, height: 200, alignSelf: 'center' }}
                            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=https://www.ratemyfood.app/restaurant-menu-web?restId=${loginSession}` }}
                        />

                        <Divider style={{ margin: 10 }} />
                        <View>
                            <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>Location and Hours</Text>

                            <Text style={{ fontFamily: 'Primary', fontSize: 14 }}>{restaurant_address} {restaurant_city}, {restaurant_state} {restaurant_zip}</Text>
                        </View>
                        <Divider style={{ margin: 10 }} />
                        <View>
                            <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>About us</Text>

                            <Text numberOfLines={3} style={{ fontFamily: 'Primary', fontSize: 14 }}>{restaurantDesc}</Text>
                        </View>


                        <View style={{ backgroundColor: 'white', borderColor: 'black', padding: 20, borderRadius: 15 }}>
                            <View style={{ flexDirection: "row", alignContent: "center", alignItems: 'center', margin: 5 }}>
                                <Icon name="call" color="black" size="35" />
                                <Text style={{ fontSize: 17, fontWeight: '500', marginHorizontal: 10 }}>{restaurantPhone}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignContent: "center", margin: 5, alignItems: 'center' }}>
                                <Icon name="web" color="black" size="35" />
                                <Text style={{ fontSize: 17, fontWeight: '500', marginHorizontal: 10, maxWidth: 300 }} >{restaurant_website}</Text>
                            </View>

                        </View>
                        <TouchableOpacity onPress={() => { navigation.navigate("Settings") }}>
                            <Text style={{ marginLeft: 'auto', fontWeight: '500' }}> Edit Profile</Text>
                        </TouchableOpacity>
                        <Divider style={{ margin: 10 }} />

                    </View>


                    <View style={[styles.cards, { margin: 10, flex: 1, overflow: 'hidden', padding: 5, marginTop: 10, backgroundColor: '#FAFAFA' }]}>
                        <View style={{ maxHeight: 100 }}>
                            <Text style={[styles.subHeaderText, { margin: 13, fontSize: 25 }]}>Top Menu Items</Text>
                            <FlatList
                                data={menuData}
                                keyExtractor={(item) => item.food_id}
                                renderItem={({ item }) =>
                                    <Card
                                        restaurant={item.restaurant}
                                        ranking={item.index}
                                        food={item.food}
                                        percent={item.upvotes > 0 ? (item.eatagain * 100 / item.upvotes) : (item.upvotes)}
                                        onPress={() => { dispatch(setFoodItemId(item.food_id, item.food, item.price, item.description, item.upvotes, item.restaurant, item.eatagain)), navigation.navigate("Food") }}
                                        upvotes={item.upvotes}
                                    />
                                }
                            />
                        </View>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Button onPress={userSignOut} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Sign Out"></Button>
                        <Button onPress={topMenuItems} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Dashboard"></Button>
                    </View>
                    <View>
                        <Text style={[styles.headerText, { marginVertical: 10 }]}>
                            Restaurant Ratings
                        </Text>
                        <View style={{ height: 200, borderRadius: 20, padding: 20, margin: 10 }}>
                            <Text>No Ratings for this Menu</Text>

                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "20%" }}>
                    <Footer />
                </View>
            </ScrollView >

        </View >
    )

}


export default RestaurantScreen;

