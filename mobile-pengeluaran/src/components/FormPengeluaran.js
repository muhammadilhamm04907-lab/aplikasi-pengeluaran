import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';
import Tombol from './Tombol';

const formatNominal = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function FormPengeluaran({ mode, judul, setJudul, nominal, setNominal,
    categories, categoryId, onChooseCategory, onSave, onBack, disabled }) {
    const creating = mode === 'create';
    const selectedCategory = categories.find((category) =>
        String(category.id) === String(categoryId));

    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>{creating ? 'Tambah pengeluaran' : 'Ubah pengeluaran'}</Text>
            <Text style={styles.subtitle}>
                {creating ? 'Isi judul dan nominal pengeluaran baru.' : 'Perbarui informasi pengeluaran.'}
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
                <Text style={styles.label}>Judul</Text>
                <TextInput style={styles.input} value={judul} onChangeText={setJudul}
                    accessibilityLabel="Judul" editable={!disabled} maxLength={100}
                    placeholder="Masukkan judul pengeluaran"
                    placeholderTextColor={colors.muted} />

                <Text style={styles.label}>Nominal rupiah</Text>
                <TextInput style={styles.input} value={nominal ? formatNominal(nominal) : ''}
                    onChangeText={(value) => setNominal(value.replace(/\D/g, ''))}
                    keyboardType="number-pad" accessibilityLabel="Nominal rupiah" editable={!disabled}
                    placeholder="Contoh: 18000" placeholderTextColor={colors.muted} />

                {creating && <>
                    <Text style={styles.label}>Kategori (opsional)</Text>
                    <View style={styles.selectedCategory}>
                        <Text style={styles.selectedCategoryText}>
                            {selectedCategory?.nama || 'Tanpa kategori'}
                        </Text>
                    </View>
                    <Tombol title="Pilih kategori" tone="secondary" onPress={onChooseCategory}
                        disabled={disabled} style={styles.categoryButton} />
                    <Text style={styles.automaticDate}>Tanggal diisi otomatis oleh server.</Text>
                </>}

                <View style={styles.actions}>
                    <Tombol title="Kembali" tone="secondary" onPress={onBack}
                        disabled={disabled} style={styles.action} />
                    <Tombol title={disabled ? 'Menyimpan...' : 'Simpan'} onPress={onSave}
                        disabled={disabled} style={styles.action} />
                </View>
                {creating && <Text style={styles.hint}>
                    Kategori boleh dikosongkan. Pengeluaran akan tampil sebagai Tanpa kategori.
                </Text>}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 14 },
    subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 20 },
    content: { paddingBottom: 24 },
    label: { color: colors.text, fontSize: 12, fontWeight: '600', marginBottom: 7 },
    input: {
        minHeight: 44, backgroundColor: colors.surface, borderWidth: 1,
        borderColor: colors.border, borderRadius: 7, paddingHorizontal: 11,
        marginBottom: 16, color: colors.text, fontSize: 13,
    },
    selectedCategory: {
        minHeight: 42, justifyContent: 'center', backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.border, borderRadius: 7, paddingHorizontal: 11,
    },
    selectedCategoryText: { color: colors.text, fontSize: 13 },
    categoryButton: { marginTop: 7 },
    automaticDate: { color: colors.muted, fontSize: 11, marginTop: 12 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 18 },
    action: { flex: 1 },
    hint: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 13 },
});
