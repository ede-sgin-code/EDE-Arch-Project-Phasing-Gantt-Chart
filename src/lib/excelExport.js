import ExcelJS from 'exceljs';
import { parseISODate, diffInDays, getPhaseStatus } from './dateUtils';

// Builds a one-sheet workbook listing every phase's schedule and progress,
// and downloads it as an .xlsx file.
export async function exportToExcel(phases, projectName) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Phasing Schedule');

  sheet.columns = [
    { header: 'Phase', key: 'phase', width: 32 },
    { header: 'Start Date', key: 'start', width: 12 },
    { header: 'End Date', key: 'end', width: 12 },
    { header: 'Duration (days)', key: 'duration', width: 14 },
    { header: '% Complete', key: 'percent', width: 12 },
    { header: 'Status', key: 'status', width: 18 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const phase of phases) {
    const hasDates = Boolean(phase.startDate && phase.endDate);
    sheet.addRow({
      phase: phase.type === 'sub' ? `    ${phase.name}` : phase.name,
      start: phase.startDate ?? '',
      end: phase.endDate ?? '',
      duration: hasDates ? diffInDays(parseISODate(phase.startDate), parseISODate(phase.endDate)) : '',
      percent: phase.percentComplete,
      status: getPhaseStatus(phase)?.label ?? '',
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName.replace(/\s+/g, '_')}_gantt.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
