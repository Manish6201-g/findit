import QRCode from 'qrcode';

export const generateItemQrCode = async (itemId: string, itemName: string): Promise<string> => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://findit-campus.vercel.app';
    const itemUrl = `${frontendUrl}/items/${itemId}`;
    const payload = JSON.stringify({
      id: itemId,
      name: itemName,
      url: itemUrl,
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};
