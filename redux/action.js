import { SEARCHED_RESTAURANT } from "./reducer";
import { CLICKED_FOOD_ITEM_ID } from './reducer';
import { SEARCHED_RESTAURANT_IMAGE } from './reducer';
import { SET_FOOD_IMAGE } from './reducer';
import { NEW_RESTAURANT } from './reducer'
import { RESTAURANT_INFO } from './reducer'
import {SET_USER_PROPS} from './reducer'




export const setUserProps = (user_Id, userName,user_Photo)=>{
    return{
        type: SET_USER_PROPS,
        userId: user_Id,
        username:userName,
        userPhoto:user_Photo,

    }

}

export const setRestaurantInfo = (restaurant_website) => {
    return {
        type: RESTAURANT_INFO,
        restaurantWebsite: restaurant_website

    }
}

export const setSearchedRestaurant = (searchedRestaurant, restaurant_desc, restaurant_address, restaurant_phone, restaurant_id, restaurant_color) => {
    return {
        type: SEARCHED_RESTAURANT,
        payload: searchedRestaurant,
        description: restaurant_desc,
        address: restaurant_address,
        phone: restaurant_phone,
        id: restaurant_id,
        color: restaurant_color
    }

}
export const setNewRestaurant = (userCredential_id, adminEmail, firstName, lastName, restaurantName) => {
    return {
        type: NEW_RESTAURANT,
        userCredential_id: userCredential_id,
        adminEmail: adminEmail,
        id: userCredential_id,
        firstName: firstName,
        lastName: lastName,
        restaurantName: restaurantName


    }

}
export const setSearchedRestaurantDesc = restaurantDesc => {
    return {
        type: SEARCHED_RESTAURANT_DESCRIPTION,
        payload: restaurantDesc
    }
}
export const setSearchedRestaurantImage = restaurantImage => {
    return {
        type: SEARCHED_RESTAURANT_IMAGE,
        image: restaurantImage
    }
}

export const setFoodItemId = (foodItemId, foodName, foodPrice, foodDesc, upvotes, searchedRestaurant, eatagain) => {
    return {
        type: CLICKED_FOOD_ITEM_ID,
        payload: foodItemId,
        foodName: foodName,
        foodPrice: foodPrice,
        foodDesc: foodDesc,
        upvotes: upvotes,
        searchedRestaurant: searchedRestaurant,
        eatagain: eatagain

    }
}

export const setFoodItemImage = foodImage => {
    return {
        type: SET_FOOD_IMAGE,
        payload: foodImage,
    }
}