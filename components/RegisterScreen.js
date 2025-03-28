import { useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, Text, Modal, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import ReCaptcha from '@valture/react-native-recaptcha-v3';

const SITE_KEY = '6LciVQIrAAAAAM04dH-kYLq8xmPX_QyXrQGJZO04'; 

const RegisterScreen = () => {
  const navigation = useNavigation();

  const recaptchaRef = useRef(null);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorAttempts, setErrorAttempts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Should always be empty if user is real
  const [timeToken, setTimeToken] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [recaptchaRequired, setRecaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState();

  const handleRecaptchaSuccess = (token) => {
    setCaptchaToken(token);
    console.log('reCAPTCHA token:', token);
  };

  const handleVerify = async () => {
    try {
      const token = await recaptchaRef.current?.getToken('register');
      console.log('reCAPTCHA token:', token);
      setCaptchaToken(token);
    } catch (error) {
      console.error('reCAPTCHA error:', error);
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
    const nameRegex = /^[a-zA-Zא-ת\s]+$/; // Only letters and spaces
    const usernameRegex = /^[a-zA-Z]+$/; // Only letters
    const phoneRegex = /^05\d{8}$/; // 10 digits, starts with 05
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Min 8, at least 1 letter & 1 number

    return (
      nameRegex.test(fullname) &&
      usernameRegex.test(username) &&
      phoneRegex.test(phone) &&
      passwordRegex.test(password)
    );
  };

  const isFormSubmissionTimeValid = () => {
    if (!timeStart) return false;
    const elapsed = (Date.now() - timeStart) / 1000; // Convert to seconds
    return elapsed >= 3 && elapsed <= 480; // 3 seconds to 8 minutes
  };

  const getRecaptchaToken = async () => {
    try {
      const response = await fetch(
        `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
      );
      if (!response.ok) throw new Error('Failed to load reCAPTCHA');

      const token = await window.grecaptcha.execute(SITE_KEY, { action: 'register' });
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    }
  };

  const handleRegister = async () => {
    if (honeypot) {
      console.warn('Bot detected via honeypot!');
      return;
    }

    if (!validateInputs()) {
      setErrorAttempts(prev => prev + 1);
      console.log(errorAttempts)
      return;
    }

    if (!isFormSubmissionTimeValid()) {
        setErrorAttempts(prev => prev + 1);
      console.log(errorAttempts)

        return;
    }


    if (recaptchaRequired || errorAttempts >= 3) {
       await handleVerify();
      if (!captchaToken) {
        Alert.alert('reCAPTCHA failed. Please try again.');
        return;
      }
    }
    console.log(errorAttempts);

    const response = await fetch('https://assessment-server-tr6b.onrender.com/userapi/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname,
        username,
        phone,
        password,
        errorAttempts,
        captchaToken,
        honeypot,
        timeToken,
      }),
    });

    const result = await response.json();
    console.log(result);
    console.log(response);
    if (!response.ok) {
      Alert.alert(result.message || 'Registration failed. Try again.');
      console.log(result.message);
      if(result.message === "User created successfully.") navigation.goBack();
      return;
    }
    Alert.alert("הרשמה בוצע בהצלחה")
    navigation.replace("AccountChoice")
    // setShowModal(true); work on custom modal later
  };

  return (
    <View style={styles.container}>
        {/* <View style={styles.logoContainer}>
            <Image source={require("../assets/app-logo.svg")}  width="100" height="100" />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>&gt;</Text>
            </TouchableOpacity>
        </View> */}

        <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
                <Image 
                    source={require("../assets/app-logo.png")}  
                    style={styles.logo}
                />
            </View>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>&gt;</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.label}>מה השם שלך?</Text>
        <TextInput style={[styles.input, styles.name, fullname === '' && styles.placeholder]} maxLength={40} placeholder="ישראלה ישראלי"  onChangeText={setFullname} autoComplete="off"  />
        
        <Text style={styles.label}>שם משתמש</Text>
        <TextInput style={[styles.input, styles.name, username === '' && styles.placeholder]} value={username} onChangeText={setUsername} maxLength={30} placeholder="ישראלה" />

        <Text style={styles.label}>מספר טלפון</Text>
        <TextInput style={[styles.input, styles.phone, phone === '' && styles.placeholder]} placeholder="050-1234567" maxLength={10} keyboardType="phone-pad" value={phone} onChangeText={setPhone} autoComplete="off"  />

        <Text style={styles.label}>סיסמה</Text>
        <TextInput style={[styles.input, styles.pass]} placeholder="" value={password} onChangeText={setPassword} secureTextEntry autoComplete="off"/>
        <Text style={styles.passwordWarning}>*הסיסמא חייבת לכלול 8 תווים, לפחות ספרה אחת ואות אחת</Text>
      
      {/* <TextInput placeholder="Full Name" value={fullname} onChangeText={setFullname} autoComplete="off" /> */}

      {/* <TextInput placeholder="Username" value={username} onChangeText={setUsername} autoComplete="off" />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} autoComplete="off" keyboardType="numeric" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="off" /> */}

      {/* reCAPTCHA Component */}
      { (recaptchaRequired || errorAttempts >= 3) && (
        <ReCaptcha
        ref={recaptchaRef}
        siteKey={SITE_KEY}
        baseUrl="localhost:3002"
        onVerify={(token) => console.log('Verified:', token)}
        onError={(error) => console.error('Error:', error)}
      />
      )}
      {/* Honeypot - Hidden Off-Screen */}
      <TextInput 
        placeholder="Leave blank" 
        value={honeypot} 
        onChangeText={setHoneypot} 
        style={styles.honeypot} 
      />

      {/* <Button style={styles.button} title="הלאה" onPress={handleRegister} /> */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
  honeypot: {
    position: 'absolute',
    left: -9000 - Math.floor(Math.random()*999),
    width: 1,
    height: 1,
    opacity: 0, 
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: "#f0f7f7",
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Rubik',
    textAlign: 'right',
    fontWeight: "bold",
    marginBottom: 5,
  },
  passwordWarning: {
    fontSize: 12,
    fontFamily: 'Rubik',
    fontWeight: "bold",
    textAlign: 'right',
    marginBottom: 35,
  },
  input: {
    height: 40,
    borderBottomWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlign: 'right',
    marginLeft: 'auto',
  },
  placeholder: {
    fontWeight:300,
    fontSize: 13,
    color: "#808080",
  },
  phone: {
    width: "28%",
  },
  name: {
    width: "70%",
  },
  pass: {
    width: "100%",
  },
  button: {
    backgroundColor: '#39B54A',
    borderRadius: 30, 
    paddingVertical: 15, 
    marginHorizontal: 20, 
    marginBottom: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Rubik',
    fontWeight: "bold",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
},
logoWrapper: {
    marginTop: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
logo: {
    alignSelf: 'center',
    resizeMode: 'center',
},
backButton: {
    position: 'absolute',
    right: 10,
},
backButtonText: {
    fontSize: 24,
    color: 'black', 
}
});

export default RegisterScreen;
