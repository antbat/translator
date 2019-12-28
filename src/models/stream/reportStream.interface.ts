export interface ReportStream {
    error(str: string): void;
    warn(str: string): void;
    info(str: string): void;
}
