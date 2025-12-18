// ========================================
// BASE EMAIL STYLES (DRY)
// ========================================

export const BASE_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6; 
    color: #e4e4e7;
    background-color: #09090b;
    padding: 20px;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
  }
  .header { 
    background: #000000;
    padding: 40px 30px;
    text-align: center;
  }
  .header h1 {
    color: #f97316;
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .content { 
    padding: 40px 30px;
    background-color: #18181b;
  }
  .content h2 {
    color: #fafafa;
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: 600;
  }
  .content p {
    color: #a1a1aa;
    margin-bottom: 16px;
    font-size: 15px;
  }
  .success-box {
    background-color: #022c22;
    border: 1px solid #065f46;
    border-radius: 12px;
    padding: 25px;
    text-align: center;
    margin: 30px 0;
  }
  .success-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }
  .success-title {
    font-size: 20px;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 8px;
  }
  .success-subtitle {
    color: #6ee7b7;
    font-size: 14px;
  }
  .info-box {
    background-color: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .info-box h3 {
    color: #fafafa;
    font-size: 16px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .info-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .info-box li {
    color: #a1a1aa;
    padding: 8px 0;
    border-bottom: 1px solid #3f3f46;
    font-size: 15px;
  }
  .info-box li:last-child {
    border-bottom: none;
  }
  .info-box strong {
    color: #fafafa;
    font-weight: 600;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #3f3f46;
  }
  .info-row:last-child {
    border-bottom: none;
  }
  .info-label {
    color: #a1a1aa;
    font-size: 14px;
  }
  .info-value {
    color: #fafafa;
    font-weight: 600;
    font-size: 14px;
  }
  .alert-box {
    background-color: #422006;
    border: 1px solid #7c2d12;
    border-left: 4px solid #f97316;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .alert-box p {
    color: #fcd34d;
    margin: 8px 0;
    font-size: 14px;
  }
  .alert-box strong {
    color: #fbbf24;
  }
  .cta-button {
    display: inline-block;
    background-color: #f97316;
    color: #ffffff;
    padding: 16px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 16px;
    margin: 20px 0;
  }
  .footer { 
    text-align: center; 
    padding: 30px;
    background-color: #09090b;
    border-top: 1px solid #27272a;
  }
  .footer p {
    color: #71717a;
    font-size: 13px;
    margin: 5px 0;
  }
`;
