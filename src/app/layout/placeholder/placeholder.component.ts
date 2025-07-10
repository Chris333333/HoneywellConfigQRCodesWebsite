import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-placeholder',
  imports: [],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  async exportQRCodesToPDF() {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFontSize(20);
    pdf.text('Certyfikaty 07-2025', pageWidth / 2, 30, { align: 'center' });
    let y = 60; // Start below the title
    const qrItems = Array.from(document.querySelectorAll('.qr-code-item')) as HTMLElement[];
    for (const item of qrItems) {
      const images = Array.from(item.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        });
      }));
      const canvas = await html2canvas(item, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 150;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      const x = (pageWidth - imgWidth) / 2; // Center horizontally
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    }
    pdf.save('qr-codes.pdf');
  }
}
