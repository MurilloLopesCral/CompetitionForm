export interface TableRow {
    id: string;
    codigoConcorrente: string;
    qtd: number;
    precoConcorrente: string;
    codigoCral: string;
    precoCral: string;
    comentario: string;
    nomeConcorrente?: string;
    grupoIdCliente?: string;
    tipo_frete?: string;
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
