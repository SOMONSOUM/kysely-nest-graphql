export interface JwtDto {
  userId: string;
  tenantId: string;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
