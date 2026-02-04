/**
 * React Icons Wrapper for React Native
 * Allows using react-icons in React Native with react-native-svg
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Rect, Circle, Line, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    style?: any;
}

// RiChatAiLine icon from Remix Icons
export function RiChatAiLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M10.5 3C15.1944 3 19 6.80558 19 11.5C19 16.1944 15.1944 20 10.5 20C8.67165 20 6.9822 19.4041 5.60534 18.3939L2 20L3.53815 16.3199C2.56603 14.883 2 13.1587 2 11.5C2 6.80558 5.80558 3 10.5 3ZM10.5 5C6.91015 5 4 7.91015 4 11.5C4 12.8778 4.43133 14.1573 5.17126 15.2224L5.40895 15.5558L4.71199 17.288L6.35206 16.5059L6.70319 16.7834C7.8004 17.5637 9.1055 18 10.5 18C14.0899 18 17 15.0899 17 11.5C17 7.91015 14.0899 5 10.5 5ZM13.5 7L14.5 7L14.5 9L13.5 9C12.6716 9 12 9.67157 12 10.5L12 11L14.5 11L14.5 13L12 13L12 16L10 16L10 13L8.5 13L8.5 11L10 11L10 10.5C10 8.567 11.567 7 13.5 7ZM22 3V12H20V5H18V3H22Z" />
            </Svg>
        </View>
    );
}

// RiChatAiFill icon from Remix Icons
export function RiChatAiFill({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M10.5 3C15.1944 3 19 6.80558 19 11.5C19 16.1944 15.1944 20 10.5 20C8.67165 20 6.9822 19.4041 5.60534 18.3939L2 20L3.53815 16.3199C2.56603 14.883 2 13.1587 2 11.5C2 6.80558 5.80558 3 10.5 3ZM13.5 7C11.567 7 10 8.567 10 10.5V11H8.5V13H10V16H12V13H14.5V11H12V10.5C12 9.67157 12.6716 9 13.5 9H14.5V7H13.5ZM22 3V12H20V5H18V3H22Z" />
            </Svg>
        </View>
    );
}

// RiChatSmileAiLine icon from Remix Icons (chat with smile)
export function RiChatSmileAiLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7.58075 18.711L8.23428 19.0605C9.38248 19.6745 10.6655 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.3345 4.32549 14.6175 4.93949 15.7657L5.28896 16.4192L4.63416 19.3658L7.58075 18.711ZM7 12H9C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12H17C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12Z" />
            </Svg>
        </View>
    );
}

// RiChatSmileAiFill icon from Remix Icons (chat with smile - filled)
export function RiChatSmileAiFill({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12H15C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12H7Z" />
            </Svg>
        </View>
    );
}

// RiRobot2Line icon from Remix Icons
export function RiRobot2Line({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M13 4.05508C16.9463 4.55151 20 7.92191 20 12V20H4V12C4 7.92191 7.05369 4.55151 11 4.05508V2H13V4.05508ZM18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12V18H18V12ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM14.5 14C15.3284 14 16 13.3284 16 12.5C16 11.6716 15.3284 11 14.5 11C13.6716 11 13 11.6716 13 12.5C13 13.3284 13.6716 14 14.5 14ZM9 16H15V17H9V16Z" />
            </Svg>
        </View>
    );
}

// RiRobot2Fill icon from Remix Icons
export function RiRobot2Fill({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M13 4.05508C16.9463 4.55151 20 7.92191 20 12V20H4V12C4 7.92191 7.05369 4.55151 11 4.05508V2H13V4.05508ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM14.5 14C15.3284 14 16 13.3284 16 12.5C16 11.6716 15.3284 11 14.5 11C13.6716 11 13 11.6716 13 12.5C13 13.3284 13.6716 14 14.5 14ZM9 16H15V17H9V16Z" />
            </Svg>
        </View>
    );
}

// RiSendPlaneFill icon from Remix Icons
export function RiSendPlaneFill({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0433C16.1223 22.5718 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99994 12L1.94607 9.31543Z" />
            </Svg>
        </View>
    );
}

// RiInformationLine icon from Remix Icons
export function RiInformationLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" />
            </Svg>
        </View>
    );
}

// RiMailLine icon from Remix Icons
export function RiMailLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23795L12.0718 14.3307L4 7.21594V19H20V7.23795ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z" />
            </Svg>
        </View>
    );
}

// RiHistoryLine icon from Remix Icons
export function RiHistoryLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.13781 4 6.61118 5.50346 5.17145 7.75L8 9H2V3L4.31649 5.31649C6.16853 3.32135 8.91977 2 12 2ZM13 7V12.4142L16.2071 15.6213L14.7929 17.0355L11 13.2426V7H13Z" />
            </Svg>
        </View>
    );
}

// RiArrowRightSLine icon from Remix Icons
export function RiArrowRightSLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
            </Svg>
        </View>
    );
}

// RiRefreshLine icon from Remix Icons (for Updates)
export function RiRefreshLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" />
            </Svg>
        </View>
    );
}

// RiStarLine icon from Remix Icons (for Rate App)
export function RiStarLine({ size = 24, color = '#000000', style }: IconProps) {
    return (
        <View style={[styles.iconContainer, { width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z" />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
