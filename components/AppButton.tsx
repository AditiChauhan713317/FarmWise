import React from "react";
import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";
import { AppText } from "./AppText";

type AppButtonProps = PressableProps & {
  title: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary";
};

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  containerStyle,
  textStyle,
  variant = "primary",
  ...rest
}) => {
  return (
    <Pressable
      {...rest}
      className={`${
        variant === "primary" ? "bg-primary" : "bg-secondary"
      } rounded-xl px-4 py-3 items-center justify-center`}
      style={containerStyle}
    >
      <AppText
        weight="bold"
        colorClassName={
          variant === "primary" ? "text-primary-foreground" : "text-secondary-foreground"
        }
        sizeClassName="text-base"
        style={textStyle}
      >
        {title}
      </AppText>
    </Pressable>
  );
};


