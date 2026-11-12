import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useReducedMotion } from '@/hooks';

export interface FadeInProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly duration?: number;
  readonly offset?: number;
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * A restrained entrance transition. It becomes a no-op when the operating
 * system asks for reduced motion.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 420,
  offset = 10,
  style,
}: FadeInProps) {
  const reducedMotion = useReducedMotion();
  const [progress] = useState(
    () => new Animated.Value(reducedMotion ? 1 : 0),
  );

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }

    const animation = Animated.timing(progress, {
      delay,
      duration,
      toValue: 1,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, progress, reducedMotion]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [offset, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
