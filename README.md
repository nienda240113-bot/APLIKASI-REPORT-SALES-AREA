function showTotalSummaryPreview() {
        document.getElementById('modalTitle').innerText = "Rekap Total Toko Melapor";
        document.getElementById('previewText').innerText = "Mengambil data rekap dari server...";
        document.getElementById('waModal').style.display = 'block';

        fetch(`${WEB_APP_URL}?action=getAll`)
            .then(res => res.json())
            .then(records => {
                let totalTargetMTD = 0, totalActualSales = 0, totalNewMember = 0;
                let totalToys = 0, totalTelur = 0, totalFeeBase = 0;
                let storeCount = Array.isArray(records) ? records.length : 0;

                if (Array.isArray(records)) {
                    records.forEach(rec => {
                        let d = rec.reportData || {};
                        totalTargetMTD += parseFloat(d.targetMTD || 0);
                        totalActualSales += parseFloat(d.actualSales || 0);
                        totalNewMember += parseInt(d.actualNewMember || 0);
                        totalToys += parseFloat(d.catToys || 0);
                        totalTelur += parseFloat(d.catTelur || 0);
                        totalFeeBase += parseFloat(d.feeBase || 0);
                    });
                }

                let summary = `*REKAP TOTAL KESELURUHAN (${storeCount} TOKO MELAPOR)*\n`;
                summary += `PERIODE : ${formatPeriodeDate(document.getElementById('datePicker').value)}\n`;
                summary += `WH : Bekasi | AM : SRD | AC : TRIYANTO\n`;
                summary += `======================\n`;
                summary += `• Total Target MTD: Rp ${totalTargetMTD.toLocaleString('id-ID')}\n`;
                summary += `• Total Actual Sales: Rp ${totalActualSales.toLocaleString('id-ID')}\n`;
                summary += `• Total New Member: ${totalNewMember}\n`;
                summary += `• Total Toys (NS): Rp ${totalToys.toLocaleString('id-ID')}\n`;
                summary += `• Total Telur: Rp ${totalTelur.toLocaleString('id-ID')}\n`;
                summary += `• Total Fee Base: Rp ${totalFeeBase.toLocaleString('id-ID')}\n`;
                summary += `======================\n`;
                summary += `*Catatan: Direkap otomatis dari data toko yang sudah masuk.`;

                document.getElementById('previewText').innerText = summary;
            })
            .catch(err => {
                console.error(err);
                document.getElementById('previewText').innerText = "Gagal memuat rekap total dari server. Pastikan koneksi internet stabil.";
            });
    }
