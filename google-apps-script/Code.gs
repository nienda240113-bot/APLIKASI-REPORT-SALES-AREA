/**
 * DAILY SALES REPORT -> GOOGLE SHEETS TDP NOVEMBER 2026
 * Tempel seluruh kode ini di Extensions > Apps Script pada spreadsheet TDP.
 * Deploy sebagai Web app: Execute as Me, Who has access Anyone.
 */
const CFG = {
  MARKETING_SPREADSHEET_ID: "1JHeYvqSJYNw13-nHem5FQpfbSaimM1Ge9d7OgQtt1OE",
  SPREADSHEET_ID: "1kHcuWpHAulQCFtYaRGvT0MrnfKRSGnmEwvJu6fY9jBs",
  DEST_SHEET: "REVENUE",
  LOG_SHEET: "_DAILY_REPORT_SYNC",
  FIRST_STORE_ROW: 9,
  LAST_STORE_ROW: 28,
  STORE_CODE_COL: 1,
  FIRST_DAY_TARGET_COL: 9, // I: awal blok harian pada sheet REVENUE
  DAY_BLOCK_WIDTH: 12,
  ALLOWED_MONTH: "2026-11"
};

function doGet(e) {
  const params = (e && e.parameter) || {};
  const action = String(params.action || "");
  if (action === "health") {
    return json_({ ok: true, version: "2026-11-26-marketing-sync-v1", message: "Apps Script deployment aktif." });
  }
  if (action !== "sync") {
    return ContentService.createTextOutput("Daily Report sync is ready.");
  }
  return processDailyReport_(e);
}

function doPost(e) {
  return processDailyReport_(e);
}

function processDailyReport_(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // Apps Script dapat menerima form-urlencoded (e.parameter) atau JSON (postData.contents).
    const payload = {};
    // Merge Apps Script parameter maps and parse queryString as a fallback.
    if (e && e.parameter) Object.assign(payload, e.parameter);
    if (e && e.parameters) {
      Object.keys(e.parameters).forEach(key => {
        const values = e.parameters[key];
        if (payload[key] === undefined && Array.isArray(values)) payload[key] = values[0];
      });
    }
    if (e && e.queryString) {
      String(e.queryString).split("&").forEach(pair => {
        if (!pair) return;
        const parts = pair.split("=");
        const key = decodeURIComponent((parts.shift() || "").replace(/\\+/g, " "));
        const value = decodeURIComponent(parts.join("=").replace(/\\+/g, " "));
        if (key && payload[key] === undefined) payload[key] = value;
      });
    }
    const body = e && e.postData && e.postData.contents ? String(e.postData.contents).trim() : "";
    if (body) {
      try {
        const bodyPayload = JSON.parse(body);
        if (bodyPayload && typeof bodyPayload === "object") Object.assign(payload, bodyPayload);
      } catch (parseError) {
        // Fallback body application/x-www-form-urlencoded dari browser.
        String(body).split("&").forEach(pair => {
          if (!pair) return;
          const index = pair.indexOf("=");
          const rawKey = index >= 0 ? pair.slice(0, index) : pair;
          const rawValue = index >= 0 ? pair.slice(index + 1) : "";
          const key = decodeURIComponent(rawKey.replace(/\\+/g, " "));
          const value = decodeURIComponent(rawValue.replace(/\\+/g, " "));
          if (key && payload[key] === undefined) payload[key] = value;
        });
        if (!Object.keys(payload).length) {
          throw new Error("Data request tidak terbaca. Periksa body POST dari aplikasi.");
        }
      }
    }
    console.log("Daily Report request method: " + (e && e.postData ? "POST" : "GET"));
    console.log("Daily Report raw queryString: " + String((e && e.queryString) || "(kosong)"));
    console.log("Daily Report request fields: " + Object.keys(payload).join(", "));
    console.log("Daily Report received date: " + String(payload.date || payload.period || "(kosong)"));
    const date = normalizeReportDate_(payload.date || payload.period);
    const storeCode = String(payload.store_code || "").trim().toUpperCase();
    const shift = String(payload.shift || "").trim();
    const sales = Number(payload.actualSales);
    const receipts = Number(payload.totalStruk);
    const gm = parsePercent_(payload.gmPercent);

    if (!/^2026-11-(0[1-9]|[12][0-9]|30)$/.test(date)) throw new Error("Tanggal harus November 2026. Format tanggal diterima: " + String(payload.date || payload.period || "(kosong)"));
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
      if (dateKey_(records[i][0]) === date &&
          String(records[i][1]).trim().toUpperCase() === storeCode &&
          String(records[i][2]).trim() === shift) {
        foundRow = i + 1;
        break;
      }
    }
    const entry = [date, storeCode, shift, sales, receipts, gm, new Date()];
    if (foundRow > 0) log.getRange(foundRow, 1, 1, entry.length).setValues([entry]);
    else log.appendRow(entry);

    // TULIS NILAI SHIFT YANG SEDANG DISIMPAN, TANPA MENJUMLAHKAN SHIFT 1 + SHIFT 2.
    // SPD = Actual Sales shift ini; STD = Total Struk shift ini;
    // APC = Actual Sales / Total Struk; GM% = GM% yang diisi pada aplikasi.
    const targetCol = CFG.FIRST_DAY_TARGET_COL + (day - 1) * CFG.DAY_BLOCK_WIDTH;
    const offsets = day === 1
      ? { spd: 7, std: 9, apc: 10, gm: 11 }
      : { spd: 8, std: 9, apc: 10, gm: 11 };

    const apc = receipts > 0 ? sales / receipts : 0;
    // Kolom ACTUAL: hari 1 = P/R/S/T; hari 2+ = AC/AD/AE/AF,
    // lalu berulang setiap 12 kolom. TARGET dan ACV tidak disentuh.
    const destination = {
      spd: targetCol + offsets.spd,
      std: targetCol + offsets.std,
      apc: targetCol + offsets.apc,
      gm: targetCol + offsets.gm
    };
    console.log("REVENUE write map: row=" + destinationRow +
      ", day=" + day +
      ", SPD=" + sheet.getRange(1, destination.spd).getA1Notation().replace("1", "") +
      ", STD=" + sheet.getRange(1, destination.std).getA1Notation().replace("1", "") +
      ", APC=" + sheet.getRange(1, destination.apc).getA1Notation().replace("1", "") +
      ", GM=" + sheet.getRange(1, destination.gm).getA1Notation().replace("1", ""));
    sheet.getRange(destinationRow, destination.spd).setValue(sales);
    sheet.getRange(destinationRow, destination.std).setValue(receipts);
    sheet.getRange(destinationRow, destination.apc).setValue(apc);
    sheet.getRange(destinationRow, destination.gm).setValue(gm);
    const marketingResult = writeMarketingMonitoring_(payload, date, day, storeCode, shift);
    SpreadsheetApp.flush();
    return json_({ ok: true, date, store_code: storeCode, shift, row: destinationRow,
      actual_spd: sales, actual_std: receipts, actual_apc: apc, actual_gm: gm,
      marketing: marketingResult });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function normalizeReportDate_(value) {
  if (value === null || value === undefined || value === "") return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, "Asia/Jakarta", "yyyy-MM-dd");
  }
  const s = String(value).trim();
  let m = s.match(/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:$|T| )/);
  if (m) return m[1] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[3]).slice(-2);
  m = s.match(/^([0-9]{1,2})[\\/.-]([0-9]{1,2})[\\/.-]([0-9]{4})$/);
  if (m) return m[3] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2);
  return "";
}

function dateKey_(value) {
  if (value === null || value === undefined || value === "") return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, "Asia/Jakarta", "yyyy-MM-dd");
  }
  return normalizeReportDate_(value) || String(value).trim();
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


/** Menulis hanya kolom Shift/Actual; tidak mengubah target, total, atau formula. */
function writeMarketingMonitoring_(payload, date, day, storeCode, shift) {
  const raw = payload.reportData ? JSON.parse(String(payload.reportData)) : {};
  const ss = SpreadsheetApp.openById(CFG.MARKETING_SPREADSHEET_ID);
  const s1 = shift === "Shift 1";
  const shiftCol = s1 ? 1 : 2;
  const result = {};
  const weekStart = day <= 7 ? 1 : day <= 15 ? 8 : day <= 23 ? 16 : 24;
  const periodStart = day <= 15 ? 1 : 16;
  const offset = day - periodStart;
  const focus = Array.isArray(raw.focus) ? raw.focus : [];
  const focusActual = i => Number(focus[i] && focus[i].actual) || 0;

  // PSM: jumlah Actual dari 10 item, masuk ke kolom shift yang dipilih.
  const psmTotal = (Array.isArray(raw.psm) ? raw.psm : [])
    .reduce((n, x) => n + (Number(x && x.actual) || 0), 0);
  const psmHeader = weekStart === 1 ? 5 : weekStart === 8 ? 30 : weekStart === 16 ? 55 : 80;
  const psmData = psmHeader + 1;
  result.PSM = putValue_(ss, "PSM", storeCode, psmData, 20,
    5 + (day - weekStart) * 5 + shiftCol, psmTotal);

  // PWP (Tebus Murah) dan SERBA GRATIS, 5 kolom per hari.
  const periodHeader = periodStart === 1 ? 5 : 30;
  const periodData = periodHeader + 1;
  const dayBase = 5 + offset * 5;
  result.PWP = putValue_(ss, "PWP", storeCode, periodData, 20,
    dayBase + shiftCol, focusActual(0));
  result.SERBA = putValue_(ss, "SERBA ", storeCode, periodData, 20,
    dayBase + shiftCol, focusActual(1));

  // Sueger dan Cemilan Ceban: 9 kolom per tanggal; redeem ada di +1 / +4.
  const specialData = periodStart === 1 ? 7 : 33;
  const specialBase = 3 + offset * 9;
  // SUEGER: Target Sueugeer masuk ke SYARAT, Actual masuk ke REDEEMP.
  // Kolom shift 1: SYARAT +0, REDEEMP +1; shift 2: SYARAT +3, REDEEMP +4.
  result.SUEGER = putPair_(ss, "SUEGER", storeCode, specialData, 20,
    specialBase + (s1 ? 0 : 3), specialBase + (s1 ? 1 : 4),
    Number(focus[2] && focus[2].target) || 0, focusActual(2));
  // Ceban: syarat = Total Struk shift itu; redeem = Actual Promo Ceban.
  result.CEMILAN_CEBAN = putPair_(ss, "CEMILAN CEBAN", storeCode, specialData, 20,
    specialBase + (s1 ? 0 : 3), specialBase + (s1 ? 1 : 4),
    Number(raw.totalReceipts) || 0, focusActual(3));

  // New Member, TOYS, TELUR: shift columns in 5-column daily groups.
  const base = 5 + (day - 1) * 5;
  result.NEW_MEMBER = putValue_(ss, "NEW MEMBER", storeCode, 6, 20,
    base + shiftCol, Number(raw.newMember) || 0);
  result.TOYS = putValue_(ss, "TOYS", storeCode, 6, 20,
    base + shiftCol, Number(raw.toys) || 0);
  result.TELUR = putValue_(ss, "TELUR", storeCode, 6, 20,
    base + shiftCol, Number(raw.eggs) || 0);

  // Kontribusi Member: Shift 1 = D/E; Shift 2 = G/H, lalu setiap 9 kolom.
  const memberBase = 4 + (day - 1) * 9;
  result.CONTRIBUSI_MEMBER = putPair_(ss, "CONTRIBUSI MEMBER", storeCode, 7, 20,
    memberBase + (s1 ? 0 : 3), memberBase + (s1 ? 1 : 4),
    Number(raw.totalReceipts) || 0, Number(raw.memberReceipts) || 0);
  return result;
}

function putValue_(ss, name, code, firstRow, count, col, value) {
  const sh = ss.getSheetByName(name) || (name === "SERBA " ? ss.getSheetByName("SERBA") : null);
  if (!sh) throw new Error("Tab monitoring tidak ditemukan: " + name);
  const row = findMonitoringStoreRow_(sh, code, firstRow, count);
  sh.getRange(row, col).setValue(value);
  const cell = sh.getRange(row, col).getA1Notation();
  console.log(name + " " + cell + " <- " + value);
  return cell;
}

function putPair_(ss, name, code, firstRow, count, col1, col2, value1, value2) {
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error("Tab monitoring tidak ditemukan: " + name);
  const row = findMonitoringStoreRow_(sh, code, firstRow, count);
  sh.getRange(row, col1).setValue(value1);
  sh.getRange(row, col2).setValue(value2);
  const cells = [sh.getRange(row, col1).getA1Notation(), sh.getRange(row, col2).getA1Notation()];
  console.log(name + " " + cells.join("/") + " <- " + value1 + "/" + value2);
  return cells;
}

function findMonitoringStoreRow_(sh, code, firstRow, count) {
  const codes = sh.getRange(firstRow, 1, count, 1).getDisplayValues().flat();
  const i = codes.findIndex(v => String(v).trim().toUpperCase() === String(code).trim().toUpperCase());
  if (i < 0) throw new Error("Kode toko " + code + " tidak ditemukan pada " + sh.getName());
  return firstRow + i;
}
