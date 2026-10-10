import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, BackHandler, KeyboardAvoidingView,
    Platform, StatusBar, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api } from './src/api';
import DaftarPengeluaran from './src/components/DaftarPengeluaran';
import DetailPengeluaran from './src/components/DetailPengeluaran';
import FormPengeluaran from './src/components/FormPengeluaran';
import KonfirmasiHapus from './src/components/KonfirmasiHapus';
import PilihKategori from './src/components/PilihKategori';
import Tombol from './src/components/Tombol';
import { validate } from './src/helpers';
import { colors } from './src/theme';
export default function App() {
    return <SafeAreaProvider><Utama /></SafeAreaProvider>;
}
function Utama() {
    const [screen, setScreen] = useState('list');
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [deleted, setDeleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [judul, setJudul] = useState('');
    const [nominal, setNominal] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [draftCategoryId, setDraftCategoryId] = useState(null);
    const lock = useRef(false);
    async function load() {
        if (lock.current) return;
        lock.current = true; setLoading(true); setError('');
        try {
            const rows = await api.list();
            if (!Array.isArray(rows)) throw new Error('Daftar harus berupa array');
            setItems(rows);
        } catch (e) { setError(e.message); }
        finally { lock.current = false; setLoading(false); }
    }
    useEffect(() => { load(); }, []);
    function back() {
        if (lock.current) return;
        setError('');
        if (screen === 'category') {
            setScreen('create');
        } else if (screen === 'confirm-delete') {
            setScreen('detail');
        } else {
            setScreen(screen === 'edit' ? 'detail' : 'list');
        }
    }
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (screen === 'list' && !lock.current) return false;
            back(); return true;
        });
        return () => sub.remove();
    }, [screen]);

    async function openDetail(id) {
        if (lock.current) return;
        lock.current = true; setBusy(true); setError('');
        try {
            setSelected(await api.detail(id)); setScreen('detail');
            setDeleted(false);
        } catch (e) { setError(e.message); }
        finally { lock.current = false; setBusy(false); }
    }

    async function openCreate() {
        if (lock.current) return;
        setError('');
        setCategories([]);
        setJudul('');
        setNominal('');
        setCategoryId(null);
        setScreen('create');
        lock.current = true;
        setBusy(true);
        try {
            const rows = await api.categories();
            if (!Array.isArray(rows)) throw new Error('Daftar kategori harus berupa array');
            setCategories(rows);
        } catch (e) {
            setError(`Kategori tidak dapat dimuat: ${e.message}`);
        } finally {
            lock.current = false;
            setBusy(false);
        }
    }

    function openCategories() {
        setDraftCategoryId(categoryId ?? categories[0]?.id ?? null);
        setScreen('category');
    }

    function useCategory() {
        setCategoryId(draftCategoryId);
        setScreen('create');
    }

    function openEdit() {
        setJudul(selected.judul); setNominal(String(selected.nominal));
        setError(''); setScreen('edit');
    }
    async function save() {
        if (lock.current) return;
        const pesan = validate(judul, nominal);
        if (pesan) { setError(pesan); return; }
        lock.current = true; setBusy(true); setError('');
        let saved = false;
        try {
            const body = { judul: judul.trim(), nominal: Number(nominal) };
            if (screen === 'create') {
                await api.create({ ...body, id_kategori: categoryId });
            } else {
                await api.update(selected.id, body);
            }
            saved = true;
            // Respons tulis tidak lengkap; baca ulang daftar dari server. 
            setItems([]); setScreen('list'); setSelected(null);
            const rows = await api.list();
            if (!Array.isArray(rows)) throw new Error('Daftar harus berupa array');
            setItems(rows);
        } catch (e) {
            setError(saved ? `Data tersimpan. Muat ulang daftar: ${e.message}`
                : `${e.message}. Jika koneksi putus, cek daftar sebelum mengulang.`);
        } finally { lock.current = false; setBusy(false); }
    }

    async function remove() {
        if (lock.current) return;
        lock.current = true; setBusy(true); setError('');
        let deleted = false;
        try {
            await api.remove(selected.id); deleted = true;
            setItems([]); setSelected(null); setDeleted(true); setScreen('detail');
            const rows = await api.list();
            if (!Array.isArray(rows)) throw new Error('Daftar harus berupa array');
            setItems(rows);
        } catch (e) {
            setError(deleted ? `Data terhapus. Muat ulang daftar: ${e.message}`
                : e.message);
        } finally { lock.current = false; setBusy(false); }
    }
    function confirmDelete() {
        setError('');
        setScreen('confirm-delete');
    }

    const disabled = loading || busy;
    return (
        <SafeAreaView style={s.page}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.page} />
            <KeyboardAvoidingView style={s.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {screen === 'detail' && <Tombol title="‹  Kembali" tone="quiet"
                    onPress={back} disabled={disabled} style={s.back} />}
                {!!error && <Text accessibilityRole="alert" style={s.error}>
                    {error}</Text>}
                {disabled && <View style={s.loading}>
                    <ActivityIndicator accessibilityLabel="Memuat data" color={colors.primary} />
                    <Text style={s.loadingText}>Memuat data...</Text>
                </View>}
                {screen === 'list' && <DaftarPengeluaran items={items}
                    disabled={disabled} loading={loading} onAdd={openCreate}
                    onRefresh={load} onSelect={openDetail} />}
                {screen === 'detail' && <DetailPengeluaran item={selected}
                    deleted={deleted} onEdit={openEdit} onDelete={confirmDelete}
                    disabled={disabled} />}
                {screen === 'confirm-delete' && <KonfirmasiHapus item={selected}
                    onCancel={back} onConfirm={remove} disabled={disabled} />}
                {(screen === 'create' || screen === 'edit') && (
                    <FormPengeluaran mode={screen} judul={judul} setJudul={setJudul}
                        nominal={nominal} setNominal={setNominal}
                        categories={categories} categoryId={categoryId}
                        onChooseCategory={openCategories} onSave={save}
                        onBack={back}
                        disabled={disabled} />
                )}
                {screen === 'category' && <PilihKategori categories={categories}
                    categoryId={draftCategoryId} setCategoryId={setDraftCategoryId}
                    onBack={back} onUse={useCategory} disabled={disabled} />}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const s = StyleSheet.create({
    flex: { flex: 1 },
    page: { flex: 1, paddingHorizontal: 18, paddingTop: 6, backgroundColor: colors.page },
    back: { minHeight: 38, paddingHorizontal: 0, marginBottom: 2 },
    error: {
        color: colors.error, backgroundColor: colors.errorBackground, borderRadius: 8,
        padding: 10, marginBottom: 10, fontSize: 13, lineHeight: 18,
    },
    loading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    loadingText: { color: colors.muted, fontSize: 12 },
});