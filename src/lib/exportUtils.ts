import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// PDF Export
export const exportToPDF = (
  data: Record<string, any>[],
  columns: { header: string; key: string }[],
  title: string,
  filename: string
) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text('Thiagarajar College of Engineering', 14, 36);
  
  // Table
  const tableData = data.map(row => columns.map(col => row[col.key] || ''));
  const headers = columns.map(col => col.header);
  
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [89, 23, 15] },
  });
  
  doc.save(`${filename}.pdf`);
};

// Excel Export
export const exportToExcel = (
  data: Record<string, any>[],
  columns: { header: string; key: string }[],
  filename: string
) => {
  const exportData = data.map(row => {
    const obj: Record<string, any> = {};
    columns.forEach(col => {
      obj[col.header] = row[col.key] || '';
    });
    return obj;
  });
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Excel Import
export const importFromExcel = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json as Record<string, any>[]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

// CSV Import
export const importFromCSV = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
