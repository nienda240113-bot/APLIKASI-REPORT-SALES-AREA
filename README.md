<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report Portal V2 (Cloud Sync Active)</title>
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
        #loadingStatus { font-size: 13px; color: #d9534f; font-weight: bold; margin-top: 5px; background: #fff3f3; padding: 5px; border-radius: 4px; display: inline-block; }
    </style>
</head>
<body>

<div class="container">
    <h2>Daily Sales Report Portal V2</h2>
    <p style="color: #666; font-size: 13px;">Mode: Cloud Server Multi-Device Sync Active</p>
    <div id="loadingStatus"></div>

    <!-- INFORMASI UMUM TOKO -->
    <h3>Informasi Umum Toko</h3>
    <div class="form-group">
        <label>Periode Tanggal (Otomatis Sesuai Device)</label>
        <input type="date" id="datePicker">
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
        <input type="number" id="targetM
