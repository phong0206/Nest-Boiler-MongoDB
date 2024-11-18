export interface DatabaseConfig {
  getDatabaseEngine(): string;
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseName(): string;
}
