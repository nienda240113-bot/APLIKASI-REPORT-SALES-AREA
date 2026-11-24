/**
 * DAILY SALES REPORT -> GOOGLE SHEETS TDP NOVEMBER 2026
 * Tempel seluruh kode ini di Extensions > Apps Script pada spreadsheet TDP.
 * Deploy sebagai Web app: Execute as Me, Who has access Anyone.
 */
const CFG = {
  SPREADSHEET_ID: "1kHcuWpHAulQCFtYaRGvT0MrnfKRSGnmEwvJu6fY9jBs",
  DEST_SHEET: "REVENUE",
  LOG_SHEET: "_DAILY_REPORT_SYNC",
  FIRST_STORE_ROW: 9,
  LAST_STORE_ROW: 28,
  STORE_CODE_COL: 1,
  FIRST_DAY_TARGET_COL: 12, // L
  DAY_BLOCK_WIDTH: 13,
  ALLOWED_MONTH: "2026-11"
};

function doGet() {
  return ContentService.createTextOutput("Daily Report sync is ready.");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const date = String(payload.date || "");
    const storeCode = String(payload.store_code || "").trim().toUpperCase();
    const shift = String(payload.shift || "").trim();
    const sales = Number(payload.actualSales);
    const receipts = Number(payload.totalStruk);
    const gm = parsePercent_(payload.gmPercent);

    if (!/^2026-11-\\d{2}$/.test(date)) throw new Error("Tanggal harus November 2026.");
    const day = Number(date.slice(8, 10));
    if (day < 1 || day > 30) throw new Error("Tanggal tidak valid.");
    if (!storeCode) throw new Error("Kode toko kosong.");
    if (!["Shift 1", "Shift 2"].includes(shift)) throw new Error("Shift tidak valid.");
    if (!Number.isFinite(sales) || sales < 0) throw new Error("Actual Sales tidak valid.");
    if (!Number.isFinite(receipts) || receipts < 0) throw new Error("Total struk tidak valid.");
    if (gm === null || gm < 0 || gm > 100) throw new Error("GM% harus diisi antara 0 sampai 100.");

    const ss = SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CFG.DEST_SHEET);
    if (!sheet) throw new Error("Tab REVENUE tidak ditemukan.");

    const codes = sheet.getRange(CFG.FIRST_STORE_ROW, CFG.STORE_CODE_COL,
      CFG.LAST_STORE_ROW - CFG.FIRST_STORE_ROW + 1, 1).getDisplayValues().flat();
    const rowIndex = codes.findIndex(v => String(v).trim().toUpperCase() === storeCode);
    if (rowIndex < 0) throw new Error("Kode toko " + storeCode + " tidak ditemukan di REVENUE.");
    const destinationRow = CFG.FIRST_STORE_ROW + rowIndex;

    const log = getLogSheet_(ss);
    const records = log.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < records.length; i++) {
      if (String(records[i][0]) === date &&
          String(records[i][1]).toUpperCase() === storeCode &&
          String(records[i][2]) === shift) {
        foundRow = i + 1;
        break;
      }
    }
    const entry = [date, storeCode, shift, sales, receipts, gm, new Date()];
    if (foundRow > 0) log.getRange(foundRow, 1, 1, entry.length).setValues([entry]);
    else log.appendRow(entry);

    const all = log.getDataRange().getValues().slice(1).filter(r =>
      String(r[0]) === date && String(r[1]).toUpperCase() === storeCode);
    const totalSales = all.reduce((sum, r) => sum + (Number(r[3]) || 0), 0);
    const totalReceipts = all.reduce((sum, r) => sum + (Number(r[4]) || 0), 0);
    const gmRows = all.filter(r => r[5] !== "" && r[5] !== null && Number.isFinite(Number(r[5])));
    const gmWeight = gmRows.reduce((sum, r) => sum + (Number(r[3]) || 0), 0);
    const weightedGm = gmWeight > 0
      ? gmRows.reduce((sum, r) => sum + (Number(r[3]) || 0) * Number(r[5]), 0) / gmWeight
      : "";

    const targetCol = CFG.FIRST_DAY_TARGET_COL + (day - 1) * CFG.DAY_BLOCK_WIDTH;
    // Hari pertama memiliki satu kolom pemisah setelah SPD (P, R, S, T).
    // Hari ke-2 dan seterusnya memakai empat kolom ACTUAL berurutan.
    const offsets = day === 1
      ? { spd: 4, std: 6, apc: 7, gm: 8 }
      : { spd: 4, std: 5, apc: 6, gm: 7 };
    sheet.getRange(destinationRow, targetCol + offsets.spd).setValue(totalSales);
    sheet.getRange(destinationRow, targetCol + offsets.std).setValue(totalReceipts);
    sheet.getRange(destinationRow, targetCol + offsets.apc)
      .setValue(totalReceipts > 0 ? totalSales / totalReceipts : 0);
    if (weightedGm !== "") {
      sheet.getRange(destinationRow, targetCol + offsets.gm).setValue(weightedGm);
    }
    SpreadsheetApp.flush();
    return json_({ ok: true, date, store_code: storeCode, row: destinationRow,
      actual_spd: totalSales, actual_std: totalReceipts,
      actual_apc: totalReceipts > 0 ? totalSales / totalReceipts : 0,
      actual_gm: weightedGm });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function getLogSheet_(ss) {
  let sh = ss.getSheetByName(CFG.LOG_SHEET);
  if (!sh) {
    sh = ss.insertSheet(CFG.LOG_SHEET);
    sh.appendRow(["date", "store_code", "shift", "actual_sales", "total_receipts", "gm_percent", "updated_at"]);
    sh.hideSheet();
  }
  return sh;
}

function parsePercent_(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const n = Number(String(value).replace("%", "").replace(",", ".").trim());
  return Number.isFinite(n) ? n : null;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
