/**
 * SETUP SCRIPT FOR GRADUATION ANNOUNCEMENT SYSTEM
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Create a new file named 'setup.gs'.
 * 4. Paste this code and save.
 * 5. Refresh your Google Sheet.
 * 6. You will see a new menu 'LULUS API' > 'Inisialisasi Database'.
 * 7. Click it to set up the headers and sample data.
 * Note: Access opens on 29 April 2026 at 23:20 WIB.
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('LULUS API')
    .addItem('Inisialisasi Database', 'initializeDatabase')
    .addToUi();
}

/**
 * Creates the necessary headers and sample data if the sheet is empty.
 */
function initializeDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];
  
  if (!sheet) {
    sheet = ss.insertSheet('Data Kelulusan');
  } else {
    sheet.setName('Data Kelulusan');
  }

  const headers = [
    'URL FOTO', 
    'NISN', 
    'Nama Siswa', 
    'Kelas', 
    'Nilai Matematika', 
    'Nilai Bahasa Indonesia', 
    'Nilai IPAS', 
    'Status kelulusan', 
    'URL FILE'
  ];

  // Set Headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');

  // Check if data already exists (besides headers)
  if (sheet.getLastRow() === 1) {
    const sampleData = [
      [
        'https://i.pravatar.cc/300?img=11', 
        '1234567890', 
        'BUDI SANTOSO', 
        'XII MIPA 1', 
        90, 
        85, 
        88, 
        'Lulus', 
        'https://example.com/file_budi.pdf'
      ],
      [
        'https://i.pravatar.cc/300?img=5', 
        '0987654321', 
        'SITI AMINAH', 
        'XII IPS 2', 
        75, 
        80, 
        78, 
        'Lulus', 
        'https://example.com/file_siti.pdf'
      ]
    ];
    sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
    SpreadsheetApp.getUi().alert('Database Berhasil Diinisialisasi!\n\nAkses Pengumuman akan dibuka pada:\n29 April 2026 | 23:20 WIB');
  } else {
    SpreadsheetApp.getUi().alert('Header berhasil diperbarui!\n\nJadwal Buka: 29 April 2026 | 23:20 WIB');
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);

  // Setup Settings Sheet
  let settingsSheet = ss.getSheetByName('Pengaturan');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Pengaturan');
  }
  settingsSheet.clear();
  settingsSheet.getRange('A1:B1').setValues([['Parameter', 'Nilai']]).setFontWeight('bold').setBackground('#f3f3f3');
  settingsSheet.getRange('A2:B2').setValues([['Waktu Buka (YYYY-MM-DD HH:mm:ss)', '2026-04-29 23:20:00']]);
  settingsSheet.autoResizeColumns(1, 2);

  SpreadsheetApp.getUi().alert('Database & Pengaturan Berhasil Diinisialisasi!\n\nSilakan atur Waktu Buka di sheet "Pengaturan".');
}
