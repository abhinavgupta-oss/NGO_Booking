import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  Text,
} from "react-native";

import { Images } from "../../utility/utility";

interface Props {
  isLoading: boolean;
}

interface State {
  isLoading: boolean;
  dotText: string;
}

class CustomeLoading extends Component<Props, State> {
  dotInterval: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: props.isLoading || false,
      dotText: "",
    };
  }

  static getDerivedStateFromProps(nextProps: Props) {
    return {
      isLoading: nextProps.isLoading,
    };
  }

  componentDidMount() {
    if (this.state.isLoading) {
      this.startDotAnimation();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isLoading && !prevProps.isLoading) {
      this.startDotAnimation();
    }

    if (!this.props.isLoading && prevProps.isLoading) {
      this.stopDotAnimation();
    }
  }

  componentWillUnmount() {
    this.stopDotAnimation();
  }

  startDotAnimation = () => {
    // Prevent multiple intervals
    if (this.dotInterval) {
      return;
    }

    let count = 0;

    this.dotInterval = setInterval(() => {
      const dots = ".".repeat((count % 5) + 1);

      this.setState({
        dotText: dots,
      });

      count++;
    }, 250);
  };

  stopDotAnimation = () => {
    if (this.dotInterval) {
      clearInterval(this.dotInterval);
      this.dotInterval = null;
    }

    this.setState({
      dotText: "",
    });
  };

  render() {
    const { isLoading, dotText } = this.state;

    return (
      <Modal
        transparent
        animationType="fade"
        visible={isLoading}
        statusBarTranslucent
      >
        <View style={styles.modalBackground}>
          <View style={styles.loaderWrapper}>
            <Image
              source={Images.login}
              style={styles.loaderImage}
              resizeMode="contain"
            />

            <Text style={styles.dotText}>
              {dotText}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  loaderWrapper: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderImage: {
    width: 120,
    height: 120,
  },

  dotText: {
    marginTop: -60,
    fontSize: 50,
    color: "#ba5106",
    fontWeight: "700",
    letterSpacing: 2,
  },
});

export default CustomeLoading;