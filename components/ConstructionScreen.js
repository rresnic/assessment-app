import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

const ConstructionScreen = () => {
    const {user} = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>האפליקציה בבנייה</Text>
            <Text style={styles.text}>Hello {user}</Text>
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
        writingDirection: "rtl", 
    },
});

export default ConstructionScreen;
