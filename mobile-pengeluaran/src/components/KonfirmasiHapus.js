import { StyleSheet, Text, View } from 'react-native';
import { rupiah } from '../helpers';
import { colors } from '../theme';
import Tombol from './Tombol';

export default function KonfirmasiHapus({ item, onCancel, onConfirm, disabled }) {
    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Konfirmasi hapus</Text>
            <Text style={styles.subtitle}>Periksa kembali sebelum menghapus data.</Text>
            <View style={styles.panel}>
                <Text style={styles.question}>Hapus pengeluaran ini?</Text>
                <Text style={styles.title}>{item?.judul}</Text>
                <Text style={styles.amount}>{rupiah(item?.nominal)}</Text>
                <Text style={styles.warning}>
                    Data yang sudah dihapus tidak dapat dikembalikan.
                </Text>
            </View>
            <View style={styles.actions}>
                <Tombol title="Batal" tone="secondary" onPress={onCancel}
                    disabled={disabled} style={styles.action} />
                <Tombol title={disabled ? 'Menghapus...' : 'Hapus'} tone="danger"
                    onPress={onConfirm} disabled={disabled} style={styles.action} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 14 },
    subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 20 },
    panel: {
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
        borderRadius: 9, padding: 14,
    },
    question: { color: colors.text, fontSize: 15, fontWeight: '700' },
    title: { color: colors.text, fontSize: 14, marginTop: 12 },
    amount: { color: colors.muted, fontSize: 13, marginTop: 4 },
    warning: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 16 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
    action: { flex: 1 },
});
