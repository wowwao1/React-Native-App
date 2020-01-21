import * as React from 'react';
export declare const CountryModal: {
    ({ children, withModal, ...props }: import("react-native").ModalBaseProps & import("react-native").ModalPropsIOS & import("react-native").ModalPropsAndroid & {
        children: React.ReactNode;
        withModal?: boolean | undefined;
    }): JSX.Element;
    defaultProps: {
        animationType: string;
        animated: boolean;
        withModal: boolean;
    };
};
