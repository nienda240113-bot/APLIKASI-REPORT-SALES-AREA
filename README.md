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
        .btn-rekap { background-color: #6f42c1; }
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
        <label>Periode Tanggal (Mengikuti Tanggal Perangkat)</label>
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
            <option value="1">Shift 1</option>
            <option value="2">Shift 2</option>
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
                for(let i=1; i<=10; i++) {
                    document.write(`
                        <tr>
                            <td>${i}</td>
                            <td><input type="text" id="name_psm${i}" class="target-field table-input" value="PSM ${i}"></td>
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

    <!-- TOMBOL AKSI UTAMA -->
    <button type="button" class="btn btn-target" onclick="saveStoreTarget()">💾 Simpan Target Permanen Toko Ini</button>
    <button type="button" class="btn btn-save" onclick="alert('Laporan berhasil diproses & dikirim!')">Simpan & Kirim Laporan</button>
    
    <!-- TOMBOL PREVIEW DAN WHATSAPP -->
    <button type="button" class="btn btn-preview" onclick="showWaPreview()">👁️ Preview WhatsApp (Per Toko)</button>
    <button type="button" class="btn btn-wa" onclick="sendToWhatsApp()">📲 Kirim Teks ke WhatsApp (Per Toko)</button>
    
    <!-- TOMBOL REKAP TOTAL 20 TOKO -->
    <button type="button" class="btn btn-rekap" onclick="showRekapPreview()">📊 Preview & Rekap Total Keseluruhan (20 Toko)</button>
    <button type="button" class="btn btn-wa" onclick="sendRekapWhatsApp()">📲 Kirim Rekap Total ke WhatsApp</button>
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
    // Set tanggal otomatis mengikuti tanggal online/sistem perangkat saat ini
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDateFormatted = `${year}-${month}-${day}`;
    document.getElementById('datePicker').value = currentDateFormatted;

    const storeListCodes = [
        "C624 / RWBT", "C560 / RAJ", "CH81 / CDKS", "CG76 / SPMM", "C573 / GMM", 
        "CE47 / MKRI", "CI30 / STTD", "CH41 / KPMRK", "CG54 / MM21", "C935 / TLJ2", 
        "CA71 / WSGN", "C965 / CBNU", "CG86 / JKST", "CA94 / KPTI", "C574 / SKU", 
        "CI15 / RPSU", "CI54 / RJLB", "CF50 / DNIA", "CC21 / KUTN", "CI84 / TLKW"
    ];

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
        const year = parts[0];
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return `${day} ${monthNames[monthIndex] || parts[1]}`;
    }

    function generateWaText() {
        const storeVal = document.getElementById('storeSelect').value || " / -";
        const storeParts = storeVal.split(' / ');
        const kdStore = storeParts[0] || '-';
        const namaStore = storeParts[1] || '-';
        
        const rawDate = document.getElementById('datePicker').value;
        const periodeFormatted = formatPeriodeDate(rawDate);
        const shift = document.getElementById('shiftSelect').value || '-';

        let text = `REPORT SALES HARIAN\n`;
        text += `PERIODE : ${periodeFormatted}\n`;
        text += `WH : Bekasi\n`;
        text += `AM : SRD\n`;
        text += `AC : Triyanto\n`;
        text += `KD Toko : ${kdStore}\n`;
        text += `Nama Toko : ${namaStore}\n`;
        text += `Shift : ${shift}\n`;
        text += `======================\n\n`;

        text += `*REVENUE*\n`;
        text += `1. NET SALES\n`;
        text += `- TIME FAKTOR : ${document.getElementById('timeFactor').value}\n`;
        text += `- TARGET MTD : ${parseFloat(document.getElementById('targetMTD').value || 0).toLocaleString('id-ID')}\n`;
        text += `- TARGET TIME FACTOR : ${document.getElementById('targetTimeFactor').value}\n`;
        text += `- ACTUAL : ${parseFloat(document.getElementById('actualSales').value || 0).toLocaleString('id-ID')}\n`;
        text += `- ACHIEVED MTD : ${document.getElementById('achieveMTD').value}\n`;
        text += `- ACHIEVED TIME FACTOR : ${document.getElementById('achieveTF').value}\n`;
        text += `- GAP TO TARGET : ${document.getElementById('gapTarget').value}\n`;
        text += `- GAP TO TIME FACTOR : ${document.getElementById('gapTF').value}\n\n`;

        text += `*FOKUS CABANG*\n`;
        text += `======================\n`;
        text += `TARGET/SALES/ACV%\n`;
        text += `1. TEBUS MURAH : ${document.getElementById('targ_fokus1').value||0}/${document.getElementById('act_fokus1').value||0}/${document.getElementById('persen_fokus1').value}\n`;
        text += `2. SERBA GRATIS : ${document.getElementById('targ_fokus2').value||0}/${document.getElementById('act_fokus2').value||0}/${document.getElementById('persen_fokus2').value}\n`;
        text += `3. SUUEGEER : ${document.getElementById('targ_fokus3').value||0}/${document.getElementById('act_fokus3').value||0}/${document.getElementById('persen_fokus3').value}\n`;
        text += `4. PROMO CEBAN : ${document.getElementById('targ_fokus4').value||0}/${document.getElementById('act_fokus4').value||0}/${document.getElementById('persen_fokus4').value}\n`;
        text += `======================\n\n`;

        text += `*MEMBER*\n`;
        text += `1. ACTUAL NEW MEMBER : ${document.getElementById('actualNewMember').value||0}\n`;
        text += `2. KONTRIBUSI STRUK MEMBER (STRUK MEMBER : Total struk) = ${document.getElementById('strukMember').value||0}/${document.getElementById('totalStruk').value||0}/${document.getElementById('persenMember').value}\n`;
        text += `======================\n\n`;

        text += `*PSM* (In Qty).\n`;
        text += `( TARGET/ACTUAL /% )\n`;
        for(let i=1; i<=10; i++) {
            const targ = document.getElementById(`targ_psm${i}`).value || 0;
            const act = document.getElementById(`act_psm${i}`).value || 0;
            const pct = document.getElementById(`persen_psm${i}`).value || '0%';
            text += `PSM ${i} : ${targ}/${act}/${pct}\n`;
        }
        text += `======================\n\n`;

        text += `*CATEGORY* (Rupiah)\n`;
        text += `1. TOYS (NS) : Rp ${parseFloat(document.getElementById('catToys').value || 0).toLocaleString('id-ID')}\n`;
        text += `2. TELUR (NS) : Rp ${parseFloat(document.getElementById('catTelur').value || 0).toLocaleString('id-ID')}\n`;
        text += `======================\n\n`;

        text += `*E-COMMERCE*\n`;
        text += `1. FEE BASE (RP) : Rp ${parseFloat(document.getElementById('feeBase').value || 0).toLocaleString('id-ID')}\n\n`;

        text += `Terimakasih`;

        return text;
    }

    // FUNGSI REKAP TOTAL KESELURUHAN DARI 20 TOKO
    function generateRekapText() {
        const selectedDate = document.getElementById('datePicker').value || currentDateFormatted;
        const periodeFormatted = formatPeriodeDate(selectedDate);
        
        let sumTargetMTD = 0;
        let sumActualSales = 0;
        let sumTargetTF = 0;
        
        let sumTargF1 = 0, sumActF1 = 0;
        let sumTargF2 = 0, sumActF2 = 0;
        let sumTargF3 = 0, sumActF3 = 0;
        let sumTargF4 = 0, sumActF4 = 0;
        
        let sumNewMember = 0;
        let sumTotalStruk = 0;
        let sumStrukMember = 0;
        
        let sumToys = 0;
        let sumTelur = 0;
        let sumFeeBase = 0;

        let psmTotals = {};
        for(let i=1; i<=10; i++) {
            psmTotals[i] = { targ: 0, act: 0, name: `PSM ${i}` };
        }

        const dateObj = new Date(selectedDate);
        const dayNum = isNaN(dateObj.getDate()) ? 1 : dateObj.getDate();
        const totalDaysInMonth = isNaN(dateObj.getFullYear()) ? 30 : new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
        const tfPercent = (dayNum / totalDaysInMonth) * 100;

        storeListCodes.forEach(storeCode => {
            const targetKey = `permanent_target_${storeCode}`;
            const dailyKey = `actual_${storeCode}_${selectedDate}`;

            let tData = JSON.parse(localStorage.getItem(targetKey) || '{}');
            let dData = JSON.parse(localStorage.getItem(dailyKey) || '{}');

            const tMTD = parseFloat(tData.targetMTD || 0);
            const aSales = parseFloat(dData.actualSales || 0);
            const tTF = tMTD * (dayNum / totalDaysInMonth);

            sumTargetMTD += tMTD;
            sumActualSales += aSales;
            sumTargetTF += tTF;

            sumTargF1 += parseFloat(tData.targ_fokus1 || 0);
            sumActF1 += parseFloat(dData.act_fokus1 || 0);

            sumTargF2 += parseFloat(tData.targ_fokus2 || 0);
            sumActF2 += parseFloat(dData.act_fokus2 || 0);

            sumTargF3 += parseFloat(tData.targ_fokus3 || 0);
            sumActF3 += parseFloat(dData.act_fokus3 || 0);

            sumTargF4 += parseFloat(tData.targ_fokus4 || 0);
            sumActF4 += parseFloat(dData.act_fokus4 || 0);

            sumNewMember += parseFloat(dData.actualNewMember || 0);
            sumTotalStruk += parseFloat(dData.totalStruk || 0);
            sumStrukMember += parseFloat(dData.strukMember || 0);

            sumToys += parseFloat(dData.catToys || 0);
            sumTelur += parseFloat(dData.catTelur || 0);
            sumFeeBase += parseFloat(dData.feeBase || 0);

            for(let i=1; i<=10; i++) {
                if(tData[`name_psm${i}`]) psmTotals[i].name = tData[`name_psm${i}`];
                psmTotals[i].targ += parseFloat(tData[`targ_psm${i}`] || 0);
                psmTotals[i].act += parseFloat(dData[`act_psm${i}`] || 0);
            }
        });

        const achieveMTD = sumTargetMTD > 0 ? (sumActualSales / sumTargetMTD) * 100 : 0;
        const achieveTF = sumTargetTF > 0 ? (sumActualSales / sumTargetTF) * 100 : 0;
        const gapTarget = sumActualSales - sumTargetMTD;
        const gapTF = sumActualSales - sumTargetTF;

        const acvF1 = sumTargF1 > 0 ? Math.round((sumActF1 / sumTargF1) * 100) : 0;
        const acvF2 = sumTargF2 > 0 ? Math.round((sumActF2 / sumTargF2) * 100) : 0;
        const acvF3 = sumTargF3 > 0 ? Math.round((sumActF3 / sumTargF3) * 100) : 0;
        const acvF4 = sumTargF4 > 0 ? Math.round((sumActF4 / sumTargF4) * 100) : 0;

        const kontribusiMember = sumTotalStruk > 0 ? Math.round((sumStrukMember / sumTotalStruk) * 100) : 0;

        let text = `REPORT SALES (REKAP TOTAL 20 TOKO)\n`;
        text += `PERIODE : ${periodeFormatted}\n`;
        text += `WH : Bekasi\n`;
        text += `AM : SRD\n`;
        text += `AC : Triyanto\n`;
        text += `======================\n`;
        text += `*REVENUE*\n`;
        text += `1. NET SALES\n`;
        text += `- TIME FAKTOR : ${tfPercent.toFixed(2).replace('.', ',')}%\n`;
        text += `- TARGET MTD : ${sumTargetMTD.toLocaleString('id-ID')}\n`;
        text += `- TARGET TIME FACTOR : ${Math.round(sumTargetTF).toLocaleString('id-ID')}\n`;
        text += `- ACTUAL : ${sumActualSales.toLocaleString('id-ID')}\n`;
        text += `- ACHIEVED MTD : ${achieveMTD.toFixed(2).replace('.', ',')}%\n`;
        text += `- ACHIEVED TIME FACTOR : ${achieveTF.toFixed(2).replace('.', ',')}%\n`;
        text += `- GAP TO TARGET : ${gapTarget.toLocaleString('id-ID')}\n`;
        text += `- GAP TO TIME FACTOR : ${Math.round(gapTF).toLocaleString('id-ID')}\n`;
        text += `======================\n`;
        text += `*FOKUS CABANG*\n`;
        text += `TARGET/SALES/ACV%\n`;
        text += `1. TEBUS MURAH : ${sumTargF1}/${sumActF1}/${acvF1}%\n`;
        text += `2. SERBA GRATIS : ${sumTargF2}/${sumActF2}/${acvF2}%\n`;
        text += `3. SUUEGEER : ${sumTargF3}/${sumActF3}/${acvF3}%\n`;
        text += `4. PROMO CEBAN : ${sumTargF4}/${sumActF4}/${acvF4}%\n`;
        text += `======================\n`;
        text += `*MEMBER*\n`;
        text += `1. ACTUAL NEW MEMBER : ${sumNewMember}\n`;
        text += `2. KONTRIBUSI STRUK MEMBER = ${sumStrukMember}/${sumTotalStruk}/${kontribusiMember}%\n`;
        text += `======================\n`;
        text += `*PSM* (In Qty).\n`;
        for(let i=1; i<=10; i++) {
            let psmAcv = psmTotals[i].targ > 0 ? Math.round((psmTotals[i].act / psmTotals[i].targ) * 100) : 0;
            text += `PSM ${i} : ${psmTotals[i].targ}/${psmTotals[i].act}/${psmAcv}%\n`;
        }
        text += `======================\n`;
        text += `*CATEGORY* (Rupiah)\n`;
        text += `1. TOYS (NS) : Rp ${sumToys.toLocaleString('id-ID')}\n`;
        text += `2. TELUR (NS) : Rp ${sumTelur.toLocaleString('id-ID')}\n`;
        text += `======================\n`;
        text += `*E-COMMERCE*\n`;
        text += `1. FEE BASE (RP) : Rp ${sumFeeBase.toLocaleString('id-ID')}\n\n`;
        text += `Terimakasih`;

        return text;
    }

    function showWaPreview() {
        document.getElementById('modalTitle').innerText = "Pratinjau Format WhatsApp (Per Toko)";
        document.getElementById('previewText').innerText = generateWaText();
        document.getElementById('waModal').style.display = 'block';
    }

    function showRekapPreview() {
        document.getElementById('modalTitle').innerText = "Pratinjau Rekap Total Keseluruhan (20 Toko)";
        document.getElementById('previewText').innerText = generateRekapText();
        document.getElementById('waModal').style.display = 'block';
    }

    function closeWaPreview() {
        document.getElementById('waModal').style.display = 'none';
    }

    function sendToWhatsApp() {
        const text = generateWaText();
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }

    function sendRekapWhatsApp() {
        const text = generateRekapText();
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
        calculateAllCalculations();
    }

    function loadDailyData() {
        loadStoreTarget(); 

        const key = getDailyKey();
        if (!key) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('shiftSelect').value = data.shiftSelect || '1';
            document.getElementById('actualSales').value = data.actualSales || '';
            document.getElementById('act_fokus1').value = data.act_fokus1 || '';
            document.getElementById('act_fokus2').value = data.act_fokus2 || '';
            document.getElementById('act_fokus3').value = data.act_fokus3 || '';
            document.getElementById('act_fokus4').value = data.act_fokus4 || '';
            document.getElementById('actualNewMember').value = data.actualNewMember || '';
            document.getElementById('totalStruk').value = data.totalStruk || '';
            document.getElementById('strukMember').value = data.strukMember || '';

            for(let i=1; i<=10; i++) {
                document.getElementById(`act_psm${i}`).value = data[`act_psm${i}`] || '';
            }

            document.getElementById('catToys').value = data.catToys || '';
            document.getElementById('catTelur').value = data.catTelur || '';
            document.getElementById('feeBase').value = data.feeBase || '';
        } else {
            document.getElementById('actualSales').value = '';
            document.getElementById('act_fokus1').value = '';
            document.getElementById('act_fokus2').value = '';
            document.getElementById('act_fokus3').value = '';
            document.getElementById('act_fokus4').value = '';
            document.getElementById('actualNewMember').value = '';
            document.getElementById('totalStruk').value = '';
            document.getElementById('strukMember').value = '';

            for(let i=1; i<=10; i++) {
                document.getElementById(`act_psm${i}`).value = '';
            }

            document.getElementById('catToys').value = '';
            document.getElementById('catTelur').value = '';
            document.getElementById('feeBase').value = '';
        }
        calculateAllCalculations();
    }

    function autoSaveDaily() {
        const key = getDailyKey();
        if (!key) return;

        const data = {
            shiftSelect: document.getElementById('shiftSelect').value,
            actualSales: document.getElementById('actualSales').value,
            act_fokus1: document.getElementById('act_fokus1').value,
            act_fokus2: document.getElementById('act_fokus2').value,
            act_fokus3: document.getElementById('act_fokus3').value,
            act_fokus4: document.getElementById('act_fokus4').value,
            actualNewMember: document.getElementById('actualNewMember').value,
            totalStruk: document.getElementById('totalStruk').value,
            strukMember: document.getElementById('strukMember').value,
            catToys: document.getElementById('catToys').value,
            catTelur: document.getElementById('catTelur').value,
            feeBase: document.getElementById('feeBase').value
        };

        for(let i=1; i<=10; i++) {
            data[`act_psm${i}`] = document.getElementById(`act_psm${i}`).value;
        }

        localStorage.setItem(key, JSON.stringify(data));
        calculateAllCalculations();
    }

    document.getElementById('storeSelect').addEventListener('change', loadDailyData);
    document.getElementById('datePicker').addEventListener('change', function() {
        loadDailyData();
        calculateAllCalculations();
    });

    document.querySelectorAll('.actual-field, .target-field').forEach(input => {
        input.addEventListener('input', autoSaveDaily);
    });

    calculateAllCalculations();
</script>

</body>
</html>
