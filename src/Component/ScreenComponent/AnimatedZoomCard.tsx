import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ViewStyle,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  children: React.ReactNode;
  scrollY: Animated.Value;
  style?: ViewStyle | ViewStyle[];
  maxScale?: number;
}

const AnimatedZoomCard = ({
  children,
  scrollY,
  style,
  maxScale = 1.08,
}: Props) => {
  const [cardY, setCardY] = useState(0);

  const scale = scrollY.interpolate({
    inputRange: [
      cardY - SCREEN_HEIGHT,
      cardY - SCREEN_HEIGHT / 2,
      cardY,
      cardY + SCREEN_HEIGHT / 2,
      cardY + SCREEN_HEIGHT,
    ],
    outputRange: [0.95, 1, maxScale, 1, 0.95],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [
      cardY - SCREEN_HEIGHT,
      cardY,
      cardY + SCREEN_HEIGHT,
    ],
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      onLayout={(event) => {
        setCardY(event.nativeEvent.layout.y);
      }}
      style={[
        style,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedZoomCard;