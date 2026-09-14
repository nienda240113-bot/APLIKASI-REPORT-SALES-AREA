<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report - Multi-Device Store Portal</title>
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
        .auto-calc {
            background-color: #e9ecef !important;
            font-weight: 600;
            color: #0d6efd;
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
                        <span class="text-white-50 small" id="syncStatus"><i class="fas fa-cloud text-warning me-1"></i> Mode: Auto-Save Active</span>
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
                            <p class="text-muted mb-0 small">Toko cukup isi Actual. Target & item tersimpan otomatis di perangkat ini untuk semua device.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary btn-sm" onclick="resetForm()"><i class="fas fa-undo me-1"></i> Reset Actual</button>
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
                            <input type="date" class="form-control" id="periode" onchange="onDateOrStoreChange()" required>
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
                            <label class="form-label">AC (Supervisor)</label>
                            <input type="text" class="form-control" id="ac" value="Triyanto" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Kode & Nama Toko</label>
                            <select class="form-select" id="storeCodeName" onchange="onDateOrStoreChange()" required>
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
                            <select class="form-select" id="shift" onchange="autoSaveState()">
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
                            <label class="form-label">Target MTD (Rp) [Bisa Diedit & Disimpan]</label>
                            <input type="number" class="form-control" id="targetMtd" value="329236885" oninput="calculateRevenue()">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Actual Sales (Rp) [Input Toko]</label>
                            <input type="number" class="form-control" id="actualSales" placeholder="Cth: 11256202" oninput="calculateRevenue()">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Time Factor (%) [Otomatis Tanggal Berjalan]</label>
                            <input type="number" step="0.01" class="form-control auto-calc" id="timeFactor" readonly>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Target Time Factor (Rp) [Otomatis]</label>
                            <input type="number" class="form-control auto-calc" id="targetTimeFactor" readonly>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Achieve MTD (%) [Otomatis]</label>
                            <input type="number" step="0.01" class="form-control auto-calc" id="achieveMtd" readonly>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Achieve Time Factor (%) [Otomatis]</label>
                            <input type="number" step="0.01" class="form-control auto-calc" id="achieveTimeFactor" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Gap to Target (Rp) [Otomatis]</label>
                            <input type="number" class="form-control auto-calc" id="gapTarget" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Gap to Time Factor (Rp) [Otomatis]</label>
                            <input type="number" class="form-control auto-calc" id="gapTimeFactor" readonly>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FOKUS CABANG -->
            <div class="card">
                <div class="card-header bg-light text-primary"><i class="fas fa-bullseye me-2"></i>Fokus Cabang (Target Bisa Diedit & Disimpan, Toko Isi Actual)</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm align-middle">
                            <thead class="table-light text-center">
                                <tr>
                                    <th>Program / Fokus</th>
                                    <th>Target [Bisa Diedit]</th>
                                    <th>Actual / Sales [Input Toko]</th>
                                    <th>Achieve (%) [Otomatis]</th>
                                    <th>On Hand</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="fw-bold">1. Tebus Murah</td>
                                    <td><input type="number" class="form-control form-control-sm target-input" id="tmTarget" value="20" oninput="calculateFokus()"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="tmSales" value="29" oninput="calculateFokus()"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm auto-calc" id="tmAcv" readonly></td>
                                    <td><input type="text" class="form-control form-control-sm" id="tmOh" value="-" oninput="autoSaveState()"></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">2. Serba Gratis</td>
                                    <td><input type="number" class="form-control form-control-sm target-input" id="sgTarget" value="13" oninput="calculateFokus()"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="sgSales" value="12" oninput="calculateFokus()"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm auto-calc" id="sgAcv" readonly></td>
                                    <td><input type="text" class="form-control form-control-sm" id="sgOh" value="-" oninput="autoSaveState()"></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">3. Suuegeer</td>
                                    <td><input type="number" class="form-control form-control-sm target-input" id="suTarget" value="48" oninput="calculateFokus()"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="suSales" value="17" oninput="calculateFokus()"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm auto-calc" id="suAcv" readonly></td>
                                    <td><input type="text" class="form-control form-control-sm" id="suOh" value="-" oninput="autoSaveState()"></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">4. Promo Ceban</td>
                                    <td><input type="number" class="form-control form-control-sm target-input" id="pcTarget" value="213" oninput="calculateFokus()"></td>
                                    <td><input type="number" class="form-control form-control-sm" id="pcSales" value="0" oninput="calculateFokus()"></td>
                                    <td><input type="number" step="0.01" class="form-control form-control-sm auto-calc" id="pcAcv" readonly></td>
                                    <td><input type="text" class="form-control form-control-sm" id="pcOh" value="-" oninput="autoSaveState()"></td>
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
                            <input type="number" class="form-control" id="newMember" value="0" oninput="autoSaveState()">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Kontribusi Struk Member (Total Struk / Struk Member / %)</label>
                            <input type="text" class="form-control" id="strukMember" value="Total struk = 118 / 213 / 55%" oninput="autoSaveState()">
                        </div>
                    </div>
                </div>
            </div>

            <!-- PSM -->
            <div class="card">
                <div class="card-header bg-light text-primary d-flex justify-content-between align-items-center">
                    <span><i class="fas fa-boxes me-2"></i>PSM (Target & Nama Produk Bisa Diedit, Ada 1 Baris Kosong Tambahan)</span>
                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="addPsmRow()"><i class="fas fa-plus me-1"></i> Tambah Item PSM</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm align-middle" id="psmTable">
                            <thead class="table-light text-center">
                                <tr>
                                    <th>Produk PSM [Nama Dapat Diedit]</th>
                                    <th>Target [Bisa Diedit]</th>
                                    <th>Actual [Input Toko]</th>
                                    <th>Achieve (%) [Otomatis]</th>
                                    <th style="width: 50px;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="psmBody">
                                <!-- Populated dynamically -->
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
                                <input type="number" class="form-control" id="catToys" value="0" oninput="autoSaveState()">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">2. HBPL (NS)</label>
                                <input type="number" class="form-control" id="catHbpl" value="0" oninput="autoSaveState()">
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
                                <input type="number" class="form-control" id="feeBase" value="250000" oninput="autoSaveState()">
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
        const defaultPsmItems = [
            { name: "Bango", target: 105, actual: 1 },
            { name: "Daia", target: 45, actual: 1 },
            { name: "Enaak", target: 28, actual: 0 },
            { name: "Garnier", target: 14, actual: 4 },
            { name: "Le Mineral", target: 171, actual: 4 },
            { name: "Lifebuoy", target: 28, actual: 0 },
            { name: "Nipis Madu", target: 96, actual: 3 },
            { name: "Taro", target: 62, actual: 6 },
            { name: "", target: 0, actual: 0 } // Extra 1 blank row for additional PSM item
        ];

        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('periode').valueAsDate = new Date();
            const savedUrl = localStorage.getItem('gas_url');
            if(savedUrl) {
                document.getElementById('gasUrlInput').value = savedUrl;
                document.getElementById('syncStatus').innerHTML = '<i class="fas fa-cloud text-success me-1"></i> Mode: Terhubung ke GAS';
            }
            loadSavedData();
            updateTimeFactor();
        });

        function updateTimeFactor() {
            const dateVal = document.getElementById('periode').value;
            if(!dateVal) return;
            const d = new Date(dateVal);
            const day = d.getDate();
            const year = d.getFullYear();
            const month = d.getMonth();
            const totalDays = new Date(year, month + 1, 0).getDate();
            const tf = (day / totalDays) * 100;
            document.getElementById('timeFactor').value = tf.toFixed(2);
            calculateRevenue();
        }

        function calculateRevenue() {
            const targetMtd = parseFloat(document.getElementById('targetMtd').value) || 0;
            const actualSales = parseFloat(document.getElementById('actualSales').value) || 0;
            const tf = parseFloat(document.getElementById('timeFactor').value) || 0;

            const targetTf = (targetMtd * tf) / 100;
            const achieveMtd = targetMtd > 0 ? (actualSales / targetMtd) * 100 : 0;
            const achieveTf = targetTf > 0 ? (actualSales / targetTf) * 100 : 0;
            const gapT = targetMtd - actualSales;
            const gapTf = targetTf - actualSales;

            document.getElementById('targetTimeFactor').value = Math.round(targetTf);
            document.getElementById('achieveMtd').value = achieveMtd.toFixed(2);
            document.getElementById('achieveTimeFactor').value = achieveTf.toFixed(2);
            document.getElementById('gapTarget').value = Math.round(gapT);
            document.getElementById('gapTimeFactor').value = Math.round(gapTf);

            autoSaveState();
        }

        function calculateFokus() {
            ['tm', 'sg', 'su', 'pc'].forEach(prefix => {
                const t = parseFloat(document.getElementById(prefix + 'Target').value) || 0;
                const s = parseFloat(document.getElementById(prefix + 'Sales').value) || 0;
                const acv = t > 0 ? (s / t) * 100 : 0;
                document.getElementById(prefix + 'Acv').value = acv.toFixed(2);
            });
            autoSaveState();
        }

        function calculatePsmRow(inputElem) {
            const row = inputElem.closest('tr');
            const t = parseFloat(row.querySelector('.psm-t').value) || 0;
            const a = parseFloat(row.querySelector('.psm-a').value) || 0;
            const p = t > 0 ? (a / t) * 100 : 0;
            row.querySelector('.psm-p').value = p.toFixed(2);
            autoSaveState();
        }

        function renderPsmTable(savedPsmData) {
            const psmBody = document.getElementById('psmBody');
            psmBody.innerHTML = '';
            const items = (savedPsmData && savedPsmData.length > 0) ? savedPsmData : defaultPsmItems;
            
            items.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="text" class="form-control form-control-sm psm-name" value="${item.name !== undefined ? item.name : ''}" placeholder="Nama Produk PSM" oninput="autoSaveState()"></td>
                    <td><input type="number" class="form-control form-control-sm psm-t" value="${item.target !== undefined ? item.target : 0}" oninput="calculatePsmRow(this)"></td>
                    <td><input type="number" class="form-control form-control-sm psm-a" value="${item.actual !== undefined ? item.actual : 0}" oninput="calculatePsmRow(this)"></td>
                    <td><input type="number" step="0.01" class="form-control form-control-sm auto-calc psm-p" value="0" readonly></td>
                    <td class="text-center"><button type="button" class="btn btn-outline-danger btn-sm" onclick="removePsmRow(this)"><i class="fas fa-trash"></i></button></td>
                `;
                psmBody.appendChild(tr);
                const tInput = tr.querySelector('.psm-t');
                calculatePsmRow(tInput);
            });
        }

        function addPsmRow() {
            const psmBody = document.getElementById('psmBody');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" class="form-control form-control-sm psm-name" value="" placeholder="Nama Produk PSM Baru" oninput="autoSaveState()"></td>
                <td><input type="number" class="form-control form-control-sm psm-t" value="0" oninput="calculatePsmRow(this)"></td>
                <td><input type="number" class="form-control form-control-sm psm-a" value="0" oninput="calculatePsmRow(this)"></td>
                <td><input type="number" step="0.01" class="form-control form-control-sm auto-calc psm-p" value="0" readonly></td>
                <td class="text-center"><button type="button" class="btn btn-outline-danger btn-sm" onclick="removePsmRow(this)"><i class="fas fa-trash"></i></button></td>
            `;
            psmBody.appendChild(tr);
            autoSaveState();
        }

        function removePsmRow(btn) {
            const tr = btn.closest('tr');
            tr.remove();
            autoSaveState();
        }

        function onDateOrStoreChange() {
            updateTimeFactor();
            loadSavedData();
        }

        function getStorageKey() {
            const store = document.getElementById('storeCodeName').value || 'general';
            return 'sales_app_state_v2_' + store;
        }

        function autoSaveState() {
            const store = document.getElementById('storeCodeName').value;
            if(!store) return;

            const psmRows = [];
            document.querySelectorAll('#psmBody tr').forEach(tr => {
                psmRows.push({
                    name: tr.querySelector('.psm-name').value,
                    target: tr.querySelector('.psm-t').value,
                    actual: tr.querySelector('.psm-a').value
                });
            });

            const state = {
                periode: document.getElementById('periode').value,
                wh: document.getElementById('wh').value,
                am: document.getElementById('am').value,
                ac: document.getElementById('ac').value,
                shift: document.getElementById('shift').value,
                targetMtd: document.getElementById('targetMtd').value,
                actualSales: document.getElementById('actualSales').value,
                tmTarget: document.getElementById('tmTarget').value,
                tmSales: document.getElementById('tmSales').value,
                sgTarget: document.getElementById('sgTarget').value,
                sgSales: document.getElementById('sgSales').value,
                suTarget: document.getElementById('suTarget').value,
                suSales: document.getElementById('suSales').value,
                pcTarget: document.getElementById('pcTarget').value,
                pcSales: document.getElementById('pcSales').value,
                newMember: document.getElementById('newMember').value,
                strukMember: document.getElementById('strukMember').value,
                catToys: document.getElementById('catToys').value,
                catHbpl: document.getElementById('catHbpl').value,
                feeBase: document.getElementById('feeBase').value,
                psmItems: psmRows
            };

            localStorage.setItem(getStorageKey(), JSON.stringify(state));
        }

        function loadSavedData() {
            const storeSelect = document.getElementById('storeCodeName');
            if(!storeSelect.value) {
                renderPsmTable(defaultPsmItems);
                return;
            }

            const saved = localStorage.getItem(getStorageKey());
            if(saved) {
                try {
                    const data = JSON.parse(saved);
                    if(data.targetMtd) document.getElementById('targetMtd').value = data.targetMtd;
                    if(data.actualSales !== undefined) document.getElementById('actualSales').value = data.actualSales;
                    if(data.tmTarget) document.getElementById('tmTarget').value = data.tmTarget;
                    if(data.tmSales !== undefined) document.getElementById('tmSales').value = data.tmSales;
                    if(data.sgTarget) document.getElementById('sgTarget').value = data.sgTarget;
                    if(data.sgSales !== undefined) document.getElementById('sgSales').value = data.sgSales;
                    if(data.suTarget) document.getElementById('suTarget').value = data.suTarget;
                    if(data.suSales !== undefined) document.getElementById('suSales').value = data.suSales;
                    if(data.pcTarget) document.getElementById('pcTarget').value = data.pcTarget;
                    if(data.pcSales !== undefined) document.getElementById('pcSales').value = data.pcSales;
                    if(data.newMember !== undefined) document.getElementById('newMember').value = data.newMember;
                    if(data.strukMember) document.getElementById('strukMember').value = data.strukMember;
                    if(data.catToys !== undefined) document.getElementById('catToys').value = data.catToys;
                    if(data.catHbpl !== undefined) document.getElementById('catHbpl').value = data.catHbpl;
                    if(data.feeBase !== undefined) document.getElementById('feeBase').value = data.feeBase;
                    
                    renderPsmTable(data.psmItems);
                } catch(e) {
                    console.error(e);
                    renderPsmTable(defaultPsmItems);
                }
            } else {
                renderPsmTable(defaultPsmItems);
            }
            calculateRevenue();
            calculateFokus();
        }

        function saveGasUrl() {
            const url = document.getElementById('gasUrlInput').value.trim();
            localStorage.setItem('gas_url', url);
            document.getElementById('syncStatus').innerHTML = '<i class="fas fa-cloud text-success me-1"></i> Mode: Terhubung ke GAS';
            bootstrap.Modal.getInstance(document.getElementById('configModal')).hide();
            alert('URL Google Apps Script berhasil disimpan!');
        }

        function resetForm() {
            if(confirm('Reset input actual toko ini?')) {
                document.getElementById('actualSales').value = '';
                document.getElementById('tmSales').value = '';
                document.getElementById('sgSales').value = '';
                document.getElementById('suSales').value = '';
                document.getElementById('pcSales').value = '';
                document.querySelectorAll('.psm-a').forEach(inp => inp.value = '');
                autoSaveState();
                calculateRevenue();
                calculateFokus();
                alert('Form actual berhasil di-reset.');
            }
        }

        function saveReport() {
            const store = document.getElementById('storeCodeName').value;
            if(!store) {
                alert('Silakan pilih Kode & Nama Toko terlebih dahulu!');
                document.getElementById('storeCodeName').focus();
                return;
            }

            autoSaveState();

            const psmData = [];
            document.querySelectorAll('#psmBody tr').forEach(tr => {
                psmData.push({
                    name: tr.querySelector('.psm-name').value,
                    target: tr.querySelector('.psm-t').value,
                    actual: tr.querySelector('.psm-a').value,
                    achieve: tr.querySelector('.psm-p').value
                });
            });

            const formData = {
                periode: document.getElementById('periode').value,
                wh: document.getElementById('wh').value,
                am: document.getElementById('am').value,
                ac: document.getElementById('ac').value,
                storeCodeName: store,
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
                psm: psmData,
                category: {
                    toys: document.getElementById('catToys').value,
                    hbpl: document.getElementById('catHbpl').value
                },
                feeBase: document.getElementById('feeBase').value,
                timestamp: new Date().toISOString()
            };

            const gasUrl = localStorage.getItem('gas_url');
            if(gasUrl) {
                fetch(gasUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }).then(() => {
                    alert('Laporan berhasil disimpan dan dikirim ke Google Sheets secara online!');
                }).catch(err => {
                    console.error(err);
                    alert('Tersimpan di perangkat (Gagal sync online ke GAS, periksa koneksi/URL).');
                });
            } else {
                alert('Laporan berhasil disimpan di perangkat! (Atur Google Apps Script URL di tombol atas untuk sync otomatis ke Google Sheets).');
            }
        }
    </script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(updated_html_content)

print("Regenerated index.html successfully with strict requirements.")
