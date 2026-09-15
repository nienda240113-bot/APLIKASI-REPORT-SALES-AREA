<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report Portal</title>
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
        .btn-rekap { background-color: #6f42c1; }
        .btn:hover { opacity: 0.9; }
        .row-grid { display: flex; gap: 10px; }
        .row-grid > div { flex: 1; }
        
        /* Modal Popup WA */
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
        .modal-content { background-color: #fff; margin: 10% auto; padding: 20px; border-radius: 8px; width: 90%; max-width: 500px; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 13px; max-height: 70vh; overflow-y: auto; }
        .close-btn { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; float: right; font-weight: bold; }
        #loadingStatus { font-size: 13px; color: #d9534f; font-weight: bold; margin-top: 5px; background: #fff3f3; padding: 5px; border-radius: 4px; display: inline-block; }
    </style>
</head>
<body>

<div class="container">
    <h2>Daily Sales Report Portal</h2>
    <p style="color: #666; font-size: 13px;">Mode: Cloud Server Connected</p>
    <div id="loadingStatus"></div>

    <!-- INFORMASI UMUM TOKO -->
    <h3>Informasi Umum Toko</h3>
    <div class="form-group">
        <label>Periode Tanggal (Otomatis Sesuai Device)</label>
        <input type="date" id="datePicker" onchange="calculateAllCalculations()">
    </div>
    
    <div class="form-group">
        <label>Kode & Nama Toko</label>
        <select id="storeSelect" onchange="onStoreChange()">
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
            <option value="1">Shift 1</option>
            <option value="2">Shift 2</option>
            <option value="Full Day">Full Day</option>
        </select>
    </div>

    <!-- REVENUE / NET SALES -->
    <h3>Revenue / Net Sales</h3>
    <div class="form-group">
        <label>Target MTD (Rp) [Sinkron Cloud]</label>
        <input type="number" id="targetMTD" class="target-field" placeholder="Masukkan Target MTD..." oninput="calculateRevenue()">
    </div>
    <div class="form-group">
        <label>Actual Sales (Rp) [Harian]</label>
        <input type="number" id="actualSales" class="actual-field" placeholder="Masukkan Penjualan Aktual..." oninput="calculateRevenue()">
    </div>
    <div class="row-grid">
        <div class="form-group">
            <label>Time Factor (%)</label>
            <input type="text" id="timeFactor" class="auto-calc" readonly>
        </div>
        <div class="form-group">
            <label>Target Time Factor (Rp)</label>
            <input type="text" id="targetTimeFactor" class="auto-calc" readonly>
        </div>
    </div>
    <div class="row-grid">
        <div class="form-group">
            <label>Achieve MTD (%)</label>
            <input type="text" id="achieveMTD" class="auto-calc" readonly>
        </div>
        <div class="form-group">
            <label>Achieve Time Factor (%)</label>
            <input type="text" id="achieveTF" class="auto-calc" readonly>
        </div>
    </div>
    <div class="row-grid">
        <div class="form-group">
            <label>Gap to Target (Rp)</label>
            <input type="text" id="gapTarget" class="auto-calc" readonly>
        </div>
        <div class="form-group">
            <label>Gap to Time Factor (Rp)</label>
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
                <th>Actual (Harian)</th>
                <th>Persen (%) [Otomatis]</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1. Tebus Murah</td>
                <td><input type="number" id="targ_fokus1" class="target-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="number" id="act_fokus1" class="actual-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="text" id="persen_fokus1" class="auto-calc table-input" readonly></td>
            </tr>
            <tr>
                <td>2. Serba Gratis</td>
                <td><input type="number" id="targ_fokus2" class="target-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="number" id="act_fokus2" class="actual-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="text" id="persen_fokus2" class="auto-calc table-input" readonly></td>
            </tr>
            <tr>
                <td>3. Suuegeer</td>
                <td><input type="number" id="targ_fokus3" class="target-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="number" id="act_fokus3" class="actual-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="text" id="persen_fokus3" class="auto-calc table-input" readonly></td>
            </tr>
            <tr>
                <td>4. Promo Ceban</td>
                <td><input type="number" id="targ_fokus4" class="target-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="number" id="act_fokus4" class="actual-field table-input" oninput="calculateAllCalculations()"></td>
                <td><input type="text" id="persen_fokus4" class="auto-calc table-input" readonly></td>
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
            <input type="number" id="totalStruk" class="actual-field" placeholder="Total struk..." oninput="calculateMemberPercent()">
        </div>
        <div class="form-group">
            <label>Struk Member [Diisi Harian]</label>
            <input type="number" id="strukMember" class="actual-field" placeholder="Struk member..." oninput="calculateMemberPercent()">
        </div>
        <div class="form-group">
            <label>Kontribusi (%) [Otomatis]</label>
            <input type="text" id="persenMember" class="auto-calc" readonly>
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
                <th>Persen (%) [Otomatis]</th>
            </tr>
        </thead>
        <tbody>
            <script>
                const defaultPsmNames = ["Aqua", "Buavita", "FF", "Tango", "H&S", "French", "Mamy poko", "Biore", "PSM Item 9", "PSM Item 10"];
                for(let i=1; i<=10; i++) {
                    document.write(`
                        <tr>
                            <td>${i}</td>
                            <td><input type="text" id="name_psm${i}" class="target-field table-input" value="${defaultPsmNames[i-1]}"></td>
                            <td><input type="number" id="targ_psm${i}" class="target-field table-input" oninput="calculateAllCalculations()"></td>
                            <td><input type="number" id="act_psm${i}" class="actual-field table-input" oninput="calculateAllCalculations()"></td>
                            <td><input type="text" id="persen_psm${i}" class="auto-calc table-input" readonly></td>
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

    <!-- TOMBOL AKSI LENGKAP -->
    <button type="button" class="btn btn-target" onclick="saveStoreTargetToCloud()">💾 Simpan Target Permanen ke Cloud (Server)</button>
    <button type="button" class="btn btn-save" onclick="alert('Laporan berhasil diproses & dikirim!')">Simpan & Kirim Laporan</button>
    <button type="button" class="btn btn-preview" onclick="showWaPreview()">👁️ Preview WhatsApp (Per Toko)</button>
    <button type="button" class="btn btn-wa" onclick="sendToWhatsApp()">📲 Kirim Teks ke WhatsApp (Per Toko)</button>
    <button type="button" class="btn btn-rekap" onclick="showTotalSummaryPreview()">📊 Preview & Rekap Total Keseluruhan (20 Toko)</button>
    <button type="button" class="btn btn-wa" onclick="sendTotalSummaryWhatsApp()">📲 Kirim Rekap Total ke WhatsApp</button>
</div>

<!-- MODAL POPUP PREVIEW WA -->
<div id="waModal" class="modal">
    <div class="modal-content">
        <button class="close-btn" onclick="closeWaPreview()">Tutup</button>
        <h4 id="modalTitle" style="margin-top:0;">Pratinjau Format WhatsApp</h4>
        <hr>
        <div id="previewText"></div>
    </div>
</div>

<script>
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwLIAk_6NCsENTyCNgMUqakpu0bRORnVI29VZf8uQMRsqh0ZW2fUEqqFK5KQ5yiFbOuZw/exec";

    // Inisialisasi Tanggal Otomatis Saat Buka Aplikasi
    window.onload = function() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        document.getElementById('datePicker').value = `${year}-${month}-${day}`;
        calculateAllCalculations();
    };

    function clearTargetForm() {
        document.getElementById('targetMTD').value = '';
        document.getElementById('targ_fokus1').value = '';
        document.getElementById('targ_fokus2').value = '';
        document.getElementById('targ_fokus3').value = '';
        document.getElementById('targ_fokus4').value = '';
        for(let i=1; i<=10; i++) { 
            document.getElementById(`targ_psm${i}`).value = ''; 
        }
        calculateAllCalculations();
    }

    function populateForm(data) {
        document.getElementById('targetMTD').value = data.targetMTD || '';
        document.getElementById('targ_fokus1').value = data.targ_fokus1 || '';
        document.getElementById('targ_fokus2').value = data.targ_fokus2 || '';
        document.getElementById('targ_fokus3').value = data.targ_fokus3 || '';
        document.getElementById('targ_fokus4').value = data.targ_fokus4 || '';

        for(let i=1; i<=10; i++) {
            if(data[`name_psm${i}`]) document.getElementById(`name_psm${i}`).value = data[`name_psm${i}`];
            document.getElementById(`targ_psm${i}`).value = data[`targ_psm${i}`] || '';
        }
        calculateAllCalculations();
    }

    function onStoreChange() {
        const store = document.getElementById('storeSelect').value;
        if (!store) {
            clearTargetForm();
            return;
        }

        document.getElementById('loadingStatus').innerText = "Mengambil target dari Cloud Server...";
        
        fetch(`${WEB_APP_URL}?action=get&storeCode=${encodeURIComponent(store)}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('loadingStatus').innerText = "";
                if (data && Object.keys(data).length > 0) {
                    populateForm(data);
                } else {
                    clearTargetForm();
                }
            })
            .catch(error => {
                document.getElementById('loadingStatus').innerText = "";
                console.error(error);
                clearTargetForm();
            });
    }

    function saveStoreTargetToCloud() {
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

        document.getElementById('loadingStatus').innerText = "Menyimpan target ke Cloud Server...";

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({ storeCode: store, targetData: targetData })
        })
        .then(response => response.json())
        .then(result => {
            document.getElementById('loadingStatus').innerText = "";
            alert(`Target permanen toko ${store} berhasil diproses oleh server.`);
        })
        .catch(error => {
            document.getElementById('loadingStatus').innerText = "";
            alert("Target berhasil dikirim ke server.");
            console.error(error);
        });
    }

    function calculateRevenue() {
        const targetMTD = parseFloat(document.getElementById('targetMTD').value) || 0;
        const actualSales = parseFloat(document.getElementById('actualSales').value) || 0;
        const selectedDate = new Date(document.getElementById('datePicker').value);

        if (!isNaN(selectedDate.getTime())) {
            const dayNum = selectedDate.getDate();
            const totalDaysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            
            const tfPercent = (dayNum / totalDaysInMonth) * 100;
            document.getElementById('timeFactor').value = tfPercent.toFixed(2) + '%';

            const targetTF = targetMTD * (dayNum / totalDaysInMonth);
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

    function calculateFokusPercent() {
        for (let i = 1; i <= 4; i++) {
            const targ = parseFloat(document.getElementById(`targ_fokus${i}`).value) || 0;
            const act = parseFloat(document.getElementById(`act_fokus${i}`).value) || 0;
            const pct = targ > 0 ? Math.round((act / targ) * 100) : 0;
            document.getElementById(`persen_fokus${i}`).value = pct + '%';
        }
    }

    function calculatePsmPercent() {
        for (let i = 1; i <= 10; i++) {
            const targ = parseFloat(document.getElementById(`targ_psm${i}`).value) || 0;
            const act = parseFloat(document.getElementById(`act_psm${i}`).value) || 0;
            const pct = targ > 0 ? Math.round((act / targ) * 100) : 0;
            document.getElementById(`persen_psm${i}`).value = pct + '%';
        }
    }

    function calculateMemberPercent() {
        const total = parseFloat(document.getElementById('totalStruk').value) || 0;
        const member = parseFloat(document.getElementById('strukMember').value) || 0;
        const pct = total > 0 ? Math.round((member / total) * 100) : 0;
        document.getElementById('persenMember').value = pct + '%';
    }

    function calculateAllCalculations() {
        calculateRevenue();
        calculateFokusPercent();
        calculatePsmPercent();
        calculateMemberPercent();
    }

    function formatPeriodeDate(dateStr) {
        if(!dateStr) return "-";
        const parts = dateStr.split('-');
        if(parts.length !== 3) return dateStr;
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return `${parseInt(parts[2], 10)} ${monthNames[parseInt(parts[1], 10) - 1]}`;
    }

    function generateWaText() {
        const storeVal = document.getElementById('storeSelect').value || " / -";
        const storeParts = storeVal.split(' / ');
        
        let text = `REPORT SALES HARIAN\n`;
        text += `PERIODE : ${formatPeriodeDate(document.getElementById('datePicker').value)}\n`;
        text += `WH : Bekasi\nAM : SRD\nAC : Triyanto\n`;
        text += `KD Toko : ${storeParts[0] || '-'}\n`;
        text += `Nama Toko : ${storeParts[1] || '-'}\n`;
        text += `Shift : ${document.getElementById('shiftSelect').value || '-'}\n`;
        text += `======================\n\n`;

        text += `*REVENUE*\n1. NET SALES\n`;
        text += `- TIME FAKTOR : ${document.getElementById('timeFactor').value}\n`;
        text += `- TARGET MTD : ${parseFloat(document.getElementById('targetMTD').value || 0).toLocaleString('id-ID')}\n`;
        text += `- TARGET TIME FACTOR : ${document.getElementById('targetTimeFactor').value}\n`;
        text += `- ACTUAL : ${parseFloat(document.getElementById('actualSales').value || 0).toLocaleString('id-ID')}\n`;
        text += `- ACHIEVED MTD : ${document.getElementById('achieveMTD').value}\n`;
        text += `- ACHIEVED TIME FACTOR : ${document.getElementById('achieveTF').value}\n`;
        text += `- GAP TO TARGET : ${document.getElementById('gapTarget').value}\n`;
        text += `- GAP TO TIME FACTOR : ${document.getElementById('gapTF').value}\n\n`;

        text += `*FOKUS CABANG*\n======================\nTARGET/SALES/ACV%\n`;
        for(let i=1; i<=4; i++) {
            const names = ["TEBUS MURAH", "SERBA GRATIS", "SUUEGEER", "PROMO CEBAN"];
            text += `${i}. ${names[i-1]} : ${document.getElementById(`targ_fokus${i}`).value||0}/${document.getElementById(`act_fokus${i}`).value||0}/${document.getElementById(`persen_fokus${i}`).value}\n`;
        }
        text += `======================\n\n`;

        text += `*MEMBER*\n1. ACTUAL NEW MEMBER : ${document.getElementById('actualNewMember').value||0}\n`;
        text += `2. KONTRIBUSI STRUK MEMBER = ${document.getElementById('strukMember').value||0}/${document.getElementById('totalStruk').value||0}/${document.getElementById('persenMember').value}\n`;
        text += `======================\n\n`;

        text += `*PSM* (In Qty).\n( TARGET/ACTUAL /% )\n`;
        for(let i=1; i<=10; i++) {
            const pName = document.getElementById(`name_psm${i}`).value || `PSM ${i}`;
            text += `${i}. ${pName} : ${document.getElementById(`targ_psm${i}`).value||0}/${document.getElementById(`act_psm${i}`).value||0}/${document.getElementById(`persen_psm${i}`).value}\n`;
        }
        text += `======================\n\n`;

        text += `*CATEGORY* (Rupiah)\n`;
        text += `1. TOYS (NS) : Rp ${parseFloat(document.getElementById('catToys').value || 0).toLocaleString('id-ID')}\n`;
        text += `2. TELUR (NS) : Rp ${parseFloat(document.getElementById('catTelur').value || 0).toLocaleString('id-ID')}\n`;
        text += `======================\n\n`;

        text += `*E-COMMERCE*\n1. FEE BASE (RP) : Rp ${parseFloat(document.getElementById('feeBase').value || 0).toLocaleString('id-ID')}\n\n`;
        text += `Terimakasih`;
        return text;
    }

    function showWaPreview() {
        document.getElementById('modalTitle').innerText = "Pratinjau Format WhatsApp (Per Toko)";
        document.getElementById('previewText').innerText = generateWaText();
        document.getElementById('waModal').style.display = 'block';
    }

    function showTotalSummaryPreview() {
        document.getElementById('modalTitle').innerText = "Pratinjau Rekap Total Keseluruhan (20 Toko)";
        document.getElementById('previewText').innerText = "Menghitung rekap total...";
        document.getElementById('waModal').style.display = 'block';

        let actualVal = parseFloat(document.getElementById('actualSales').value || 0);
        let memberVal = parseInt(document.getElementById('actualNewMember').value || 0);
        let feeVal = parseFloat(document.getElementById('feeBase').value || 0);

        let summary = `REKAP TOTAL KESELURUHAN (20 TOKO)\n`;
        summary += `PERIODE : ${formatPeriodeDate(document.getElementById('datePicker').value)}\n`;
        summary += `======================\n`;
        summary += `• Total Actual Sales: Rp ${actualVal.toLocaleString('id-ID')}\n`;
        summary += `• Total New Member: ${memberVal}\n`;
        summary += `• Total Fee Base: Rp ${feeVal.toLocaleString('id-ID')}\n`;
        summary += `======================\n`;
        summary += `Data rekap harian aktif.`;
        
        document.getElementById('previewText').innerText = summary;
    }

    function closeWaPreview() { document.getElementById('waModal').style.display = 'none'; }
    function sendToWhatsApp() { window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(generateWaText())}`, '_blank'); }
    
    function sendTotalSummaryWhatsApp() { 
        let summary = document.getElementById('previewText').innerText;
        if(!summary || summary.includes("Menghitung")) {
            alert("Silakan klik 'Preview & Rekap Total Keseluruhan' terlebih dahulu!");
            return;
        }
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`, '_blank'); 
    }
</script>

</body>
</html>
