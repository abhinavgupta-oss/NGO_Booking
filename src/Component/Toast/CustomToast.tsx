import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import { Icons} from '../../utility/utility';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'warning';

type Props = {
    visible: boolean;
    type: ToastType;
    message: string;
    onHide: () => void;
};

const CustomToast: React.FC<Props> = ({ visible, type, message, onHide }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(onHide);
                }, 2000);
            });
        }
    }, [visible]);

    if (!visible) return null;

    const backgroundColor = {
        success: 'rgba(230, 244, 234, 0.95)',
        error: 'rgba(253, 234, 234, 0.95)',
        warning: 'rgba(255, 249, 196, 0.95)',
    };

    const borderColor = {
        success: '#B7E1CD',
        error: '#F5C6CB',
        warning: '#FFECB3',
    };

    const textColor = {
        success: '#267A3E',
        error: '#D93025',
        warning: '#E65100',
    };

    const iconMap = {
        success: Icons.success,
        error: Icons.error,
        warning: Icons.warning,
    };

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    backgroundColor: backgroundColor[type],
                    borderColor: borderColor[type],
                    opacity: fadeAnim,
                },
            ]}
        >
            <View style={styles.innerContent}>
                <Image
                    source={iconMap[type]}
                    style={styles.icon}
                />
                <View style={styles.tostTest}>
                <Text style={[styles.text, { color: textColor[type] }]}>
                    {message}
                </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        zIndex: 9999,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        marginTop:50
    },
    innerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    tostTest:{
        width:"80%",
        marginRight:20
    }
});

export default CustomToast;
