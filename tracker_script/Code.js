const TIMEZONE = 'Asia/Kolkata';

/**
 * Creates custom spreadsheet menu on open
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Bullion Tracker')
    .addItem('Fetch Rates Now (India + Forex)', 'fetchAndLogIndianBullionRates')
    .addItem('Install Daily 8 PM IST Trigger', 'setupDailyTrigger')
    .addToUi();
}

/**
 * Ensures header row has all 15 columns without overwriting existing titles
 */
function ensureHeaders_(sheet) {
  const expectedHeaders = [
    'Date',
    'Gold Rate ₹/10g',
    'Gold Change ₹',
    'Gold Change %',
    'Silver Rate ₹/10g',
    'Silver Change ₹',
    'Silver Change %',
    'Source',
    'Last Updated',
    'Spot Gold XAU ($/oz)',
    'Spot Silver XAG ($/oz)',
    'USD/INR Rate',
    'Intl Gold (₹/10g)',
    'Intl Silver (₹/10g)',
    'Gold 22K Rate ₹/10g'
  ];

  const currentValues = sheet.getRange(1, 1, 1, expectedHeaders.length).getValues()[0];
  const needsHeader = currentValues.some((v, idx) => !v && idx >= 9);

  if (needsHeader || !currentValues[0] || !currentValues[14]) {
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    // Format header style
    sheet.getRange(1, 1, 1, expectedHeaders.length)
      .setFontWeight('bold')
      .setBackground('#1E293B')
      .setFontColor('#F8FAFC');
  }
}

/**
 * Main routine: fetches Indian domestic rates AND real-time Forex, then logs to Daily History
 */
function fetchAndLogIndianBullionRates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const historySheet = ss.getSheetByName('Daily History');
  const settingsSheet = ss.getSheetByName('Settings');

  if (!historySheet) {
    throw new Error('Daily History sheet not found in workbook.');
  }

  // Ensure headers are set
  ensureHeaders_(historySheet);

  try {
    // 1. Fetch Indian domestic rates strictly from IBJA PM benchmarks
    const indianRates = fetchIndianRatesWithRetry_(3);
    if (!indianRates || indianRates.isClosed) {
      const reason = (indianRates && indianRates.reason) || 'Official IBJA PM rates unavailable or market closed / holiday';
      if (settingsSheet) {
        settingsSheet.getRange('B12').setValue(
          'SKIPPED — ' + reason + ' (' + Utilities.formatDate(new Date(), TIMEZONE, 'dd-mmm-yyyy HH:mm') + ' IST)'
        );
      }
      Logger.log('Market update skipped: ' + reason);
      return;
    }

    if (!indianRates.gold24kPer10g || !indianRates.silverPer10g || indianRates.gold24kPer10g <= 0 || indianRates.silverPer10g <= 0) {
      throw new Error('Invalid or zero Indian domestic rates returned from IBJA.');
    }

    // 2. Fetch Forex rates (COMEX XAU, XAG, USDINR)
    const forex = fetchForexRates_();

    // 3. Compute international converted prices in INR per 10g
    // 1 Troy Ounce = 31.1034768 grams
    let intlGoldInrPer10g = null;
    let intlSilverInrPer10g = null;
    if (forex.xauUsd && forex.usdInr) {
      intlGoldInrPer10g = Math.round(((forex.xauUsd * forex.usdInr * 10) / 31.1034768) * 100) / 100;
    }
    if (forex.xagUsd && forex.usdInr) {
      intlSilverInrPer10g = Math.round(((forex.xagUsd * forex.usdInr * 10) / 31.1034768) * 100) / 100;
    }

    const now = new Date();
    const todayStr = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd');
    const lastRow = findLastDateRow_(historySheet);

    let targetRow = lastRow + 1;
    let isSameDayUpdate = false;

    if (lastRow >= 2) {
      const lastDateVal = historySheet.getRange(lastRow, 1).getValue();
      if (lastDateVal instanceof Date && Utilities.formatDate(lastDateVal, TIMEZONE, 'yyyy-MM-dd') === todayStr) {
        targetRow = lastRow;
        isSameDayUpdate = true;
      }
    }

    // Find the immediately preceding valid session PM rate (skipping any holiday/empty rows)
    let prevGold = null;
    let prevSilver = null;
    const startSearchRow = isSameDayUpdate ? targetRow - 1 : lastRow;
    for (let r = startSearchRow; r >= 2; r--) {
      const gVal = Number(historySheet.getRange(r, 2).getValue());
      const sVal = Number(historySheet.getRange(r, 5).getValue());
      if (gVal > 0 && sVal > 0) {
        prevGold = gVal;
        prevSilver = sVal;
        break;
      }
    }

    const goldChangeRs = prevGold ? indianRates.gold24kPer10g - prevGold : 0;
    const goldChangePct = prevGold ? (goldChangeRs / prevGold) : 0;
    const silverChangeRs = prevSilver ? indianRates.silverPer10g - prevSilver : 0;
    const silverChangePct = prevSilver ? (silverChangeRs / prevSilver) : 0;

    const dateOnly = new Date(Utilities.formatDate(now, TIMEZONE, 'yyyy/MM/dd'));

    // Write all 15 columns
    historySheet.getRange(targetRow, 1, 1, 15).setValues([[
      dateOnly,
      indianRates.gold24kPer10g,
      goldChangeRs,
      goldChangePct,
      indianRates.silverPer10g,
      silverChangeRs,
      silverChangePct,
      indianRates.source,
      now,
      forex.xauUsd || '',
      forex.xagUsd || '',
      forex.usdInr || '',
      intlGoldInrPer10g || '',
      intlSilverInrPer10g || '',
      indianRates.gold22kPer10g || ''
    ]]);

    if (settingsSheet) {
      settingsSheet.getRange('B12').setValue(
        'OK — Last run succeeded (' + Utilities.formatDate(now, TIMEZONE, 'dd-mmm-yyyy HH:mm') + ' IST)'
      );
    }
    Logger.log('Success: India Gold 24K=' + indianRates.gold24kPer10g + ', Gold 22K=' + indianRates.gold22kPer10g + ', Silver=' + indianRates.silverPer10g + ' | Forex XAU=' + forex.xauUsd + ', XAG=' + forex.xagUsd + ', USDINR=' + forex.usdInr);
  } catch (err) {
    if (settingsSheet) {
      settingsSheet.getRange('B12').setValue('ERROR: ' + err.message);
    }
    Logger.log('Error: ' + err.message);
    throw err;
  }
}

/**
 * Fetches real-time Forex rates for Spot Gold (XAU), Spot Silver (XAG), and USD/INR
 */
function fetchForexRates_() {
  const fetchOptions = {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  let xauUsd = null;
  let xagUsd = null;
  let usdInr = null;

  // 1. Fetch COMEX Gold Futures/Spot (GC=F)
  try {
    const resGold = UrlFetchApp.fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1d', fetchOptions);
    if (resGold.getResponseCode() === 200) {
      const jg = JSON.parse(resGold.getContentText());
      if (jg.chart && jg.chart.result && jg.chart.result[0] && jg.chart.result[0].meta) {
        xauUsd = jg.chart.result[0].meta.regularMarketPrice;
      }
    }
  } catch (e) {
    Logger.log('Forex Gold fetch attempt failed: ' + e.message);
  }

  // 2. Fetch COMEX Silver Futures/Spot (SI=F)
  try {
    const resSilv = UrlFetchApp.fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=1d', fetchOptions);
    if (resSilv.getResponseCode() === 200) {
      const js = JSON.parse(resSilv.getContentText());
      if (js.chart && js.chart.result && js.chart.result[0] && js.chart.result[0].meta) {
        xagUsd = js.chart.result[0].meta.regularMarketPrice;
      }
    }
  } catch (e) {
    Logger.log('Forex Silver fetch attempt failed: ' + e.message);
  }

  // 3. Fetch USD/INR Currency Exchange Rate (INR=X)
  try {
    const resInr = UrlFetchApp.fetch('https://query1.finance.yahoo.com/v8/finance/chart/INR=X?interval=1d&range=1d', fetchOptions);
    if (resInr.getResponseCode() === 200) {
      const ji = JSON.parse(resInr.getContentText());
      if (ji.chart && ji.chart.result && ji.chart.result[0] && ji.chart.result[0].meta) {
        usdInr = ji.chart.result[0].meta.regularMarketPrice;
      }
    }
  } catch (e) {
    Logger.log('USDINR fetch attempt failed: ' + e.message);
  }

  // Fallback for USD/INR if Yahoo fails
  if (!usdInr) {
    try {
      const resFx = UrlFetchApp.fetch('https://open.er-api.com/v6/latest/USD', fetchOptions);
      if (resFx.getResponseCode() === 200) {
        const jf = JSON.parse(resFx.getContentText());
        if (jf.rates && jf.rates.INR) {
          usdInr = jf.rates.INR;
        }
      }
    } catch (e) {
      Logger.log('USDINR fallback fetch failed: ' + e.message);
    }
  }

  return {
    xauUsd: xauUsd,
    xagUsd: xagUsd,
    usdInr: usdInr
  };
}

/**
 * Scrapes domestic Indian IBJA rates strictly from official IBJA (ibjarates.com).
 * Zero synthetic calculations. Zero AM substitution for PM. Zero fallback to retail markup sources.
 */
function fetchIndianRatesWithRetry_(maxRetries) {
  const fetchOptions = {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const resp = UrlFetchApp.fetch('https://www.ibjarates.com/', fetchOptions);
      if (resp.getResponseCode() === 200) {
        const html = resp.getContentText();
        
        // Strict official IBJA PM closing rate labels only (no AM substitution)
        const goldMatch = html.match(/id=["']lblGold999_PM["'][^>]*>([\d,]+(?:\.\d+)?)/i);
        const gold22Match = html.match(/id=["']lblGold916_PM["'][^>]*>([\d,]+(?:\.\d+)?)/i);
        const silverMatch = html.match(/id=["']lblSilver999_PM["'][^>]*>([\d,]+(?:\.\d+)?)/i);

        if (goldMatch && silverMatch) {
          const gold24kPer10g = parseFloat(goldMatch[1].replace(/,/g, ''));
          const silverPerKg = parseFloat(silverMatch[1].replace(/,/g, ''));
          const gold22kPer10g = gold22Match ? parseFloat(gold22Match[1].replace(/,/g, '')) : null;

          if (gold24kPer10g > 0 && silverPerKg > 0) {
            return {
              gold24kPer10g: gold24kPer10g,
              gold22kPer10g: gold22kPer10g,
              silverPer10g: Math.round((silverPerKg / 100) * 100) / 100,
              silverPerKg: silverPerKg,
              source: 'IBJA (ibjarates.com)'
            };
          }
        } else {
          Logger.log('IBJA attempt ' + attempt + ': Official PM rate labels not published (market closed, holiday, or before PM release).');
        }
      }
    } catch (e) {
      Logger.log('IBJA attempt ' + attempt + ' failed: ' + e.message);
    }

    if (attempt < maxRetries) Utilities.sleep(2000 * attempt);
  }

  // If IBJA PM rate is not published, do NOT fetch third-party retail markups.
  return {
    isClosed: true,
    reason: 'Official IBJA PM rates unavailable or market closed / holiday'
  };
}

/**
 * Finds the last occupied row in Column A
 */
function findLastDateRow_(sheet) {
  const vals = sheet.getRange('A1:A' + sheet.getMaxRows()).getValues();
  for (let i = vals.length - 1; i >= 1; i--) {
    if (vals[i][0] !== '' && vals[i][0] !== null) return i + 1;
  }
  return 1;
}

/**
 * Installs daily automated trigger at 8:00 PM IST
 */
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'fetchAndLogIndianBullionRates') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('fetchAndLogIndianBullionRates')
    .timeBased()
    .atHour(20)
    .everyDays(1)
    .inTimezone(TIMEZONE)
    .create();
}

/**
 * Web App GET endpoint: returns clean public JSON array of daily history
 * Consumed directly by https://folio-84-prod.web.app/market
 */
function doGet(e) {
  try {
    // Optional on-demand refresh trigger via web app
    if (e && e.parameter && (e.parameter.action === 'run' || e.parameter.action === 'refresh' || e.parameter.refresh === '1')) {
      try {
        fetchAndLogIndianBullionRates();
      } catch (triggerErr) {
        Logger.log('On-demand trigger note: ' + triggerErr.message);
      }
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Daily History');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Daily History sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const values = sheet.getDataRange().getValues();
    const records = [];

    function num(v) {
      if (v === '' || v === null || v === undefined) return null;
      if (typeof v === 'number') return v;
      const n = parseFloat(String(v).replace(/[₹,%\s]/g, '').replace(/,/g, ''));
      return isNaN(n) ? null : n;
    }

    // Row 0 is header row
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[0]) continue;

      let dateObj = row[0] instanceof Date ? row[0] : new Date(row[0]);
      if (isNaN(dateObj.getTime())) continue;
      const iso = Utilities.formatDate(dateObj, TIMEZONE, 'yyyy-MM-dd');

      const updated = row[8];
      const updatedStr = updated instanceof Date
        ? Utilities.formatDate(updated, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
        : String(updated || '');

      records.push({
        date: iso,
        goldRatePer10g: num(row[1]),
        gold22kRatePer10g: num(row[14]) || null,
        goldChangeRs: num(row[2]),
        goldChangePct: num(row[3]),
        silverRatePer10g: num(row[4]),
        silverChangeRs: num(row[5]),
        silverChangePct: num(row[6]),
        dataSource: String(row[7] || 'IBJA (ibjarates.com)'),
        lastUpdated: updatedStr,
        xauUsd: num(row[9]),
        xagUsd: num(row[10]),
        usdInr: num(row[11]),
        intlGoldPer10g: num(row[12]),
        intlSilverPer10g: num(row[13])
      });
    }

    // Deduplicate by date, keeping the latest occurrence, then sort oldest first
    const byDate = {};
    records.forEach(r => { byDate[r.date] = r; });
    let out = Object.keys(byDate).sort().map(d => byDate[d]);

    if (e && e.parameter) {
      if (e.parameter.since) {
        const sinceDate = e.parameter.since;
        out = out.filter(r => r.date >= sinceDate);
      }
      if (e.parameter.limit) {
        const lim = parseInt(e.parameter.limit, 10);
        if (!isNaN(lim) && lim > 0 && out.length > lim) {
          out = out.slice(-lim);
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify(out))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles HTTP POST requests for bulk inserting historical data
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'No post data' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Daily History');
    if (!sheet) {
      sheet = ss.insertSheet('Daily History');
    }
    ensureHeaders_(sheet);

    if (payload.action === 'bulkInsert') {
      const incomingRows = payload.rows; // Array of row arrays
      if (!Array.isArray(incomingRows) || incomingRows.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({ error: 'Empty rows array' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      const colCount = incomingRows[0].length;

      if (payload.replaceAll) {
        // Clear all existing rows except headers
        if (sheet.getLastRow() > 1) {
          sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
        }

        // Batch write in chunks of 2,000
        const chunkSize = 2000;
        let startRow = 2;
        for (let i = 0; i < incomingRows.length; i += chunkSize) {
          const chunk = incomingRows.slice(i, i + chunkSize);
          sheet.getRange(startRow, 1, chunk.length, colCount).setValues(chunk);
          startRow += chunk.length;
        }

        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          mode: 'replaceAll',
          totalInserted: incomingRows.length,
          startDate: incomingRows[0][0],
          endDate: incomingRows[incomingRows.length - 1][0]
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        // Append mode
        const chunkSize = 2000;
        let startRow = sheet.getLastRow() + 1;
        for (let i = 0; i < incomingRows.length; i += chunkSize) {
          const chunk = incomingRows.slice(i, i + chunkSize);
          sheet.getRange(startRow, 1, chunk.length, colCount).setValues(chunk);
          startRow += chunk.length;
        }

        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          mode: 'append',
          totalInserted: incomingRows.length
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Unsupported action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
