import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const ConstructionScreen = () => {
    const {user, logout} = useAuth();
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>האפליקציה בבנייה</Text>
            {/* The code below was just used to verify that the user was logged in properly and to log out*/}
            {/* <Text style={styles.text}>Hello {user?.user}</Text>
            <TouchableOpacity style={styles.button} onPress={()=>{
                logout();
                navigation.navigate("AccountChoice");}}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f7f7", 
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#000", 
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Rubik",
        writingDirection: "rtl", 
    },
    button: {
        color: "#FFF",
        backgroundColor: "#39B54A",
    }
});

export default ConstructionScreen;
