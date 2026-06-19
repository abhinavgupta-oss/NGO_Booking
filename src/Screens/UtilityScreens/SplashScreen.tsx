import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useToast } from '../../Component/Toast/ToastContext';
// import LinearGradient from 'react-native-linear-gradient';
import { getAccessToken, isUserLoggedIn } from '../../Stores/AuthStore/AuthStorage';
// import { DevoteemyProfile } from '../../Services/Devotee/DevoteeServices';
import { Images } from '../../utility/utility';
import { colors } from '../../utility/AppTheam';
import { getAppdetails } from '../../Services/Utils/UtilsService';
import DeviceInfo from 'react-native-device-info';

interface BuildType {
    VersionCode?: string;
}

const SplashScreen = () => {
    const navigation = useNavigation<any>();
    // const { showToast } = useToast();

    // const [build, setBuild] = useState<BuildType | null>(null);
    // const [deviceBuild, setDeviceBuild] = useState('');

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const timer = setTimeout(async () => {
                    const isLoggedIn = await isUserLoggedIn();
                    console.log("isLoggedIn", isLoggedIn)
                    const getTokenresp = await getAccessToken()
                    console.log("getTokenresp", getTokenresp)
                    const appDetails = await getAppdetails()
                    console.log("appDetails", appDetails)
                    const currentApp = DeviceInfo.getVersion();
                    console.log("currentApp", currentApp)
                    if (appDetails?.versionName > currentApp) {
                        navigation.replace("Update",{latest:appDetails})
                    }
                    else {
                        if (isLoggedIn) {
                            navigation.replace("Dashboard");
                        } else {
                            navigation.replace("Login");
                        }
                    }

                }, 3000);

                return () => clearTimeout(timer);
            } catch (error) {
                console.log("Login Check Error:", error);
            }
        };

        checkLogin();
    }, []);


    return (
        <ImageBackground
            source={Images.Splash}
            style={styles.background}
            imageStyle={{ resizeMode: 'cover' }}
        >
            <View style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}>
                <View style={{ width: "100%", height: "50%" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                        <Text style={{ fontSize: 20, fontFamily: "Poppins-SemiBold", color: colors.primary }}>Seva • Shraddha • Samarpan</Text>
                        <Text style={{ fontSize: 70, fontFamily: "Poppins-SemiBold", color: colors.primary }}>TTG NGO</Text>
                        <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold", color: colors.primary }}>गौतीर्थ तुलसी तपोवन गौशाला</Text>
                        <Text style={{ fontSize: 10, fontFamily: "Poppins-SemiBold", color: colors.primary }}>Jay Gau Mata, Jay Gopal.!</Text>
                        <Text style={{ fontSize: 90, color: "#ff7A00" }}>ॐ</Text>
                    </View>
                </View>
                {/* गौतीर्थ तुलसी तपोवन गौशाला */}
            </View>

        </ImageBackground>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '110%',
    },

    centerContainer: {
        position: 'absolute',
        left: "40%",
        top: "70%",
    },

    logo: {
        width: 100,
        height: 100,
    },

    versionBox: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
    },

    versionText: {
        color: '#fff',
        fontSize: 14,
    },
});
