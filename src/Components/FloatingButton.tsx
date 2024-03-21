import React from "react";
import { View } from "react-native";
import { FAB } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack, Button } from "@react-native-material/core";

interface FloatingButtonProps {
  title: string;
  isLoading?: boolean;
  onPress: () => void;
  style?: any;
  titleStyle?: any;
  disabled?: boolean;
  variant:string;
  icon:string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  title,
  isLoading = false,
  onPress,
  style = {},
  titleStyle = {},
  disabled = false,
  variant,
  icon,
}) => (
  <Stack fill center spacing={4}>
    <Button
      variant={variant} // Using the variant prop value
      title={title}
      trailing={(props) => <Icon name={icon} {...props} />}
      onPress={onPress} // Assigning the onPress prop to the Button component
      isLoading={isLoading} // Assigning the isLoading prop to the Button component
      style={[{ zIndex: 1 }, style]} // Update style prop with zIndex set to 1
      titleStyle={titleStyle} // Assigning the titleStyle prop to the Button component
      disabled={disabled} // Assigning the disabled prop to the Button component
    />
  </Stack>
);


export default FloatingButton;
