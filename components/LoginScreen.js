import { useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, Text, Modal, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {  useAuth } from '../context/AuthContext';
import ReCaptcha from '@valture/react-native-recaptcha-v3';

const SITE_KEY = '6LciVQIrAAAAAM04dH-kYLq8xmPX_QyXrQGJZO04'; 

const LoginScreen = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();
  const recaptchaRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAttempts, setErrorAttempts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [honeypot, setHoneypot] = useState(''); 
  const [timeToken, setTimeToken] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [recaptchaRequired, setRecaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState();

  const handleVerify = async () => {
    try {
      const token = await recaptchaRef.current?.getToken('Login');
      console.log('reCAPTCHA token:', token);
      setCaptchaToken(token);
    } catch (error) {
      console.error('reCAPTCHA error:', error);
    }
  };
  const handleInputChange = (text) => {
    if (text.length <= 10) {
      setPhone(text);
    }
  };
  useEffect(() => {
    const fetchFormSetup = async () => {
        try {
            const response = await fetch('https://assessment-server-tr6b.onrender.com/userAPI/form-setup');
            const result = await response.json();

            if (!response.ok) throw new Error('Failed to fetch form setup');

            setRecaptchaRequired(result.recaptchaRequired);
            setTimeToken(result.timeToken);
            setTimeStart(Date.now()); 
        } catch (error) {
            console.error('Error fetching form setup:', error);
            Alert.alert('Error', 'Failed to initialize form.');
        }
    };

    fetchFormSetup();
}, [errorAttempts]);

  const validateInputs = () => {
    const phoneRegex = /^05\d{8}$/; // 10 digits, starts with 05

    return (
      phoneRegex.test(phone) 
    );
  };

  const isFormSubmissionTimeValid = () => {
    if (!timeStart) return false;
    const elapsed = (Date.now() - timeStart) / 1000; // Convert to seconds
    return elapsed >= 3 && elapsed <= 480; // 3 seconds to 8 minutes
  };

  const handleLogin = async () => {
    if (honeypot) {
      console.warn('Bot detected via honeypot!');
      return;
    }

    if (!validateInputs()) {
      setErrorAttempts(prev => prev + 1);
      console.log(errorAttempts)
      setErrorMessage('Invalid phone number. Please try again');

      return;
    }

    if (!isFormSubmissionTimeValid()) {
        setErrorAttempts(prev => prev + 1);
        setErrorMessage('Time check failed. Please try again');
      console.log(errorAttempts)
        return;
    }

    setErrorMessage(''); 
    if (recaptchaRequired || errorAttempts >= 3) {
       await handleVerify();
       await new Promise(resolve => setTimeout(resolve, 1000)); // delay for setstate async schenanigans 
      if (!captchaToken) {
        setErrorMessage('reCaptcha failed. Please try again');
        Alert.alert('reCAPTCHA failed. Please try again.');
        return;
      }
    }
    console.log(errorAttempts);


    try {
        await login(phone, errorAttempts, captchaToken, honeypot, timeToken);
        navigation.replace('Construction');
      } catch (error) {
        setErrorAttempts(prev => prev + 1);
        setErrorMessage(error.message || 'Login failed. Try again.');
    }
    // const response = await fetch('https://assessment-server-tr6b.onrender.com/userapi/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     phone,
    //     errorAttempts,
    //     captchaToken,
    //     honeypot,
    //     timeToken,
    //   }),
    // });

    // const result = await response.json();
    // console.log(result);
    // console.log(response);
    // if (!response.ok) {
    //   setErrorAttempts(prev => prev + 1); 
    //   Alert.alert(result.message || 'Login failed. Try again.');
    //   console.log(result.message);
    //   return;
    // }
    // // Alert.alert("בוצע בהצלחה")
    // navigation.replace("Construction")
    // // setShowModal(true); work on custom modal later
  };

  return (
    <View style={styles.container}>
        <View style={styles.paddingContainerTwo}></View>
        <View style={styles.paddingContainer}>
            <Image source={require("../assets/login-image.png")} style={styles.image} />
        </View>

        <View style={styles.inputContainer}>
        <TextInput
          style={styles.hiddenInput}
          value={phone}
          onChangeText={handleInputChange}
          maxLength={10}
          keyboardType="numeric"
        />
        <View style={styles.dashContainer}>
          <Text style={styles.dash}>{phone[0] ? phone[0] : '_'}</Text>
          <Text style={styles.dash}>{phone[1] ? phone[1] : '_'}</Text>
          <Text style={styles.dash}>{phone[2] ? phone[2] : '_'}</Text>
          <Text style={styles.dash}>-</Text>
          <Text style={styles.dash}>{phone[3] ? phone[3] : '_'}</Text>
          <Text style={styles.dash}>{phone[4] ? phone[4] : '_'}</Text>
          <Text style={styles.dash}>{phone[5] ? phone[5] : '_'}</Text>
          <Text style={styles.dash}>{phone[6] ? phone[6] : '_'}</Text>
          <Text style={styles.dash}>{phone[7] ? phone[7] : '_'}</Text>
          <Text style={styles.dash}>{phone[8] ? phone[8] : '_'}</Text>
          <Text style={styles.dash}>{phone[9] ? phone[9] : '_'}</Text>
        </View>
      </View>

      { (recaptchaRequired || errorAttempts >= 3) && (
        <ReCaptcha
        ref={recaptchaRef}
        siteKey={SITE_KEY}
        baseUrl="localhost:3002"
        onVerify={(token) => console.log('Verified:', token)}
        onError={(error) => console.error('Error:', error)}
      />
      )}
      <TextInput 
        placeholder="Leave blank" 
        value={honeypot} 
        onChangeText={setHoneypot} 
        style={styles.honeypot} 
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* <Button style={styles.button} title="הלאה" onPress={handleLogin} /> */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>הלאה</Text>
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide" onRequestClose={() => {
            setShowModal(false);
            navigation.navigate('AccountChoice');
        }}>
        <View style={styles.button}>
          <Text>הרשמה בוצע בהצלחה</Text>
          <Button title="OK" onPress={() => {
            try {
                navigation.replace('AccountChoice');
              } catch (error) {
                console.error('Navigation error:', error);
            }
            setShowModal(false);
          }} />
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 20,
    },
    paddingContainer: {
        flex: 1
    }, 
    paddingContainerTwo: {
        flex: 0.5
    }, 
    image: {
        resizeMode: "contain",
        transform: "scale(2)",
        width: 200,
        height: 200
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    hiddenInput: {
      position: 'absolute',
      width: '100%',
      height: 40,
      opacity: 0,
    },
    dashContainer: {
      flexDirection: 'row',
    },
    dash: {
      fontSize: 20,
      marginHorizontal: 5,
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
    },
    honeypot: {
        position: 'absolute',
        left: -9000 - Math.floor(Math.random() * 999),
    },
    errorText: {
        color: "red"
    }
  });

export default LoginScreen;
