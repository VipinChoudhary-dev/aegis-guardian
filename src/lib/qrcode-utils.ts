import QRCode from 'qrcode';

export interface DigitalIDData {
  id: string;
  name: string;
  photo?: string;
  bloodType?: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  medicalConditions?: string;
  phone: string;
}

export class QRCodeService {
  /**
   * Generate QR code data URL for digital ID
   */
  static async generateQRCode(data: DigitalIDData): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      const qrCodeDataURL = await QRCode.toDataURL(jsonData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 400,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Parse QR code data
   */
  static parseQRData(qrData: string): DigitalIDData {
    try {
      return JSON.parse(qrData);
    } catch (error) {
      console.error('Error parsing QR data:', error);
      throw new Error('Invalid QR code data');
    }
  }

  /**
   * Generate emergency contact card URL
   */
  static generateEmergencyCardURL(digitalId: string): string {
    return `${window.location.origin}/emergency-card/${digitalId}`;
  }
}
