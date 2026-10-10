import { FlatList, StyleSheet, Text, View } from 'react-native';
import { rupiah, tanggalLokal } from '../helpers';
import { colors } from '../theme';
import Tombol from './Tombol';

export default function DaftarPengeluaran({ items, disabled, loading, onAdd, onRefresh, onSelect }) {
    const now = new Date();
    const today = tanggalLokal([
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-'));
    const header = (
        <View style={styles.header}>
            <Text style={styles.heading}>Daftar pengeluaran</Text>
            <Text style={styles.subtitle}>{items.length} pengeluaran  •  {today}</Text>
            <View style={styles.actions}>
                <Tombol title="Tambah pengeluaran" onPress={onAdd}
                    disabled={disabled} style={styles.addButton} />
                <Tombol title="Muat ulang" tone="secondary" onPress={onRefresh}
                    disabled={disabled} style={styles.refreshButton} />
            </View>
        </View>
    );

    return (
        <View style={styles.screen}>
            <FlatList data={items} keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={header}
                refreshing={loading} onRefresh={onRefresh}
                contentContainerStyle={[styles.list, !items.length && styles.emptyList]}
                ListEmptyComponent={!disabled ? <Text style={styles.empty}>
                    Belum ada pengeluaran.</Text> : null}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>{item.judul}</Text>
                        <Text style={styles.itemText}>{rupiah(item.nominal)}</Text>
                        <View style={styles.itemMeta}>
                            <Text style={styles.category}>{item.kategori || 'Tanpa kategori'}</Text>
                            <Text style={styles.date}>{tanggalLokal(item.tanggal)}</Text>
                        </View>
                        <Tombol title="Lihat detail" tone="quiet" onPress={() => onSelect(item.id)}
                            disabled={disabled} style={styles.detailButton} />
                    </View>
                )} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: { paddingTop: 14, paddingBottom: 2 },
    heading: { color: colors.text, fontSize: 20, fontWeight: '700' },
    subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 18 },
    actions: { flexDirection: 'row', gap: 8, marginBottom: 6 },
    addButton: { flex: 1.55 },
    refreshButton: { flex: 1 },
    list: { paddingBottom: 22, flexGrow: 1 },
    emptyList: { flexGrow: 1 },
    item: {
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
        borderRadius: 9, padding: 11, marginBottom: 8,
    },
    itemTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
    itemText: { color: colors.text, fontSize: 13, marginTop: 2 },
    itemMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
    category: { color: colors.muted, fontSize: 11 },
    date: { color: colors.muted, fontSize: 11 },
    detailButton: { alignSelf: 'flex-start', minHeight: 22, paddingHorizontal: 0, marginTop: 1 },
    empty: {
        color: colors.muted, fontSize: 13, paddingVertical: 22,
        textAlign: 'center',
    },
});