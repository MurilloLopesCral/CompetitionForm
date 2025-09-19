import { useState } from "react";
import { TableRow as TableRowType } from "../types/FormTypes";

interface SubmitArgs {
    isDocumentOnlyMode: boolean;
    tipoDocumento: "nota_fiscal" | "sem_comprovante";
    rows: TableRowType[];
    pdfFile: File | null;
    consultoraNome: string;
    consultoraRegiao: string;
}

export function useSubmitForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatToday = () => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = String(d.getFullYear());
        return `${dd}/${mm}/${yyyy}`;
    };

    const submitForm = async ({
        isDocumentOnlyMode,
        tipoDocumento,
        rows,
        pdfFile,
        consultoraNome,
        consultoraRegiao
    }: SubmitArgs): Promise<{ ok: boolean }> => {
        setIsSubmitting(true);
        try {
            const payload: Record<string, any> = {
                modo:
                    isDocumentOnlyMode && tipoDocumento !== "sem_comprovante"
                        ? "documento"
                        : "completo",
                tipo_documento: tipoDocumento,
                data_atual: formatToday(),
                consultora_nome: consultoraNome || undefined,
                consultora_regiao: consultoraRegiao || undefined,
                linhas:
                    isDocumentOnlyMode && tipoDocumento !== "sem_comprovante"
                        ? []
                        : rows.map((row) => ({
                              codigoConcorrente: row.codigoConcorrente,
                              precoConcorrente: row.precoConcorrente,
                              quantidade: row.qtd,
                              codigoCral: row.codigoCral,
                              precoCral: row.precoCral,
                              comentario: row.comentario,
                              ...(tipoDocumento === "sem_comprovante"
                                  ? {
                                        nomeConcorrente:
                                            row.nomeConcorrente || undefined,
                                        grupoIdCliente:
                                            row.grupoIdCliente || undefined
                                    }
                                  : {})
                          }))
            };

            const formData = new FormData();
            formData.append("payload", JSON.stringify(payload));
            if (pdfFile && tipoDocumento !== "sem_comprovante") {
                formData.append("pdfFile", pdfFile);
            }

            const response = await fetch(
                "https://crallabs.app.n8n.cloud/webhook/forms",
                {
                    method: "POST",
                    body: formData
                }
            );

            return { ok: response.ok };
        } catch (e) {
            console.error("Erro no envio:", e);
            return { ok: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitForm, isSubmitting };
}
