import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { useTheme } from './CountryTheme';
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export const CountryModal = ({ children, withModal, ...props }) => {
    const { backgroundColor } = useTheme();
    const content = (React.createElement(SafeAreaView, { style: [styles.container, { backgroundColor }] }, children));
    if (withModal) {
        return React.createElement(Modal, Object.assign({}, props), content);
    }
    return content;
};
CountryModal.defaultProps = {
    animationType: 'slide',
    animated: true,
    withModal: true
};
//# sourceMappingURL=CountryModal.js.map