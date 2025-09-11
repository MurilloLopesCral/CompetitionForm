import { Building2, Loader, Plus, Send } from "lucide-react";
import React, { useState } from "react";
import { FormErrors, TableRow as TableRowType } from "../types/FormTypes";
import { FileUpload } from "./FileUpload";
import { TableRow } from "./TableRow";

export const Form: React.FC = () => {
    const [isDocumentOnlyMode, setIsDocumentOnlyMode] = useState(false);

    const [rows, setRows] = useState<TableRowType[]>([
        {
            id: "1",
            codigoConcorrente: "",
            precoConcorrente: "",
            codigoCral: "",
            precoCral: "",
            comentario: ""
        }
    ]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createNewRow = (): TableRowType => ({
        id: Date.now().toString(),
        codigoConcorrente: "",
        precoConcorrente: "",
        codigoCral: "",
        precoCral: "",
        comentario: ""
    });

    const isRowComplete = (row: TableRowType): boolean => {
        return (
            row.codigoConcorrente.trim() !== "" &&
            row.precoConcorrente.trim() !== "" &&
            row.precoCral.trim() !== ""
        );
    };

    const canAddNewRow = (): boolean => {
        return rows.length === 0 || isRowComplete(rows[rows.length - 1]);
    };

    const handleAddRow = () => {
        if (!canAddNewRow()) {
            alert(
                "Por favor, preencha todos os campos da linha anterior antes de adicionar uma nova."
            );
            return;
        }
        setRows([...rows, createNewRow()]);
    };

    const handleUpdateRow = (
        id: string,
        field: keyof Omit<TableRowType, "id">,
        value: string
    ) => {
        setRows(
            rows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
        setErrors({});
    };

    const handleDeleteRow = (id: string) => {
        if (rows.length > 1) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validar tabela apenas se não estiver no modo "Somente Documento"
        if (!isDocumentOnlyMode) {
            // Validar se todas as linhas estão preenchidas
            const incompleteRows = rows.filter((row) => !isRowComplete(row));
            if (incompleteRows.length > 0) {
                newErrors.missingFields =
                    "Todos os campos da tabela devem estar preenchidos.";
            }
        }

        // Validar arquivo PDF
        if (!pdfFile) {
            newErrors.missingPdf = "O arquivo PDF é obrigatório.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Montar o payload único
            const payload = {
                modo: isDocumentOnlyMode ? "documento" : "completo",
                linhas: !isDocumentOnlyMode
                    ? rows.map((row) => ({
                          codigoConcorrente: row.codigoConcorrente,
                          precoConcorrente: row.precoConcorrente,
                          codigoCral: row.codigoCral,
                          precoCral: row.precoCral,
                          comentario: row.comentario
                      }))
                    : []
            };

            // 👇 Aqui é o melhor ponto para debug
            console.log("Payload pronto para envio:", payload);
            console.log("Arquivo PDF selecionado:", pdfFile);

            // Criar FormData
            const formData = new FormData();
            formData.append("payload", JSON.stringify(payload));
            if (pdfFile) {
                formData.append("pdfFile", pdfFile);
            }

            // Enviar para o webhook do N8N
            const response = await fetch(
                "https://crallabs.app.n8n.cloud/webhook-test/forms",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (response.ok) {
                alert("Formulário enviado com sucesso!");

                // Reset do formulário
                setRows([
                    {
                        id: "1",
                        codigoConcorrente: "",
                        precoConcorrente: "",
                        codigoCral: "",
                        precoCral: "",
                        comentario: ""
                    }
                ]);
                setPdfFile(null);
                setErrors({});
            } else {
                throw new Error("Erro no envio");
            }
        } catch (error) {
            alert("Erro ao enviar formulário. Tente novamente.");
            console.error("Erro no envio:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
            <div className="max-w-full mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="mb-8 text-center border-b border-slate-700 pb-8">
                        {/* Logo da Empresa */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                                <Building2 className="text-white" size={40} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Formulário de Cadastro de informações de
                            concorrentes
                        </h1>
                        <p className="text-slate-400">
                            Preencha os dados e anexe o arquivo PDF obrigatório
                        </p>
                    </div>

                    {/* Toggle Mode */}
                    <div className="mb-8 flex justify-center">
                        <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-6 flex items-center space-x-4">
                            <span
                                className={`font-medium transition-colors ${
                                    !isDocumentOnlyMode
                                        ? "text-blue-400"
                                        : "text-slate-400"
                                }`}
                            >
                                Completo
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsDocumentOnlyMode(!isDocumentOnlyMode)
                                }
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                    isDocumentOnlyMode
                                        ? "bg-blue-600"
                                        : "bg-slate-600"
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                        isDocumentOnlyMode
                                            ? "translate-x-7"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                            <span
                                className={`font-medium transition-colors ${
                                    isDocumentOnlyMode
                                        ? "text-blue-400"
                                        : "text-slate-400"
                                }`}
                            >
                                Somente Documento
                            </span>
                        </div>
                    </div>

                    {/* Tabela */}
                    {!isDocumentOnlyMode && (
                        <div className="mb-8 border-t border-slate-700 pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Dados dos produtos do concorrente
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    disabled={!canAddNewRow()}
                                    title={
                                        !canAddNewRow()
                                            ? "Preencha a linha anterior antes de adicionar uma nova"
                                            : "Adicionar nova linha"
                                    }
                                >
                                    <Plus size={16} />
                                    <span>Adicionar Linha</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto bg-slate-900/50 rounded-xl border border-slate-700">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-800 border-b border-slate-700">
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                #
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Código produto Concorrente
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Preço concorrente (Sem IPI | ST)
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Código Produto Cral
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Preço Cral (Sem IPI | ST)
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Comentário
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <TableRow
                                                key={row.id}
                                                row={row}
                                                index={index}
                                                onUpdateRow={handleUpdateRow}
                                                onDeleteRow={handleDeleteRow}
                                                isDeleteDisabled={
                                                    rows.length === 1
                                                }
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Erros da tabela */}
                            {errors.missingFields && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    {errors.missingFields && (
                                        <p className="text-red-400 text-sm mb-2">
                                            {errors.missingFields}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload de Arquivo */}
                    <div className="mb-8 border-t border-slate-700 pt-8">
                        <FileUpload
                            file={pdfFile}
                            onFileSelect={setPdfFile}
                            error={errors.missingPdf}
                        />
                    </div>

                    {/* Botão de Envio */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                        >
                            {isSubmitting ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <Send size={20} />
                            )}
                            <span>
                                {isSubmitting
                                    ? "Enviando..."
                                    : "Enviar Formulário"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
