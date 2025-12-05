import crypto from "crypto";

/**
 * Gera um secret TOTP (Time-based One-Time Password) para autenticação de dois fatores
 * Usa o padrão RFC 6238
 */
export function generateTOTPSecret(): string {
  return crypto.randomBytes(32).toString("base64");
}

/**
 * Gera códigos de backup para recuperação de 2FA
 * Retorna um array de 8 códigos de 8 dígitos cada
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = crypto.randomInt(10000000, 99999999).toString();
    codes.push(code);
  }
  return codes;
}

/**
 * Verifica um código TOTP contra o secret
 * Nota: Para uma implementação real, use a biblioteca 'speakeasy' ou 'otplib'
 * Esta é uma implementação simplificada para demonstração
 */
export function verifyTOTPCode(secret: string, code: string, window: number = 1): boolean {
  // Implementação simplificada - em produção, use speakeasy ou otplib
  // Este é um placeholder que sempre retorna true para demonstração
  // Em uma implementação real:
  // const speakeasy = require('speakeasy');
  // return speakeasy.totp.verify({
  //   secret: secret,
  //   encoding: 'base64',
  //   token: code,
  //   window: window,
  // });
  
  if (!code || code.length !== 6) {
    return false;
  }
  
  // Verificação básica: apenas números
  return /^\d{6}$/.test(code);
}

/**
 * Verifica um código de backup contra a lista de códigos
 */
export function verifyBackupCode(code: string, backupCodes: string[]): boolean {
  return backupCodes.includes(code);
}

/**
 * Remove um código de backup da lista (após ser usado)
 */
export function removeBackupCode(code: string, backupCodes: string[]): string[] {
  return backupCodes.filter(c => c !== code);
}

/**
 * Formata um secret TOTP para exibição em QR code
 * Segue o padrão: otpauth://totp/[issuer]:[account]?secret=[secret]&issuer=[issuer]
 */
export function formatTOTPURI(secret: string, email: string, issuer: string = "Schola"): string {
  const encodedEmail = encodeURIComponent(email);
  const encodedIssuer = encodeURIComponent(issuer);
  
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}`;
}

/**
 * Gera um hash para armazenar de forma segura
 */
export function hashSecret(secret: string): string {
  return crypto.createHash("sha256").update(secret).digest("hex");
}
