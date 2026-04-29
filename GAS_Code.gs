/**
 * GOOGLE APPS SCRIPT FOR GRADUATION ANNOUNCEMENT SYSTEM
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click 'Save' and name it 'GraduationAPI'.
 * 5. Click 'Deploy' > 'New deployment'.
 * 6. Select type 'Web app'.
 * 7. Set 'Execute as' to 'Me'.
 * 8. Set 'Who has access' to 'Anyone'.
 * 9. Click 'Deploy' and copy the 'Web app URL'.
 * 10. Paste the URL into the 'API_URL' variable in your 'script.js' file.
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get Student Data
  const sheet = ss.getSheets()[0]; 
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const students = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j].toString().trim()] = row[j];
    }
    students.push(item);
  }

  // Get Settings
  const settingsSheet = ss.getSheetByName('Pengaturan');
  let releaseDate = '2026-04-29 23:20:00'; // Default
  if (settingsSheet) {
    releaseDate = settingsSheet.getRange('B2').getValue();
  }

  const result = JSON.stringify({
    students: students,
    settings: {
      releaseDate: releaseDate
    }
  });

  return ContentService.createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}
