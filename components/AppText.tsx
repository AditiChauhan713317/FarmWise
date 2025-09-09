import React from "react";
import { Text, TextProps } from "react-native";

type AppTextProps = TextProps & {
  weight?: "regular" | "bold";
  colorClassName?: string;
  sizeClassName?: string;
};

export const AppText: React.FC<AppTextProps> = ({
  children,
  weight = "regular",
  colorClassName = "text-foreground",
  sizeClassName = "text-base",
  style,
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: weight === "bold" ? "SpaceMono" : "SpaceMono" },
        style,
      ]}
      className={`${colorClassName} ${sizeClassName}`}
    >
      {children}
    </Text>
  );
};


