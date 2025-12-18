// ========================================
// EMAIL TEMPLATE BUILDER - 
// lib/email/email-service.ts
// ========================================
import { BASE_STYLES } from "./email-base-styles";

export default class EmailTemplateBuilder {
  private styles: string = BASE_STYLES;
  private headerTitle: string = 'PROYECTO CUMBRE';
  private headerStyle: string = 'background: #000000;';
  
  withCustomStyles(additionalStyles: string): this {
    this.styles += `\n${additionalStyles}`;
    return this;
  }
  
  withCustomHeader(title: string, style?: string): this {
    this.headerTitle = title;
    if (style) this.headerStyle = style;
    return this;
  }
  
  build(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.styles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header" style="${this.headerStyle}">
              <h1>${this.headerTitle}</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
              <p>© ${new Date().getFullYear()} Proyecto Cumbre - Club de Montaña</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}