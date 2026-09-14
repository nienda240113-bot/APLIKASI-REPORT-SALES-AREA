<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report - Store Portal</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #0d6efd;
            --bg-color: #f8f9fa;
        }
        body {
            background-color: var(--bg-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .navbar-brand {
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .card {
            border: none;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            margin-bottom: 1.5rem;
            border-radius: 0.5rem;
        }
        .card-header {
            background-color: #fff;
            border-bottom: 1px solid rgba(0,0,0,.125);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            padding: 1rem 1.25rem;
            border-top-left-radius: 0.5rem !important;
            border-top-right-radius: 0.5rem !important;
        }
        .form-label {
            font-weight: 500;
            font-size: 0.85rem;
            color: #495057;
        }
        .table-sm th, .table-sm td {
            padding: 0.5rem;
            vertical-align: middle;
        }
        .badge-status {
            font-size: 0.8rem;
            padding: 0.4em 0.8em;
        }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand" href="#"><i class="fas fa-store me-2"></i>Store Sales Portal</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item me-3">
                        <span class="text-white-50 small" id="syncStatus"><i class="fas fa-cloud text-warning me-1"></i> Mode: Local / GAS Ready</span>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-light btn-sm text-primary fw-bold" data-bs-toggle="modal" data-bs-target="#configModal"><i class="fas fa-cog me-1"></i> Setup GAS URL</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="container py-4">
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card bg-white shadow-sm">
                    <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div>
                            <h4 class="mb-1 fw-bold text-dark"><i class="fas fa-file-invoice-dollar text-primary me-2"></i>Form & Laporan Sales Harian</h4>
                            <p class="text-muted mb-0 small">Kelola, edit, dan sinkronkan laporan operasional toko secara real-time.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary btn-sm" onclick="loadSampleData()"><i class="fas fa-undo me-1"></i> Load Contoh Data</button>
                            <button class="btn btn-success btn-sm" onclick="saveReport()"><i class="fas fa-save me-1"></i> Simpan & Kirim Laporan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <form id="salesReportForm">
            <!-- HEADER INFO -->
            <div class="card">
                <div class="card-header bg-light text-primary"><i class="fas fa-info-circle me-2"></i>Informasi Umum Toko</div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Periode Tanggal</label>
                            <input type="date" class="form-control" id="periode" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">WH (Warehouse)</label>
                            <input type="text" class="form-control" id="wh" value="Bekasi" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">AM</label>
                            <input type="text" class="form-control" id="am" value="SRD" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">AC (Area Controller / Supervisor)</label>
                            <input type="text" class="form-control" id="ac" value="Triyanto" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Kode & Nama Toko</label>
                            <select class="form-select" id="storeCodeName" required>
                                <option value="">-- Pilih Toko --</option>
                                <option value="C624/RWBT">C624 / RWBT</option>
                                <option value="C560/RAJ">C560 / RAJ</option>
                                <option value="CH81/CDKS">CH81 / CDKS</option>
                                <option value="CG76/SPMM">CG76 / SPMM</option>
                                <option value="C573/GMM">C573 / GMM</option>
                                <option value="CE47/MKRI">CE47 / MKRI</option>
                                <option value="CI30/STTD">CI30 / STTD</option>
                                <option value="CH41/KPMRK">CH41 / KPMRK</option>
                                <option value="CG54/MM21">CG54 / MM21</option>
                                <option value="C935/TLJ2">C935 / TLJ2</option>
                                <option value="CA71/WSGN">CA71 / WSGN</option>
                                <option value="C965/CBNU">C965 / CBNU</option>
                                <option value="CG86/JKST">CG86 / JKST</option>
                                <option value="CA94/KPTI">CA94 / KPTI</option>
                                <option value="C574/SKU">C574 / SKU</option>
                                <option value="CI15/RPSU">CI15 / RPSU</option>
                                <option value="CI54/RJLB">CI54 / RJLB</option>
                                <option value="CF50/DNIA">CF50 / DNIA</option>
                                <option value="CC21/KUTN">CC21 / KUTN</option>
                                <option value="CI84/TLKW">CI84 / TLKW</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Shift</label>
                            <select class="form-select" id="shift">
                                <option value="1">Shift 1</option>
                                <option value="2" selected>Shift 2</option>
                                <option value="Full">Full Day</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- REVENUE -->
            <div class="card">
                <div class="card-header bg-light text-primary"><i class="fas fa-chart-line me-2"></i>Revenue / Net Sales</div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Time Factor (%)</label>
                            <input type="number" step="0.01" class="form-control" id="timeFactor" placeholder="13.3">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Target MTD (Rp)</label>
                            <input type="number" class="form-control" id="targetMtd" placeholder="329236885">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Target Time Factor (Rp)</label>
                            <input type="number" class="form-control" id="targetTimeFactor" placeholder="43788506">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Actual Sales (Rp)</label>
                            <input type="number" class="form-control" id="actualSales" placeholder="11256202">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Achieve MTD (%)</label>
                            <input type="number" step="0.01" class="form-control" id="achieveMtd" placeholder="3.42">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Achieve Time Factor (%)</label>
                            <input type="number" step="0.01" class="form-control" id="achieveTimeFactor" placeholder="25.71">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Gap to Target (Rp)</label>
                            <input type="number" class="form-control" id="gapTarget" placeholder="317980683">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Gap to Time Factor (Rp)</label>
                            <input type="number" class="form-control" id="gapTimeFactor" placeholder="32532304">
                        </div>
                    </div>
                </div>
            </div>

            <!-- FOKUS CABANG -->
            <div class="card">
                <div class="card-header bg-light text-primary"><i class="fas fa-bullseye me-2"></i>Fokus Cabang (Target / Sales / ACV% / On Hand)</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm align-middle">
                            <thead class="table-light text-center">
                                <tr>
                                    <th>Program / Fokus</th>
                                    <th>Target</th>
                                    <th>Sales / Actual</th>
                                    <th>Achieve (%)</th>
                                    <th>On Hand</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="fw-bold">1. Tebus Murah</td>
                                    <td><input type="number" class="form-control form-control-sm" id="tmTarget" value="20"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="tmSales" value="29"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm" id="tmAcv" value="145"></td>
                                    <td><input type="text" class="form-control form-control-sm" id="tmOh" value="-"></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">2. Serba Gratis</td>
                                    <td><input type="number" class="form-control form-control-sm" id="sgTarget" value="13"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="sgSales" value="12"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm" id="sgAcv" value="92"></td>
                                    <td><input type="text" class="form-control form-control-sm" id="sgOh" value="-"></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">3. Suuegeer</td>
                                    <td><input type="number" class="form-control form-control-sm" id="suTarget" value="48"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="suSales" value="17"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm" id="suAcv" value="35"></td>
                                    <td><input type="text" class="form-control form-control-sm" id="suOh" value="-"></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">4. Promo Ceban</td>
                                    <td><input type="number" class="form-control form-control-sm" id="pcTarget" value="213"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="pcSales" value="0"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm" id="pcAcv" value="0"></td>
                                    <td><input type="text" class="form-control form-control-sm" id="pcOh" value="-"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- MEMBER -->
            <div class="card">
                <div class="card-header bg-light text-primary"><i class="fas fa-users me-2"></i>Member</div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Actual New Member</label>
                            <input type="number" class="form-control" id="newMember" value="0">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Kontribusi Struk Member (Total Struk / Struk Member / %)</label>
                            <input type="text" class="form-control" id="strukMember" value="Total struk = 118 / 213 / 55%">
                        </div>
                    </div>
                </div>
            </div>

            <!-- PSM -->
            <div class="card">
                <div class="card-header bg-light text-primary"><i class="fas fa-boxes me-2"></i>PSM (In Qty: Target - Actual - %)</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm align-middle" id="psmTable">
                            <thead class="table-light text-center">
                                <tr>
                                    <th>Produk PSM</th>
                                    <th>Target</th>
                                    <th>Actual</th>
                                    <th>Achieve (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Bango</td><td><input type="number" class="form-control form-control-sm psm-t" value="105"></td><td><input type="number" class="form-control form-control-sm psm-a" value="1"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="1"></td></tr>
                                <tr><td>Daia</td><td><input type="number" class="form-control form-control-sm psm-t" value="45"></td><td><input type="number" class="form-control form-control-sm psm-a" value="1"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="2"></td></tr>
                                <tr><td>Enaak</td><td><input type="number" class="form-control form-control-sm psm-t" value="28"></td><td><input type="number" class="form-control form-control-sm psm-a" value="0"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="0"></td></tr>
                                <tr><td>Garnier</td><td><input type="number" class="form-control form-control-sm psm-t" value="14"></td><td><input type="number" class="form-control form-control-sm psm-a" value="4"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="29"></td></tr>
                                <tr><td>Le Mineral</td><td><input type="number" class="form-control form-control-sm psm-t" value="171"></td><td><input type="number" class="form-control form-control-sm psm-a" value="4"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="2"></td></tr>
                                <tr><td>Lifebuoy</td><td><input type="number" class="form-control form-control-sm psm-t" value="28"></td><td><input type="number" class="form-control form-control-sm psm-a" value="0"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="0"></td></tr>
                                <tr><td>Nipis Madu</td><td><input type="number" class="form-control form-control-sm psm-t" value="96"></td><td><input type="number" class="form-control form-control-sm psm-a" value="3"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="3"></td></tr>
                                <tr><td>Taro</td><td><input type="number" class="form-control form-control-sm psm-t" value="62"></td><td><input type="number" class="form-control form-control-sm psm-a" value="6"></td><td><input type="number" step="0.01" class="form-control form-control-sm psm-p" value="10"></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- CATEGORY & E-COMMERCE -->
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-light text-primary"><i class="fas fa-tags me-2"></i>Category (Rupiah)</div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">1. TOYS (NS)</label>
                                <input type="number" class="form-control" id="catToys" value="0">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">2. HBPL (NS)</label>
                                <input type="number" class="form-control" id="catHbpl" value="0">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-light text-primary"><i class="fas fa-globe me-2"></i>E-Commerce</div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">Fee Base (Rp)</label>
                                <input type="number" class="form-control" id="feeBase" value="250000">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SUBMIT BUTTON BOTTOM -->
            <div class="text-end mb-5">
                <button type="button" class="btn btn-primary btn-lg px-5 shadow" onclick="saveReport()"><i class="fas fa-paper-plane me-2"></i>Simpan & Kirim Laporan</button>
            </div>
        </form>
    </div>

    <!-- CONFIG MODAL -->
    <div class="modal fade" id="configModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold"><i class="fas fa-cog me-2"></i>Konfigurasi Google Apps Script URL</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted small">Masukkan Web App URL dari Google Apps Script Anda agar data tersimpan otomatis ke Google Sheets secara online.</p>
                    <div class="mb-3">
                        <label class="form-label">Google Apps Script Web App URL</label>
                        <input type="text" class="form-control" id="gasUrlInput" placeholder="https://script.google.com/macros/s/.../exec">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Tutup</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="saveGasUrl()">Simpan URL</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('periode').valueAsDate = new Date();
            const savedUrl = localStorage.getItem('gas_url');
            if(savedUrl) {
                document.getElementById('gasUrlInput').value = savedUrl;
                document.getElementById('syncStatus').innerHTML = '<i class="fas fa-cloud text-success me-1"></i> Mode: Terhubung ke GAS';
            }
            loadLocalData();
        });

        function saveGasUrl() {
            const url = document.getElementById('gasUrlInput').value.trim();
            localStorage.setItem('gas_url', url);
            document.getElementById('syncStatus').innerHTML = '<i class="fas fa-cloud text-success me-1"></i> Mode: Terhubung ke GAS';
            bootstrap.Modal.getInstance(document.getElementById('configModal')).hide();
            alert('URL Google Apps Script berhasil disimpan!');
        }

        function loadSampleData() {
            document.getElementById('periode').value = '2026-09-04';
            document.getElementById('wh').value = 'Bekasi';
            document.getElementById('am').value = 'SRD';
            document.getElementById('ac').value = 'Triyanto';
            document.getElementById('storeCodeName').value = 'CC21/KUTN';
            document.getElementById('shift').value = '2';
            
            document.getElementById('timeFactor').value = '13.3';
            document.getElementById('targetMtd').value = '329236885';
            document.getElementById('targetTimeFactor').value = '43788506';
            document.getElementById('actualSales').value = '11256202';
            document.getElementById('achieveMtd').value = '3.42';
            document.getElementById('achieveTimeFactor').value = '25.71';
            document.getElementById('gapTarget').value = '317980683';
            document.getElementById('gapTimeFactor').value = '32532304';
            
            document.getElementById('tmTarget').value = '20';
            document.getElementById('tmSales').value = '29';
            document.getElementById('tmAcv').value = '145';
            
            document.getElementById('sgTarget').value = '13';
            document.getElementById('sgSales').value = '12';
            document.getElementById('sgAcv').value = '92';

            document.getElementById('suTarget').value = '48';
            document.getElementById('suSales').value = '17';
            document.getElementById('suAcv').value = '35';

            document.getElementById('pcTarget').value = '213';
            document.getElementById('pcSales').value = '0';
            document.getElementById('pcAcv').value = '0';

            document.getElementById('newMember').value = '0';
            document.getElementById('strukMember').value = 'Total struk = 118 / 213 / 55%';
            document.getElementById('feeBase').value = '250000';
            alert('Contoh data berhasil dimuat!');
        }

        function saveReport() {
            const formData = {
                periode: document.getElementById('periode').value,
                wh: document.getElementById('wh').value,
                am: document.getElementById('am').value,
                ac: document.getElementById('ac').value,
                storeCodeName: document.getElementById('storeCodeName').value,
                shift: document.getElementById('shift').value,
                revenue: {
                    timeFactor: document.getElementById('timeFactor').value,
                    targetMtd: document.getElementById('targetMtd').value,
                    targetTimeFactor: document.getElementById('targetTimeFactor').value,
                    actualSales: document.getElementById('actualSales').value,
                    achieveMtd: document.getElementById('achieveMtd').value,
                    achieveTimeFactor: document.getElementById('achieveTimeFactor').value,
                    gapTarget: document.getElementById('gapTarget').value,
                    gapTimeFactor: document.getElementById('gapTimeFactor').value
                },
                fokus: {
                    tebusMurah: { t: document.getElementById('tmTarget').value, s: document.getElementById('tmSales').value, a: document.getElementById('tmAcv').value },
                    serbaGratis: { t: document.getElementById('sgTarget').value, s: document.getElementById('sgSales').value, a: document.getElementById('sgAcv').value },
                    suuegeer: { t: document.getElementById('suTarget').value, s: document.getElementById('suSales').value, a: document.getElementById('suAcv').value },
                    promoCeban: { t: document.getElementById('pcTarget').value, s: document.getElementById('pcSales').value, a: document.getElementById('pcAcv').value }
                },
                member: {
                    newMember: document.getElementById('newMember').value,
                    strukMember: document.getElementById('strukMember').value
                },
                feeBase: document.getElementById('feeBase').value,
                timestamp: new Date().toISOString()
            };

            // Save to LocalStorage for cross-device persistence / offline
            localStorage.setItem('latest_sales_report', JSON.stringify(formData));
            
            const gasUrl = localStorage.getItem('gas_url');
            if(gasUrl) {
                // Send to Google Apps Script Web App
                fetch(gasUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }).then(() => {
                    alert('Laporan berhasil disimpan lokal dan dikirim ke Google Sheets!');
                }).catch(err => {
                    console.error(err);
                    alert('Laporan tersimpan lokal (Gagal sync ke GAS, periksa koneksi/URL).');
                });
            } else {
                alert('Laporan berhasil disimpan secara lokal! (Atur Google Apps Script URL di tombol atas untuk sync online ke Google Sheets).');
            }
        }

        function loadLocalData() {
            const saved = localStorage.getItem('latest_sales_report');
            if(saved) {
                try {
                    const data = JSON.parse(saved);
                    if(data.periode) document.getElementById('periode').value = data.periode;
                    if(data.wh) document.getElementById('wh').value = data.wh;
                    if(data.am) document.getElementById('am').value = data.am;
                    if(data.ac) document.getElementById('ac').value = data.ac;
                    if(data.storeCodeName) document.getElementById('storeCodeName').value = data.storeCodeName;
                    if(data.shift) document.getElementById('shift').value = data.shift;
                    if(data.revenue) {
                        document.getElementById('timeFactor').value = data.revenue.timeFactor || '';
                        document.getElementById('targetMtd').value = data.revenue.targetMtd || '';
                        document.getElementById('targetTimeFactor').value = data.revenue.targetTimeFactor || '';
                        document.getElementById('actualSales').value = data.revenue.actualSales || '';
                        document.getElementById('achieveMtd').value = data.revenue.achieveMtd || '';
                        document.getElementById('achieveTimeFactor').value = data.revenue.achieveTimeFactor || '';
                        document.getElementById('gapTarget').value = data.revenue.gapTarget || '';
                        document.getElementById('gapTimeFactor').value = data.revenue.gapTimeFactor || '';
                    }
                    if(data.feeBase) document.getElementById('feeBase').value = data.feeBase;
                } catch(e) {
                    console.error(e);
                }
            }
        }
    </script>
</body>
</html>
