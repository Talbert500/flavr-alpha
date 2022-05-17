import { useEffect, useState } from 'react';
import { Dimensions, Platform, TextInput, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from 'react-native-elements';
import { signOut, onAuthStateChanged,updateEmail } from 'firebase/auth';
import { storage, auth, database, db } from '../../firebase-config';
import { ref, onValue, update } from 'firebase/database';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from '@use-expo/font';

import Footer from '../../Components/Footer';

import { styles } from '../../styles';
import { setSearchedRestaurantImage, setSearchedRestaurant, setNewRestaurant } from '../../redux/action';

function Settings({ navigation }) {

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });

    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    const dispatch = useDispatch();

    // const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    // const restaurantImage = useSelector(state => state.restaurantImage)
    // const restaurantDesc = useSelector(state => state.restaurantDesc)
    // const restaurantId = useSelector(state => state.restaurantId)
    // const restaurantColor = useSelector(state => state.restaurantColor)
    // const restaurantAddress = useSelector(state => state.restaurantAddress)
    // const restaurantPhone = useSelector(state => state.restaurantPhone)
    // const tookPicture = useSelector(state => state.foodImage)


    const [color, setColor] = useState("");
    const [text, onChangeText] = useState("")
    const [image, setImage] = useState("")
    const [desc, setDesc] = useState(restaurantDesc);
    const [isRestaruant, setIsRestaurant] = useState("");
    const [userPhoto, setUserPhoto] = useState("");
    const [searchedRestaurant, setCurrentRest] = useState("")
    const [restaurantImage, setRestaurantImage] = useState("");
    const [restaurantColor, setRestaurantColor] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const [restaurantDesc, setRestaurantDesc] = useState("");
    const [phone, setPhone] = useState(restaurantPhone);
    const [restId, setRestId] = useState("")

    const [hoverside, setHoverSide] = useState(false)
    const [hoverside1, setHoverSide1] = useState(false)
    const [hoverside2, setHoverSide2] = useState(false)
    const [hoverside3, setHoverSide3] = useState(false)
    const [hoverside4, setHoverSide4] = useState(false)
    const [hoverside5, setHoverSide5] = useState(false)
    const [hoverside6, setHoverSide6] = useState(false)
    const [hoverside7, setHoverSide7] = useState(false)

    const [regulars, setRegulars] = useState([])
    const [bookmarked, setBookmarked] = useState(false)
    const [loggedin, setloggedin] = useState(false);

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userCreated, setUserCreated] = useState('');

    const setRestaurant = async (restId) => {

        const docRef = doc(db, "restaurants", restId);
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
            const restaurant_id = snapshot.data().restaurant_id
            const restaurant_phone = snapshot.data().restaurant_phone
            const restaurant_address = snapshot.data().restaurant_address
            const restaurant_desc = snapshot.data().restaurant_desc
            const restaurant_name = snapshot.data().restaurant_name
            const restaurant_color = snapshot.data().restaurant_color

            dispatch(setSearchedRestaurant(restaurant_name, restaurant_desc, restaurant_address, restaurant_phone, restaurant_id, restaurant_color))
            setCurrentRest(snapshot.data().restaurant_name)
            setRestaurantColor(snapshot.data().restaurant_color)
            setRestaurantAddress(snapshot.data().restaurant_address)
            setRestaurantPhone(snapshot.data().restaurant_phone)
            setRestaurantDesc(snapshot.data().restaurant_desc)


        } else {
            console.log("No souch document!")
        }
    }
    const getImage = async (restId) => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restId);
        await getDownloadURL(imageRef).then((url) => {
            dispatch(setSearchedRestaurantImage(url))
            setRestaurantImage(url)
        })
    }
    const AddNewRestaurant = async () => {

        console.log(auth.currentUser.email)
        console.log(auth.currentUser.uid)
        console.log("Updated")
        updateNewEmail();

        updateEmail(auth.currentUser, userEmail ).then(()=> {
        }).catch((error)=> {
            console.log(error)
        })

        updateDoc(doc(db, "restaurants", auth.currentUser.uid), {
            restaurant_phone: restaurantPhone,
            restaurant_desc: restaurantDesc,
            restaurant_color: restaurantColor

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })

        update(ref(database, "user/" + auth.currentUser.uid), {
            userName: searchedRestaurant

        });
        //just added 

        // console.log(tookPicture);
        // const getImageRef = tef(storage, 'imagesRestaurant/' + auth.currentUser.uid); //check if the storage updates 
        // //convert image to array of bytes
        // const img = await fetch(tookPicture);
        // const bytes = await img.blob();
        // uploadBytes(getImageRef, bytes).catch((error) => {
        //     console.log(error)
        // })
        // dispatch(setSearchedRestaurantImage(tookPicture));
        // updateProfile(auth.currentUser, {
        //     displayName: inputRest,
        //     photoURL: tookPicture
        // }).then(() => {
        //     console.log()
        // })

        //we can keep it local or do a check on the backend side and out from there
        //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
        navigation.navigate("Settings")

    }


    const userSignOut = () => {
        signOut(auth).then(() => {
            dispatch(setSearchedRestaurant(null, null, null, null, null, null))
            dispatch(setNewRestaurant(null, null, null, null, null))
            if (Platform.OS === 'web') {
                navigation.replace("RestaurantHome")
            } else {
                navigation.replace("Home")
            }

        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setRestId(user.uid)
                setRestaurant(user.uid);
                getImage(user.uid);
                console.log(user)
                setUserEmail(user.email)
                setUserCreated(user.metadata.creationTime)
                const userRef = ref(database, "user/" + user.uid)
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                        console.log(data)
                        setIsRestaurant(data.hasRestaurant)
                        setUserPhoto(data.userPhoto)
                        setUserName(data.userName)

                    }
                });


            } else {
                navigation.navigate("Home")
            }
        })


    }, [])

    const editPhoto = async (imagee) => {
        const getImageRef = tef(storage, 'imagesRestaurant/' + restId); //how the image will be addressed inside the storage
        //convert image to array of bytes
        const img = await fetch(imagee);
        const bytes = await img.blob();
        uploadBytes(getImageRef, bytes).catch((error) => {
            console.log(error)
        })


    }

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        // dispatch(setFoodItemImage(pickerResult.uri))
        setImage(pickerResult.uri)
        editPhoto(pickerResult.uri)

    }

    const updateNewEmail = ()=> {
    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: windowWidth >= 500 ? 'row' : 'column', flexWrap: 'wrap-reverses', margin: 5 }}>
                <View style={{ backgroundColor: 'white', flex: 2 }}>
                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 1 }]}>
                        <View style={{ flex: 1, maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                            <View style={{ margin: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Display name</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, width: 300, alignContent: 'flex-start' }]}
                                    onChangeText={searchedRestaurant}
                                    value={searchedRestaurant}
                                    placeholder="El Taco Norte"
                                    autoCapitalize='words'
                                />
                            </View>
                            <View style={{ margin: 9 }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Description</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                                    onChangeText={setRestaurantDesc}
                                    value={restaurantDesc}
                                    placeholder={restaurantDesc}
                                    autoCapitalize='words'
                                />
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                                <View style={{ marginHorizontal: 5, width: "45%" }} >
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Email address</Text>
                                    <TextInput
                                        placeholder="john@gmail.com"
                                        value={userEmail}
                                        onChangeText={setUserEmail}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    />
                                </View>
                                <View style={{ marginHorizontal: 5, width: "45%", marginLeft: "auto" }} >
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Address</Text>
                                    <TextInput
                                        placeholder="247 W Camelback Rd"
                                        value={restaurantAddress}
                                        onChangeText={restaurantAddress}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                                <View style={{ marginHorizontal: 5, width: "45%" }} >
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Phone Number</Text>
                                    <TextInput
                                        placeholder="9372249843"
                                        value={restaurantPhone}
                                        onChangeText={setRestaurantPhone}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                                    />
                                </View>
                                <View style={{ marginHorizontal: 5, width: "45%", marginLeft: "auto" }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Color Theme</Text>
                                        <Text onPress={() => Linking.openURL("https://htmlcolorcodes.com/")} style={{ backgroundColor: 'grey', borderRadius: 50, color: 'white', marginRight: 'auto' }}> ? </Text>
                                    </View>
                                    <TextInput
                                        placeholder="John"
                                        value={restaurantColor}
                                        onChangeText={setRestaurantColor}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', marginTop: 15 }]}>
                        <View style={{ flex: 1, maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10, margin: 10 }}>
                            <Text style={[styles.subHeaderText, { color: "black", textAlign: 'left', marginLeft: 10, fontSize: 22 }]}>Billing Details</Text>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150, alignSelf: 'center' }}>Subscription plan</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    placeholder='Starter monthly plan ($12.00)'
                                    autoCapitalize='words'
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150, alignSelf: 'center' }}>Next billing date</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    placeholder='Sat Mar 04 17:33:05 GMT-0700 (Mountain Standard Time)'
                                    autoCapitalize='words'
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150, alignSelf: 'center' }}>Payment method</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    placeholder='American Express ending in 1005'
                                    autoCapitalize='words'
                                />
                                <Button onPress={() => navigation.goBack()} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Change" />
                            </View>
                        </View>
                    </View>
                    <View style={{ maxWidth: 700, margin: 15, alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150 }}>Delete Account</Text>
                                <Text style={{ textAlign: 'left' }}>By deleting your account you will lose all your data and no longer be able to access your restaurant</Text>
                            </View>
                            <View style={{ width: 200, maxWidth: 200, marginRight: 'auto' }}>
                                <Button buttonStyle={[styles.button, { backgroundColor: 'white' }]} titleStyle={[styles.buttonTitle, { color: "#828182" }]} title="Delete Account" />
                            </View>
                        </View>
                        <View style={{ width: 200, maxWidth: 200, marginLeft: 'auto', marginTop: 10 }}>
                            <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { backgroundColor: '#F6AE2D' }]} titleStyle={styles.buttonTitle} title="Save" />
                        </View>
                    </View>
                </View>

            </View>

            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>

            {/* <View style={{backgroundColor:'rgba(0, 0,0,0.5)',position: 'absolute',zIndex:1,top:'0',bottom:'0',left:'0',right:'0',paddingTop:"20%",paddingHorizontal:'3%'}}>
                <View style={[styles.shadowProp, { flex:1,backgroundColor: 'white', maxHeight: 600,alignSelf:'center',width:'100%',backgroundColor:'white',borderRadius:5}]}>

                </View>
            </View> */}

        </KeyboardAwareScrollView>


    )

}



export default Settings 