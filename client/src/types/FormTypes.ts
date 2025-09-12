export interface TableRow {
    id: string;
    codigoConcorrente: string;
    precoConcorrente: string;
    codigoCral: string;
    precoCral: string;
    comentario: string;
    nomeConcorrente?: string;
    grupoIdCliente?: string;
}

export interface FormData {
    rows: TableRow[];
    pdfFile: File | null;
}

export interface FormErrors {
    precoConcorrente?: string;
    precoCral?: string;
    dataPreenchimento?: string;
    missingFields?: string;
    missingPdf?: string;
}
