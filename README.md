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
        input.auto-calc { background-color: #e9ecef; font-weight: bold; color: #495057; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 15px; font-size: 14px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
        th { background-color: #0056b3; color: white; }
        input.table-input { width: 100%; padding: 4px; box-sizing: border-box; text-align: center; border: 1px solid #bbb; }
        .btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; width: 100%; font-size: 16px; margin-top: 10px; }
        .btn-target { background-color: #28a745; }
        .btn-save { background-color: #007bff; }
        .btn-preview { background-color: #17a2b8; }
        .btn-wa { background-color: #25D366; }
        .btn:hover { opacity: 0.9; }
        .row-grid { display: flex; gap: 10px; }
        .row-grid > div { flex: 1; }
        
        /* Modal Pratinjau WA */
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
        .modal-content { background-color: #fff; margin: 10% auto; padding: 20px; border-radius: 8px; width: 90%; max-width: 500px; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 13px; max-height: 70vh; overflow-y: auto; }
        .close-btn { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; float: right; font-weight: bold; }
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
            <option value="C624 / RWBT">C624 / RWBT</option>
            <option value="C560 / RAJ">C560 / RAJ</option>
            <option value="CH81 / CDKS">CH81 / CDKS</option>
            <option value="CG76 / SPMM">CG76 / SPMM</option>
            <option value="C573 / GMM">C573 / GMM</option>
            <option value="CE47 / MKRI">CE47 / MKRI</option>
            <option value="CI30 / STTD">CI30 / STTD</option>
            <option value="CH41 / KPMRK">CH41 / KPMRK</option>
            <option value="CG54 / MM21">CG54 / MM21</option>
            <option value="C935 / TLJ2">C935 / TLJ2</option>
            <option value="CA71 / WSGN">CA71 / WSGN</option>
            <option value="C965 / CBNU">C965 / CBNU</option>
            <option value="CG86 / JKST">CG86 / JKST</option>
            <option value="CA94 / KPTI">CA94 / KPTI</option>
            <option value="C574 / SKU">C574 / SKU</option>
            <option value="CI15 / RPSU">CI15 / RPSU</option>
            <option value="CI54 / RJLB">CI54 / RJLB</option>
            <option value="CF50 / DNIA">CF50 / DNIA</option>
            <option value="CC21 / KUTN">CC21 / KUTN</option>
            <option value="CI84 / TLKW">CI84 / TLKW</option>
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

    <!-- REVENUE / NET SALES -->
    <h3>Revenue / Net Sales</h3>
    <div class="form-group">
        <label>Target MTD (Rp) [Permanen per Toko]</label>
        <input type="number" id="targetMTD" class="target-field" placeholder="Masukkan Target MTD..." oninput="calculateRevenue()">
    </div>
    <div class="form-group">
        <label>Actual Sales (Rp) [Diisi Harian]</label>
        <input type="number" id="actualSales" class="actual-field" placeholder="Masukkan Penjualan Aktual..." oninput="calculateRevenue()">
    </div>
    <div class="row-grid">
        <div class="form-group">
            <label>Time Factor (%) [Otomatis]</label>
            <input type="text" id="timeFactor" class="auto-calc" readonly>
        </div>
        <div class="form-group">
            <label>Target Time Factor (Rp) [Otomatis]</label>
            <input type="text" id="targetTimeFactor" class="auto-calc" readonly>
        </div>
    </div>
    <div class="row-grid">
        <div class="form-group">
            <label>Achieve MTD (%) [Otomatis]</label>
            <input type="text" id="achieveMTD" class="auto-calc" readonly>
        </div>
        <div class="form-group">
            <label>Achieve Time Factor (%) [Otomatis]</label>
            <input type="text" id="achieveTF" class="auto-calc" readonly>
        </div>
    </div>
    <div class="row-grid">
        <div class="form-group">
            <label>Gap to Target (Rp) [Otomatis]</label>
            <input type="text" id="gapTarget" class="auto-calc" readonly>
        </div>
        <div class="form-group">
            <label>Gap to Time Factor (Rp) [Otomatis]</label>
            <input type="text" id="gapTF" class="auto-calc" readonly>
        </div>
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
    <div class="row-grid">
        <div class="form-group">
            <label>Total Struk [Diisi Harian]</label>
            <input type="number" id="totalStruk" class="actual-field" placeholder="Total struk...">
        </div>
        <div class="form-group">
            <label>Struk Member [Diisi Harian]</label>
            <input type="number" id="strukMember" class="actual-field" placeholder="Struk member...">
        </div>
        <div class="form-group">
            <label>Kontribusi (%) [Otomatis/Input]</label>
            <input type="number" id="persenMember" class="actual-field" placeholder="% kontribusi...">
        </div>
    </div>

    <!-- PSM (10 ITEM) -->
    <h3>PSM (Product Special Mingguan - 10 Item)</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Produk PSM</th>
                <th>Target (Permanen)</th>
                <th>Actual (Harian)</th>
            </tr>
        </thead>
        <tbody>
            <script>
                for(let i=1; i<=10; i++) {
                    document.write(`
                        <tr>
                            <td>${i}</td>
                            <td><input type="text" id="name_psm${i}" class="target-field table-input" value="PSM Item ${i}"></td>
                            <td><input type="number" id="targ_psm${i}" class="target-field table-input"></td>
                            <td><input type="number" id="act_psm${i}" class="actual-field table-input"></td>
                        </tr>
                    `);
                }
            </script>
        </tbody>
    </table>

    <!-- CATEGORY & E-COMMERCE -->
    <h3>Category & E-Commerce (Rupiah)</h3>
    <div class="form-group">
        <label>1. TOYS (NS) [Diisi Harian]</label>
        <input type="number" id="catToys" class="actual-field" placeholder="Nilai Toys...">
    </div>
    <div class="form-group">
        <label>2. TELUR [Diisi Harian]</label>
        <input type="number" id="catTelur" class="actual-field" placeholder="Nilai Telur...">
    </div>
    <div class="form-group">
        <label>Fee Base (Rp) [Diisi Harian]</label>
        <input type="number" id="feeBase" class="actual-field" placeholder="Nilai Fee Base...">
    </div>

    <!-- TOMBOL AKSI UTAMA -->
    <button type="button" class="btn btn-target" onclick="saveStoreTarget()">💾 Simpan Target Permanen Toko Ini</button>
    <button type="button" class="btn btn-save" onclick="alert('Laporan berhasil diproses & dikirim!')">Simpan & Kirim Laporan</button>
    
    <!-- TOMBOL PREVIEW DAN WHATSAPP DIBAWAH KELOLA LAPORAN -->
    <button type="button" class="btn btn-preview" onclick="showWaPreview()">👁️ Preview WhatsApp</button>
    <button type="button" class="btn btn-wa" onclick="sendToWhatsApp()">📲 Kirim Teks ke WhatsApp</button>
</div>

<!-- MODAL POPUP PREVIEW WA -->
<div id="waModal" class="modal">
    <div class="modal-content">
        <button class="close-btn" onclick="closeWaPreview()">Tutup</button>
        <h4 style="margin-top:0;">Pratinjau Format WhatsApp</h4>
        <hr>
        <div id="previewText"></div>
    </div>
</div>

<script>
    document.getElementById('datePicker').valueAsDate = new Date();

    function calculateRevenue() {
        const targetMTD = parseFloat(document.getElementById('targetMTD').value) || 0;
        const actualSales = parseFloat(document.getElementById('actualSales').value) || 0;
        const selectedDate = new Date(document.getElementById('datePicker').value);

        if (!isNaN(selectedDate.getTime())) {
            const day = selectedDate.getDate();
            const totalDaysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            
            const tfPercent = (day / totalDaysInMonth) * 100;
            document.getElementById('timeFactor').value = tfPercent.toFixed(2) + '%';

            const targetTF = targetMTD * (day / totalDaysInMonth);
            document.getElementById('targetTimeFactor').value = targetTF.toLocaleString('id-ID', {maximumFractionDigits: 0});

            const achieveMTD = targetMTD > 0 ? (actualSales / targetMTD) * 100 : 0;
            document.getElementById('achieveMTD').value = achieveMTD.toFixed(2) + '%';

            const achieveTF = targetTF > 0 ? (actualSales / targetTF) * 100 : 0;
            document.getElementById('achieveTF').value = achieveTF.toFixed(2) + '%';

            const gapTarget = actualSales - targetMTD;
            document.getElementById('gapTarget').value = gapTarget.toLocaleString('id-ID', {maximumFractionDigits: 0});

            const gapTF = actualSales - targetTF;
            document.getElementById('gapTF').value = gapTF.toLocaleString('id-ID', {maximumFractionDigits: 0});
        }
    }

    function generateWaText() {
        const store = document.getElementById('storeSelect').value || '-';
        const date = document.getElementById('datePicker').value || '-';
        const shift = document.getElementById('shiftSelect').value || '-';

        let text = `*DAILY SALES REPORT*\n`;
        text += `Toko: *${store}*\n`;
        text += `Tanggal: ${date}\n`;
        text += `Shift: ${shift}\n\n`;

        text += `*--- REVENUE ---*\n`;
        text += `Target MTD: Rp ${parseFloat(document.getElementById('targetMTD').value || 0).toLocaleString('id-ID')}\n`;
        text += `Actual Sales: Rp ${parseFloat(document.getElementById('actualSales').value || 0).toLocaleString('id-ID')}\n`;
        text += `Time Factor: ${document.getElementById('timeFactor').value}\n`;
        text += `Target TF: Rp ${document.getElementById('targetTimeFactor').value}\n`;
        text += `Achieve MTD: ${document.getElementById('achieveMTD').value}\n`;
        text += `Achieve TF: ${document.getElementById('achieveTF').value}\n`;
        text += `Gap Target: Rp ${document.getElementById('gapTarget').value}\n`;
        text += `Gap TF: Rp ${document.getElementById('gapTF').value}\n\n`;

        text += `*--- FOKUS CABANG ---*\n`;
        text += `1. Tebus Murah: T=${document.getElementById('targ_fokus1').value||0} | A=${document.getElementById('act_fokus1').value||0} | OH=${document.getElementById('oh_fokus1').value||0}\n`;
        text += `2. Serba Gratis: T=${document.getElementById('targ_fokus2').value||0} | A=${document.getElementById('act_fokus2').value||0} | OH=${document.getElementById('oh_fokus2').value||0}\n`;
        text += `3. Suuegeer: T=${document.getElementById('targ_fokus3').value||0} | A=${document.getElementById('act_fokus3').value||0} | OH=${document.getElementById('oh_fokus3').value||0}\n`;
        text += `4. Promo Ceban: T=${document.getElementById('targ_fokus4').value||0} | A=${document.getElementById('act_fokus4').value||0} | OH=${document.getElementById('oh_fokus4').value||0}\n\n`;

        text += `*--- MEMBER ---*\n`;
        text += `New Member: ${document.getElementById('actualNewMember').value||0}\n`;
        text += `Total Struk: ${document.getElementById('totalStruk').value||0}\n`;
        text += `Struk Member: ${document.getElementById('strukMember').value||0}\n`;
        text += `Kontribusi: ${document.getElementById('persenMember').value||0}%\n\n`;

        text += `*--- PSM (10 ITEM) ---*\n`;
        for(let i=1; i<=10; i++) {
            const name = document.getElementById(`name_psm${i}`).value || `PSM ${i}`;
            const targ = document.getElementById(`targ_psm${i}`).value || 0;
            const act = document.getElementById(`act_psm${i}`).value || 0;
            text += `${i}. ${name}: T=${targ} | A=${act}\n`;
        }

        text += `\n*--- CATEGORY & E-COMMERCE ---*\n`;
        text += `Toys: Rp ${parseFloat(document.getElementById('catToys').value || 0).toLocaleString('id-ID')}\n`;
        text += `Telur: Rp ${parseFloat(document.getElementById('catTelur').value || 0).toLocaleString('id-ID')}\n`;
        text += `Fee Base: Rp ${parseFloat(document.getElementById('feeBase').value || 0).toLocaleString('id-ID')}\n`;

        return text;
    }

    function showWaPreview() {
        document.getElementById('previewText').innerText = generateWaText();
        document.getElementById('waModal').style.display = 'block';
    }

    function closeWaPreview() {
        document.getElementById('waModal').style.display = 'none';
    }

    function sendToWhatsApp() {
        const text = generateWaText();
        const encodedText = encodeURIComponent(text);
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
    }

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
            targ_fokus4: document.getElementById('targ_fokus4').value
        };

        for(let i=1; i<=10; i++) {
            targetData[`name_psm${i}`] = document.getElementById(`name_psm${i}`).value;
            targetData[`targ_psm${i}`] = document.getElementById(`targ_psm${i}`).value;
        }

        localStorage.setItem(getTargetKey(), JSON.stringify(targetData));
        alert(`Sukses! Target permanen untuk toko ${store} berhasil disimpan.`);
    }

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

            for(let i=1; i<=10; i++) {
                if(data[`name_psm${i}`]) document.getElementById(`name_psm${i}`).value = data[`name_psm${i}`];
                document.getElementById(`targ_psm${i}`).value = data[`targ_psm${i}`] || '';
            }
        } else {
            document.getElementById('targetMTD').value = '';
            document.getElementById('targ_fokus1').value = '';
            document.getElementById('targ_fokus2').value = '';
            document.getElementById('targ_fokus3').value = '';
            document.getElementById('targ_fokus4').value = '';

            for(let i=1; i<=10; i++) {
                document.getElementById(`targ_psm${i}`).value = '';
            }
        }
        calculateRevenue();
    }

    function loadDailyData() {
        loadStoreTarget(); 

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
            document.getElementById('totalStruk').value = data.totalStruk || '';
            document.getElementById('strukMember').value = data.strukMember || '';
            document.getElementById('persenMember').value = data.persenMember || '';

            for(let i=1; i<=10; i++) {
                document.getElementById(`act_psm${i}`).value = data[`act_psm${i}`] || '';
            }

            document.getElementById('catToys').value = data.catToys || '';
            document.getElementById('catTelur').value = data.catTelur || '';
            document.getElementById('feeBase').value = data.feeBase || '';
        } else {
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
            document.getElementById('totalStruk').value = '';
            document.getElementById('strukMember').value = '';
            document.getElementById('persenMember').value = '';

            for(let i=1; i<=10; i++) {
                document.getElementById(`act_psm${i}`).value = '';
            }

            document.getElementById('catToys').value = '';
            document.getElementById('catTelur').value = '';
            document.getElementById('feeBase').value = '';
        }
        calculateRevenue();
    }

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
            totalStruk: document.getElementById('totalStruk').value,
            strukMember: document.getElementById('strukMember').value,
            persenMember: document.getElementById('persenMember').value,
            catToys: document.getElementById('catToys').value,
            catTelur: document.getElementById('catTelur').value,
            feeBase: document.getElementById('feeBase').value
        };

        for(let i=1; i<=10; i++) {
            data[`act_psm${i}`] = document.getElementById(`act_psm${i}`).value;
        }

        localStorage.setItem(key, JSON.stringify(data));
        calculateRevenue();
    }

    document.getElementById('storeSelect').addEventListener('change', loadDailyData);
    document.getElementById('datePicker').addEventListener('change', function() {
        loadDailyData();
        calculateRevenue();
    });

    document.querySelectorAll('.actual-field').forEach(input => {
        input.addEventListener('input', autoSaveDaily);
    });

    calculateRevenue();
</script>

</body>
</html>
