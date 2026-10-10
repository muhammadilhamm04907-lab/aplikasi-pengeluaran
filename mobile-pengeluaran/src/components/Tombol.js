import { Pressable, StyleSheet, Text } from 'react-native';

export default function Tombol({ title, onPress, disabled = false, tone = 'primary', style }) {
    return (
        <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
            style={({ pressed }) => [styles.button, styles[tone], disabled && styles.disabled,
                pressed && !disabled && styles.pressed, style]}>
            <Text style={[
                styles.label,
                tone === 'quiet' && styles.quietLabel,
                tone === 'secondary' && styles.secondaryLabel,
                tone === 'danger' && styles.dangerLabel,
            ]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 44, paddingHorizontal: 14, borderRadius: 9,
        alignItems: 'center', justifyContent: 'center',
    },
    primary: { backgroundColor: '#2563EB' },
    secondary: {
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8DEE8',
    },
    danger: { backgroundColor: '#DC2626' },
    quiet: { backgroundColor: 'transparent', alignItems: 'flex-start' },
    label: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
    quietLabel: { color: '#2563EB', fontWeight: '500' },
    secondaryLabel: { color: '#1F2937' },
    dangerLabel: { color: '#FFFFFF' },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.78 },
});