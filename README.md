<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report Portal V2</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f6f9; color: #333; }
        .container { max-width: 800px; margin: auto; background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2, h3 { color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 8px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #0056b3; color: white; }
        .btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; }
        .btn-target { background-color: #28a745; margin-bottom: 15px; }
        .btn-save { background-color: #007bff; width: 100%; font-size: 16px; margin-top: 10px; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>

<div class="container">
    <h2>Daily Sales Report Portal V2</h2>
    <p style="color: #666; font-size: 14px;">Mode: Auto-Active (Target Tetap Tersimpan Otomatis per Toko)</p>

    <!-- INFORMASI UMUM TOKO -->
    <h3>Informasi Umum Toko</h3>
    <div class="form-group">
        <label>Periode Tanggal</label>
        <input type="date" id="datePicker">
    </div>
    
    <div class="form-group">
        <label>Kode & Nama Toko</label>
        <select id="storeSelect">
            <option value="">-- Pilih Toko --</option>
            <option value="C624">C624 / RWBT</option>
            <option value="C560">C560 / RAJ</option>
            <option value="CH81">CH81 / CDKS</option>
            <option value="CG76">CG76 / SPMM</option>
            <option value="C573">C573 / GMM</option>
            <option value="CE47">CE47 / MKRI</option>
            <option value="CI30">CI30 / STTD</option>
            <option value="CH41">CH41 / KPMRK</option>
            <option value="CG54">CG54 / MM21</option>
            <option value="C935">C935 / TLJ2</option>
            <option value="CA71">CA71 / WSGN</option>
            <option value="C965">C965 / CBNU</option>
            <option value="CG86">CG86 / JKST</option>
            <option value="CA94">CA94 / KPTI</option>
            <option value="C574">C574 / SKU</option>
            <option value="CI15">CI15 / RPSU</option>
            <option value="CI54">CI54 / RJLB</option>
            <option value="CF50">CF50 / DNIA</option>
            <option value="CC21">CC21 / KUTN</option>
            <option value="CI84">CI84 / TLKW</option>
        </select>
    </div>

    <!-- TOMBOL SIMPAN TARGET KHUSUS -->
    <button type="button" class="btn btn-target" onclick="saveStoreTarget()">💾 Simpan Target Permanen Toko Ini</button>

    <!-- REVENUE / NET SALES -->
    <h3>Revenue / Net Sales</h3>
    <div class="form-group">
        <label>Target MTD (Rp) [Permanen per Toko]</label>
        <input type="number" id="targetMTD" class="target-field" placeholder="Masukkan Target MTD...">
    </div>
    <div class="form-group">
        <label>Actual Sales (Rp) [Diisi Harian]</label>
        <input type="number" id="actualSales" class="actual-field" placeholder="Masukkan Penjualan Aktual Hari Ini...">
    </div>

    <!-- MEMBER -->
    <h3>Member</h3>
    <div class="form-group">
        <label>Actual New Member [Diisi Harian]</label>
        <input type="number" id="actualMember" class="actual-field" placeholder="Jumlah member baru...">
    </div>

    <!-- TOMBOL KIRIM LAPORAN -->
    <button type="button" class="btn btn-save" onclick="alert('Laporan berhasil diproses!')">Simpan & Kirim Laporan</button>
</div>

<script>
    // Set tanggal otomatis ke hari ini saat pertama buka
    document.getElementById('datePicker').valueAsDate = new Date();

    // Fungsi Kunci Penyimpanan Actual Harian (Berdasarkan Toko + Tanggal)
    function getDailyKey() {
        const store = document.getElementById('storeSelect').value;
        const date = document.getElementById('datePicker').value;
        if (!store || !date) return null;
        return `actual_${store}_${date}`;
    }

    // Fungsi Kunci Penyimpanan Target Permanen (Hanya Berdasarkan Toko)
    function getTargetKey() {
        const store = document.getElementById('storeSelect').value;
        if (!store) return null;
        return `permanent_target_${store}`;
    }

    // 1. Simpan Target Permanen (Tidak Berubah Walau Ganti Tanggal)
    function saveStoreTarget() {
        const store = document.getElementById('storeSelect').value;
        if (!store) {
            alert("Pilih Kode Toko terlebih dahulu!");
            return;
        }

        const targetData = {
            targetMTD: document.getElementById('targetMTD').value
        };

        localStorage.setItem(getTargetKey(), JSON.stringify(targetData));
        alert(`Sukses! Target permanen untuk toko ${store} berhasil disimpan. Target ini tidak akan hilang walau ganti tanggal.`);
    }

    // 2. Muat Target Permanen Toko
    function loadStoreTarget() {
        const key = getTargetKey();
        if (!key) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('targetMTD').value = data.targetMTD || '';
        } else {
            document.getElementById('targetMTD').value = '';
        }
    }

    // 3. Muat Data Actual Harian (Berdasarkan Tanggal yang dipilih)
    function loadDailyData() {
        loadStoreTarget(); // Muat target tokonya dulu

        const key = getDailyKey();
        if (!key) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('actualSales').value = data.actualSales || '';
            document.getElementById('actualMember').value = data.actualMember || '';
        } else {
            // Jika tanggal berbeda dan belum diisi, kosongkan kolom actual
            document.getElementById('actualSales').value = '';
            document.getElementById('actualMember').value = '';
        }
    }

    // 4. Auto-Save Actual Harian saat diketik
    function autoSaveDaily() {
        const key = getDailyKey();
        if (!key) return;

        const data = {
            actualSales: document.getElementById('actualSales').value,
            actualMember: document.getElementById('actualMember').value
        };

        localStorage.setItem(key, JSON.stringify(data));
    }

    // Pasang Event Listener agar otomatis mendeteksi perubahan
    document.getElementById('storeSelect').addEventListener('change', loadDailyData);
    document.getElementById('datePicker').addEventListener('change', loadDailyData);

    // Otomatis simpan saat mengetik di kolom actual
    document.querySelectorAll('.actual-field').forEach(input => {
        input.addEventListener('input', autoSaveDaily);
    });
</script>

</body>
</html>
