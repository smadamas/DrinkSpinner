import React from 'react';
import { ActivityIndicator } from 'react-native';

const LoadingIcon = ({ isIconAnimating }) => <ActivityIndicator size="large" color="black" animating={isIconAnimating} />;

export default LoadingIcon;