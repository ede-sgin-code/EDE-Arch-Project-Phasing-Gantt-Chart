import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Captures the given DOM element (including any content hidden by
// horizontal scrolling) and downloads it as a PDF sized to fit the image.
export async function exportToPdf(element, projectName) {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${projectName.replace(/\s+/g, '_')}_gantt.pdf`);
}
