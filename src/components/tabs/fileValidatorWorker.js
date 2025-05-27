/* eslint-disable no-restricted-globals */

import { INVOICE_STATUS, ORDER_STATUS } from "../../Utils/Utils";

self.onmessage = function (event) {
  const { jsonData, importOptions } = event.data;

  if (!jsonData || jsonData.length === 0) {
    self.postMessage({ error: "Invalid file structure.", valid: false });
    return;
  }

  const fileHeaders = jsonData[0];
  const expectedHeaders = ["po_id", "invoice_status", "order_status", "tracking_number"];
  const requiredColumns = importOptions.map((opt) => opt.key);

  const validInvoiceStatuses = new Set([
    INVOICE_STATUS.NOT_INVOICED,
    INVOICE_STATUS.READY_TO_INVOICE,
    INVOICE_STATUS.INVOICED,
  ]);
  const validOrderStatuses = new Set([
    ORDER_STATUS.SUBMITTED,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.IN_PRODUCTION,
    ORDER_STATUS.SHIPPED_OUT,
    ORDER_STATUS.HOLD,
    ORDER_STATUS.REJECTED,
    ORDER_STATUS.FTYREJECTED,
    ORDER_STATUS.SUBMITTED
  ]);



  // Validate header structure based on importOptions and expected position trend
  let missingColumns = [];
  let columnErrors = [];

  requiredColumns.forEach((col) => {
    if (!fileHeaders.includes(col)) {
      missingColumns.push(col);
    } else {
      // Ensure columns follow the predefined order if they exist
      const expectedPosition = expectedHeaders.indexOf(col);
      const actualPosition = fileHeaders.indexOf(col);
      if (expectedPosition !== -1 && actualPosition !== expectedPosition) {
        columnErrors.push(
          `Column '${col}' is at position ${actualPosition + 1}, expected ${expectedPosition + 1}.`
        );
      }
    }
  });

  if (missingColumns.length > 0) {
    self.postMessage({
      error: `Missing required columns: ${missingColumns.join(", ")}`,
      valid: false,
    });
    return;
  }

  if (columnErrors.length > 0) {
    self.postMessage({
      error: columnErrors.join("\n"),
      valid: false,
    });
    return;
  }

  let errors = [];
  let columnMissingCounts = {};
  let columnInvalidCounts = {};
  let columnTotalValues = {};
  let totalRows = jsonData.length - 1; // Excluding headers

  requiredColumns.forEach((col) => {
    columnMissingCounts[col] = 0;
    columnInvalidCounts[col] = 0;
    columnTotalValues[col] = 0;
  });

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    requiredColumns.forEach((col) => {
      const colIndex = fileHeaders.indexOf(col);
      if (colIndex !== -1) {
        const cellValue = row[colIndex];
        if (!cellValue) {
          columnMissingCounts[col]++;
        } else {
          columnTotalValues[col]++;
          // Validate allowed values for invoice_status and order_status
          if (col === "invoice_status" && !validInvoiceStatuses.has(cellValue)) {
            columnInvalidCounts[col]++;
          }
          if (col === "order_status" && !validOrderStatuses.has(cellValue)) {
            columnInvalidCounts[col]++;
          }
        }
      }
    });
  }

  let partiallyEmptyColumns = [];
  let fullyEmptyColumns = [];
  let invalidColumns = [];
  
  requiredColumns.forEach((col) => {
    let missingPercentage = (columnMissingCounts[col] / totalRows) * 100;
    let invalidPercentage = columnTotalValues[col] > 0 ? (columnInvalidCounts[col] / columnTotalValues[col]) * 100 : 0;
    
    if (columnMissingCounts[col] === totalRows) {
      fullyEmptyColumns.push(col);
    } else if (missingPercentage > 20) { // Threshold: More than 20% missing
      partiallyEmptyColumns.push(`${col} (${missingPercentage.toFixed(2)}% missing)`);
    }
    if (invalidPercentage > 0) {
      invalidColumns.push(`${col} (${invalidPercentage.toFixed(2)}% invalid values). Allowed values: ${col === "invoice_status" ? Array.from(validInvoiceStatuses).join(", ") : Array.from(validOrderStatuses).join(", ")}`);
    }
  });

  if (fullyEmptyColumns.length > 0) {
    errors.push(`The following columns are completely empty: ${fullyEmptyColumns.join(", ")}`);
  }

  if (partiallyEmptyColumns.length > 0) {
    errors.push(`The following columns have significant missing values: ${partiallyEmptyColumns.join(", ")}`);
  }

  if (invalidColumns.length > 0) {
    errors.push(`The following columns contain invalid values: ${invalidColumns.join("\n")}`);
  }

  if (errors.length > 0) {
    self.postMessage({ error: errors.join("\n"), valid: false });
  } else {
    self.postMessage({ error: "", valid: true });
  }
};
