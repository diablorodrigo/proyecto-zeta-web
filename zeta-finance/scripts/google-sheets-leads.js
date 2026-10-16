/**
 * Webhook de leads de Zeta Finance.
 *
 * Pegalo en Extensiones → Apps Script de la hoja (no en un proyecto suelto).
 * Implementar → Aplicación web → Ejecutar como: Yo → Acceso: Cualquier persona.
 * La URL que termina en /exec va en GOOGLE_SHEETS_WEBHOOK_URL, en Production y Preview.
 *
 * Cada fila guarda fecha (horario de Salta), tipo, nombre, teléfono, email,
 * profesión, detalle y mensaje. Las guías llegan con tipo = guia.
 */
var SHEET_NAME = "Leads";
var TIMEZONE = "America/Argentina/Salta";

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(
      e && e.postData && e.postData.contents ? e.postData.contents : "{}",
    );
  } catch (err) {
    data = {};
  }

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "timestamp",
      "fecha_salta",
      "tipo",
      "nombre",
      "telefono",
      "email",
      "profesion",
      "detalle",
      "mensaje",
    ]);
    sheet.setFrozenRows(1);
  }

  var now = new Date();
  sheet.appendRow([
    data.timestamp || now.toISOString(),
    data.fecha || Utilities.formatDate(now, TIMEZONE, "dd/MM/yyyy HH:mm"),
    data.tipo || "",
    data.nombre || "",
    data.telefono || "",
    data.email || "",
    data.profesion || "",
    data.activos_json || "",
    data.mensaje || "",
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: "zeta-leads" }),
  ).setMimeType(ContentService.MimeType.JSON);
}
