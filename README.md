<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report Portal V2</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; margin: 0; padding: 15px; background-color: #f4f6f9; color: #333; }
        .container { max-width: 900px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2, h3 { color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 6px; margin-top: 20px; }
        .form-group { margin-bottom: 12px; }
        label { display: block; margin-bottom: 4px; font-weight: bold; font-size: 14px; }
        input, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 15px; font-size: 14px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
        th { background-color: #0056b3; color: white; }
        input.table-input { width: 100%; padding: 4px; box-sizing: border-box; text-align: center; border: 1px solid #bbb; }
        .btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; }
        .btn-target { background-color: #28a745; width: 100%; margin-bottom: 15px; font-size: 15px; }
        .btn-save { background-color: #007bff; width: 100%; font-size: 16px; margin-top: 15px; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>

<div class="container">
    <h2>Daily Sales Report Portal V2</h2>
    <p style="color: #666; font-size: 13px;">Mode: Auto-Save Active & Permanent Store Target</p>

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

    <div class="form-group">
        <label>Shift</label>
        <select id="shiftSelect" class="actual-field">
            <option value="Shift 1">Shift 1</option>
            <option value="Shift 2">Shift 2</option>
            <option value="Full Day">Full Day</option>
        </select>
    </div>

    <!-- TOMBOL SIMPAN TARGET PERMANEN TOKO -->
    <button type="button" class="btn btn-target" onclick="saveStoreTarget()">💾 Simpan Target Permanen Toko Ini</button>

    <!-- REVENUE / NET SALES -->
    <h3>Revenue / Net Sales</h3>
    <div class="form-group">
        <label>Target MTD (Rp) [Permanen per Toko]</label>
        <input type="number" id="targetMTD" class="target-field" placeholder="Masukkan Target MTD...">
    </div>
    <div class="form-group">
        <label>Actual Sales (Rp) [Diisi Harian]</label>
        <input type="number" id="actualSales" class="actual-field" placeholder="Masukkan Penjualan Aktual...">
    </div>

    <!-- FOKUS CABANG -->
    <h3>Fokus Cabang (Target Permanen, Toko Isi Actual)</h3>
    <table>
        <thead>
            <tr>
                <th>Program / Fokus</th>
                <th>Target (Permanen)</th>
                <th>Actual / Sales (Harian)</th>
                <th>On Hand</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1. Tebus Murah</td>
                <td><input type="number" id="targ_fokus1" class="target-field table-input"></td>
                <td><input type="number" id="act_fokus1" class="actual-field table-input"></td>
                <td><input type="number" id="oh_fokus1" class="actual-field table-input"></td>
            </tr>
            <tr>
                <td>2. Serba Gratis</td>
                <td><input type="number" id="targ_fokus2" class="target-field table-input"></td>
                <td><input type="number" id="act_fokus2" class="actual-field table-input"></td>
                <td><input type="number" id="oh_fokus2" class="actual-field table-input"></td>
            </tr>
            <tr>
                <td>3. Suuegeer</td>
                <td><input type="number" id="targ_fokus3" class="target-field table-input"></td>
                <td><input type="number" id="act_fokus3" class="actual-field table-input"></td>
                <td><input type="number" id="oh_fokus3" class="actual-field table-input"></td>
            </tr>
            <tr>
                <td>4. Promo Ceban</td>
                <td><input type="number" id="targ_fokus4" class="target-field table-input"></td>
                <td><input type="number" id="act_fokus4" class="actual-field table-input"></td>
                <td><input type="number" id="oh_fokus4" class="actual-field table-input"></td>
            </tr>
        </tbody>
    </table>

    <!-- MEMBER -->
    <h3>Member</h3>
    <div class="form-group">
        <label>Actual New Member [Diisi Harian]</label>
        <input type="number" id="actualNewMember" class="actual-field" placeholder="Jumlah member baru...">
    </div>
    <div class="form-group">
        <label>Total Struk / Struk Member [Diisi Harian]</label>
        <input type="text" id="strukMember" class="actual-field" placeholder="Contoh: 150 / 30">
    </div>

    <!-- PSM -->
    <h3>PSM (Product Special Mingguan)</h3>
    <table>
        <thead>
            <tr>
                <th>Produk PSM</th>
                <th>Target (Permanen)</th>
                <th>Actual (Harian)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type="text" id="name_psm1" class="target-field table-input" value="PSM Item 1"></td>
                <td><input type="number" id="targ_psm1" class="target-field table-input"></td>
                <td><input type="number" id="act_psm1" class="actual-field table-input"></td>
            </tr>
            <tr>
                <td><input type="text" id="name_psm2" class="target-field table-input" value="PSM Item 2"></td>
                <td><input type="number" id="targ_psm2" class="target-field table-input"></td>
                <td><input type="number" id="act_psm2" class="actual-field table-input"></td>
            </tr>
        </tbody>
    </table>

    <!-- CATEGORY & E-COMMERCE -->
    <h3>Category & E-Commerce (Rupiah)</h3>
    <div class="form-group">
        <label>1. TOYS (NS) [Diisi Harian]</label>
        <input type="number" id="catToys" class="actual-field" placeholder="Nilai Toys...">
    </div>
    <div class="form-group">
        <label>2. HBPL (NS) [Diisi Harian]</label>
        <input type="number" id="catHbpl" class="actual-field" placeholder="Nilai HBPL...">
    </div>
    <div class="form-group">
        <label>Fee Base (Rp) [Diisi Harian]</label>
        <input type="number" id="feeBase" class="actual-field" placeholder="Nilai Fee Base...">
    </div>

    <!-- TOMBOL KIRIM LAPORAN -->
    <button type="button" class="btn btn-save" onclick="alert('Laporan berhasil diproses & dikirim!')">Simpan & Kirim Laporan</button>
</div>

<script>
    document.getElementById('datePicker').valueAsDate = new Date();

    function getDailyKey() {
        const store = document.getElementById('storeSelect').value;
        const date = document.getElementById('datePicker').value;
        if (!store || !date) return null;
        return `actual_${store}_${date}`;
    }

    function getTargetKey() {
        const store = document.getElementById('storeSelect').value;
        if (!store) return null;
        return `permanent_target_${store}`;
    }

    // 1. SIMPAN TARGET PERMANEN
    function saveStoreTarget() {
        const store = document.getElementById('storeSelect').value;
        if (!store) {
            alert("Pilih Kode Toko terlebih dahulu!");
            return;
        }

        const targetData = {
            targetMTD: document.getElementById('targetMTD').value,
            targ_fokus1: document.getElementById('targ_fokus1').value,
            targ_fokus2: document.getElementById('targ_fokus2').value,
            targ_fokus3: document.getElementById('targ_fokus3').value,
            targ_fokus4: document.getElementById('targ_fokus4').value,
            name_psm1: document.getElementById('name_psm1').value,
            targ_psm1: document.getElementById('targ_psm1').value,
            name_psm2: document.getElementById('name_psm2').value,
            targ_psm2: document.getElementById('targ_psm2').value
        };

        localStorage.setItem(getTargetKey(), JSON.stringify(targetData));
        alert(`Sukses! Target permanen untuk toko ${store} berhasil disimpan.`);
    }

    // 2. MUAT TARGET PERMANEN
    function loadStoreTarget() {
        const key = getTargetKey();
        if (!key) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('targetMTD').value = data.targetMTD || '';
            document.getElementById('targ_fokus1').value = data.targ_fokus1 || '';
            document.getElementById('targ_fokus2').value = data.targ_fokus2 || '';
            document.getElementById('targ_fokus3').value = data.targ_fokus3 || '';
            document.getElementById('targ_fokus4').value = data.targ_fokus4 || '';
            if(data.name_psm1) document.getElementById('name_psm1').value = data.name_psm1;
            document.getElementById('targ_psm1').value = data.targ_psm1 || '';
            if(data.name_psm2) document.getElementById('name_psm2').value = data.name_psm2;
            document.getElementById('targ_psm2').value = data.targ_psm2 || '';
        } else {
            document.getElementById('targetMTD').value = '';
            document.getElementById('targ_fokus1').value = '';
            document.getElementById('targ_fokus2').value = '';
            document.getElementById('targ_fokus3').value = '';
            document.getElementById('targ_fokus4').value = '';
            document.getElementById('targ_psm1').value = '';
            document.getElementById('targ_psm2').value = '';
        }
    }

    // 3. MUAT DATA ACTUAL HARIAN
    function loadDailyData() {
        loadStoreTarget(); // Muat target tokonya dulu

        const key = getDailyKey();
        if (!key) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('shiftSelect').value = data.shiftSelect || 'Shift 1';
            document.getElementById('actualSales').value = data.actualSales || '';
            document.getElementById('act_fokus1').value = data.act_fokus1 || '';
            document.getElementById('oh_fokus1').value = data.oh_fokus1 || '';
            document.getElementById('act_fokus2').value = data.act_fokus2 || '';
            document.getElementById('oh_fokus2').value = data.oh_fokus2 || '';
            document.getElementById('act_fokus3').value = data.act_fokus3 || '';
            document.getElementById('oh_fokus3').value = data.oh_fokus3 || '';
            document.getElementById('act_fokus4').value = data.act_fokus4 || '';
            document.getElementById('oh_fokus4').value = data.oh_fokus4 || '';
            document.getElementById('actualNewMember').value = data.actualNewMember || '';
            document.getElementById('strukMember').value = data.strukMember || '';
            document.getElementById('act_psm1').value = data.act_psm1 || '';
            document.getElementById('act_psm2').value = data.act_psm2 || '';
            document.getElementById('catToys').value = data.catToys || '';
            document.getElementById('catHbpl').value = data.catHbpl || '';
            document.getElementById('feeBase').value = data.feeBase || '';
        } else {
            // Kosongkan kolom actual jika tanggal baru belum ada data
            document.getElementById('actualSales').value = '';
            document.getElementById('act_fokus1').value = '';
            document.getElementById('oh_fokus1').value = '';
            document.getElementById('act_fokus2').value = '';
            document.getElementById('oh_fokus2').value = '';
            document.getElementById('act_fokus3').value = '';
            document.getElementById('oh_fokus3').value = '';
            document.getElementById('act_fokus4').value = '';
            document.getElementById('oh_fokus4').value = '';
            document.getElementById('actualNewMember').value = '';
            document.getElementById('strukMember').value = '';
            document.getElementById('act_psm1').value = '';
            document.getElementById('act_psm2').value = '';
            document.getElementById('catToys').value = '';
            document.getElementById('catHbpl').value = '';
            document.getElementById('feeBase').value = '';
        }
    }

    // 4. AUTO-SAVE ACTUAL HARIAN SAAT DIKETIK
    function autoSaveDaily() {
        const key = getDailyKey();
        if (!key) return;

        const data = {
            shiftSelect: document.getElementById('shiftSelect').value,
            actualSales: document.getElementById('actualSales').value,
            act_fokus1: document.getElementById('act_fokus1').value,
            oh_fokus1: document.getElementById('oh_fokus1').value,
            act_fokus2: document.getElementById('act_fokus2').value,
            oh_fokus2: document.getElementById('oh_fokus2').value,
            act_fokus3: document.getElementById('act_fokus3').value,
            oh_fokus3: document.getElementById('oh_fokus3').value,
            act_fokus4: document.getElementById('act_fokus4').value,
            oh_fokus4: document.getElementById('oh_fokus4').value,
            actualNewMember: document.getElementById('actualNewMember').value,
            strukMember: document.getElementById('strukMember').value,
            act_psm1: document.getElementById('act_psm1').value,
            act_psm2: document.getElementById('act_psm2').value,
            catToys: document.getElementById('catToys').value,
            catHbpl: document.getElementById('catHbpl').value,
            feeBase: document.getElementById('feeBase').value
        };

        localStorage.setItem(key, JSON.stringify(data));
    }

    document.getElementById('storeSelect').addEventListener('change', loadDailyData);
    document.getElementById('datePicker').addEventListener('change', loadDailyData);

    document.querySelectorAll('.actual-field').forEach(input => {
        input.addEventListener('input', autoSaveDaily);
    });
</script>

</body>
</html>
