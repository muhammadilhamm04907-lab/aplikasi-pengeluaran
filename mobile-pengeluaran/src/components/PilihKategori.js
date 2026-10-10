import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import Tombol from './Tombol';

export default function PilihKategori({ categories, categoryId, setCategoryId,
    onBack, onUse, disabled }) {
    const options = [{ id: null, nama: 'Tanpa kategori', deskripsi: 'Tidak menggunakan kategori' },
        ...categories];

    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Pilih kategori</Text>
            <Text style={styles.subtitle}>Kategori bersifat opsional.</Text>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.instructions}>Pilih satu kategori untuk pengeluaran baru.</Text>
                <View style={styles.options}>
                    {options.map((category) => {
                        const chosen = String(categoryId ?? '') === String(category.id ?? '');
                        return (
                            <Pressable key={String(category.id ?? 'none')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: chosen }}
                                disabled={disabled}
                                onPress={() => setCategoryId(category.id ?? null)}
                                style={[styles.option, chosen && styles.chosen]}>
                                <View style={[styles.radio, chosen && styles.radioChosen]}>
                                    {chosen && <View style={styles.radioDot} />}
                                </View>
                                <View style={styles.optionCopy}>
                                    <Text style={styles.optionTitle}>{category.nama}</Text>
                                    <Text style={styles.optionDescription}>
                                        {category.deskripsi || (category.id == null
                                            ? 'Tidak menggunakan kategori'
                                            : `ID kategori ${category.id}`)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                    {!categories.length && <Text style={styles.empty}>
                        Belum ada kategori lain yang tersedia.
                    </Text>}
                </View>
                <View style={styles.actions}>
                    <Tombol title="Kembali" tone="secondary" onPress={onBack}
                        disabled={disabled} style={styles.action} />
                    <Tombol title="Gunakan kategori" onPress={onUse}
                        disabled={disabled} style={styles.action} />
                </View>
                <Text style={styles.hint}>
                    Pilihan akan ditampilkan pada Form terisi. ID hanya ilustrasi.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 14 },
    subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 24 },
    content: { paddingBottom: 24 },
    instructions: { color: colors.text, fontSize: 12, marginBottom: 13 },
    options: { gap: 8 },
    option: {
        minHeight: 62, backgroundColor: colors.surface, borderWidth: 1,
        borderColor: colors.border, borderRadius: 9, paddingHorizontal: 11,
        flexDirection: 'row', alignItems: 'center', gap: 10,
    },
    chosen: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
    radio: {
        width: 18, height: 18, borderRadius: 9, borderWidth: 1,
        borderColor: '#BCC5D3', alignItems: 'center', justifyContent: 'center',
    },
    radioChosen: { borderColor: colors.primary },
    radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
    optionCopy: { flex: 1 },
    optionTitle: { color: colors.text, fontSize: 13, fontWeight: '600' },
    optionDescription: { color: colors.muted, fontSize: 10, marginTop: 3 },
    empty: { color: colors.muted, fontSize: 12, paddingVertical: 8 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
    action: { flex: 1 },
    hint: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 13 },
});
