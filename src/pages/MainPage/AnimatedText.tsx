import React, { useState, useEffect } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface AnimatedTextProps extends TextProps {
  children: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  ...textProps
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isWriting, setIsWriting] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const text = children;
    let currentIndex = 0;

    const animationCycle = () => {
      if (isWriting) {
        setOpacity(1);
        const writeInterval = setInterval(() => {
          if (isMounted && currentIndex <= text.length) {
            setDisplayText(text.slice(0, currentIndex));
            currentIndex++;

            if (currentIndex > text.length) {
              clearInterval(writeInterval);
              setTimeout(() => {
                setIsWriting(false);
                currentIndex = text.length;
              }, 4000);
            }
          }
        }, 100);

        return () => clearInterval(writeInterval);
      } else {
        const eraseInterval = setInterval(() => {
          if (isMounted && currentIndex >= 0) {
            setOpacity(currentIndex / text.length);
            setDisplayText(text.slice(0, currentIndex));
            currentIndex--;

            if (currentIndex < 0) {
              clearInterval(eraseInterval);
              setTimeout(() => {
                setIsWriting(true);
                setOpacity(1);
                currentIndex = 0;
              }, 500);
            }
          }
        }, 50);

        return () => clearInterval(eraseInterval);
      }
    };

    const cleanup = animationCycle();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [children, isWriting]);

  return (
    <Text
      h="30px"
      display="flex"
      alignItems="center"
      fontSize={{ base: "sm", md: "xl" }}
      mt={-2}
      fontWeight={"md"}
      opacity={opacity}
      transition="opacity 0.5s ease"
      {...textProps}
    >
      {displayText}
    </Text>
  );
};

export default AnimatedText;
