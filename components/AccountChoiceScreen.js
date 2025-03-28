import { useNavigation } from "@react-navigation/native";

const { Text, View, TouchableOpacity, Image, StyleSheet } = require("react-native")
const AccountChoiceScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
          
          <View style={styles.imageContainer}>
          <View style={styles.bottomImageContainer}>
          </View>
            <View style={styles.topImageContainer}>
              <Image source={require('../assets/app-logo.png')} style={styles.image}/>
              <Image source={require('../assets/manishr-text.png')} style={styles.image} />
            </View>
            
          </View>
          {/* Register Button */}
          <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.buttonRegisterText}>הרשמה</Text>
          </TouchableOpacity>
    
          {/* Login Button */}
          <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonLoginText}>יש לי כבר חשבון</Text>
          </TouchableOpacity>
          <View style={styles.bottomImageContainer}>
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: "#f0f7f7",
    },
    imageContainer: {
      flex: 6,
      width: '100%',
    },
    topImageContainer: {
      flex: 1.5,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomImageContainer: {
      flex: .5
    },
    image: {
      flex: 1, 
      width: '80%',
      margin: 'auto',
      resizeMode: 'contain',
    },
    buttonRegister: {
      paddingVertical: 15,
      paddingHorizontal: 83,
      borderRadius: 30,
      marginBottom: 10,
      backgroundColor: '#39B54A',

    },
    buttonRegisterText: {
      fontSize: 18,
      color: '#fff',
      fontFamily: 'Rubik',
    },
    buttonLogin: {
      backgroundColor: '#FFF',
      borderWidth: 2,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 30,
      borderColor: "#39B54A"
    },
    buttonLoginText: {
      fontSize: 18,
      color: '#39B54A',
      fontFamily: 'Rubik',
    },
  });
export default AccountChoiceScreen;