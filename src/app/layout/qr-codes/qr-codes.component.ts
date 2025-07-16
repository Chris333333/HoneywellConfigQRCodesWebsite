import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { QrCodesService } from '../../services/qr-codes.service';
import { QRCodesList } from '../../models/QRCodesList';

@Component({
  selector: 'app-qr-codes',
  imports: [TranslateModule, CommonModule],
  templateUrl: './qr-codes.component.html',
  styleUrl: './qr-codes.component.scss',
})
export class QrCodesComponent implements OnInit {
  localID: number = 0;
  notFound = false;
  qrCodes: QRCodesList[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private qrCodesService: QrCodesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.localID = Number(params.get('localID'));
      this.qrCodesService.getQRCodesList(this.localID).subscribe({
        next: (data: QRCodesList[]) => {
          this.qrCodes = data;
          this.notFound = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.notFound = true;
          }
        },
      });
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  async exportQRCodesToPDF() {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFontSize(20);
    pdf.text('Certyfikaty 07-2025', pageWidth / 2, 30, { align: 'center' });
    let y = 60; // Start below the title
    const qrItems = Array.from(
      document.querySelectorAll('.qr-code-item')
    ) as HTMLElement[];
    for (const item of qrItems) {
      const images = Array.from(item.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          });
        })
      );
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
