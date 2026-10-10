import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { rupiah, tanggalLokal } from '../helpers';
import { colors } from '../theme';
import Tombol from './Tombol';

export default function DetailPengeluaran({ item, deleted = false, onEdit, onDelete, disabled }) {
    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Detail pengeluaran</Text>
            <Text style={styles.subtitle}>Informasi pengeluaran yang dipilih.</Text>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.panel}>
                    {!deleted && item && <>
                        <Text style={styles.label}>Judul pengeluaran</Text>
                        <Text style={styles.title}>{item.judul}</Text>
                        <Text style={styles.label}>Nominal</Text>
                        <Text style={styles.amount}>{rupiah(item.nominal)}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.label}>Kategori</Text>
                        <Text style={styles.text}>{item.kategori || 'Tanpa kategori'}</Text>
                        <Text style={styles.label}>Tanggal</Text>
                        <Text style={styles.text}>{tanggalLokal(item.tanggal)}</Text>
                        {item.catatan ? <>
                            <Text style={styles.label}>Catatan</Text>
                            <Text style={styles.text}>{item.catatan}</Text>
                        </> : null}
                    </>}
                </View>
                {deleted ? <Text style={styles.success}>Data berhasil dihapus</Text> : <>
                    <View style={styles.actions}>
                        <Tombol title="Ubah pengeluaran" tone="secondary" onPress={onEdit}
                            disabled={disabled} style={styles.action} />
                        <Tombol title="Hapus" tone="danger" onPress={onDelete}
                            disabled={disabled} style={styles.action} />
                    </View>
                </>}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 14 },
    subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 18 },
    content: { flexGrow: 1, paddingBottom: 20 },
    panel: {
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
        borderRadius: 9, padding: 14, gap: 7,
    },
    label: { color: colors.muted, fontSize: 11, marginTop: 3 },
    title: { color: colors.text, fontSize: 16, fontWeight: '700' },
    amount: { color: colors.text, fontSize: 18, fontWeight: '700' },
    text: { color: colors.text, fontSize: 14 },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
    action: { flex: 1 },
    success: { color: colors.primary, fontSize: 13, textAlign: 'center', marginTop: 16 },
});