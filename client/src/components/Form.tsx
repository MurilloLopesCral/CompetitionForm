import { Building2, Loader, Plus, RotateCcw, Send } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CONSULTORAS as CONSULTORAS_LIST, REGIOES } from "../constants/options";
import { useSubmitForm } from "../hooks/useSubmitForm";
import { useToast } from "../hooks/useToast";
import { FormErrors, TableRow as TableRowType } from "../types/FormTypes";
import { FileUpload } from "./FileUpload";
import { TableRow } from "./TableRow";
import { Select } from "./ui/Select";
import { SuggestionsList } from "./ui/SuggestionsList";
import { TextInput } from "./ui/TextInput";
import { ToggleSwitch } from "./ui/ToggleSwitch";

export const Form: React.FC = () => {
    const [isDocumentOnlyMode, setIsDocumentOnlyMode] = useState(false);
    const { showToast } = useToast();

    const [rows, setRows] = useState<TableRowType[]>([
        {
            id: "1",
            codigoConcorrente: "",
            qtd: 0,
            precoConcorrente: "",
            codigoCral: "",
            precoCral: "",
            comentario: ""
        }
    ]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const { submitForm, isSubmitting } = useSubmitForm();
    const [tipoDocumento, setTipoDocumento] = useState<
        "nota_fiscal" | "sem_comprovante"
    >("nota_fiscal");

    // Campos adicionais
    const [consultoraNome, setConsultoraNome] = useState("");
    const [consultoraRegiao, setConsultoraRegiao] = useState("");
    // Removidos os campos avulsos de sem comprovante; agora ficam por linha

    // Se for "sem comprovante", força modo completo e limpa PDF
    useEffect(() => {
        if (tipoDocumento === "sem_comprovante") {
            setIsDocumentOnlyMode(false);
            setPdfFile(null);
        } else {
            // Ao voltar para Nota Fiscal, limpar campos adicionais por linha
            setRows((prev) =>
                prev.map((r) => ({
                    ...r,
                    nomeConcorrente: "",
                    grupoIdCliente: ""
                }))
            );
        }
    }, [tipoDocumento]);

    const [showConsultoraSuggestions, setShowConsultoraSuggestions] =
        useState(false);
    const filteredConsultoras = useMemo(() => {
        const q = consultoraNome.trim().toLowerCase();
        if (!q) return [] as string[];
        return CONSULTORAS_LIST.filter((n) =>
            n.toLowerCase().includes(q)
        ).slice(0, 8);
    }, [consultoraNome]);

    const createNewRow = (): TableRowType => ({
        id: Date.now().toString(),
        codigoConcorrente: "",
        qtd: 0,
        precoConcorrente: "",
        codigoCral: "",
        precoCral: "",
        comentario: ""
    });

    const isRowComplete = (row: TableRowType): boolean => {
        const hasCodigo = row.codigoConcorrente.trim() !== "";
        const base =
            row.precoConcorrente.trim() !== "" && row.precoCral.trim() !== "";
        if (tipoDocumento === "sem_comprovante") {
            const hasNomeConc = (row.nomeConcorrente || "").trim() !== "";
            const hasGrupoId = (row.grupoIdCliente || "").trim() !== "";
            return base && hasNomeConc && hasGrupoId;
        }
        return base && hasCodigo;
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

    const handleClearRows = () => {
        setRows([
            {
                id: "1",
                qtd: 0,
                codigoConcorrente: "",
                precoConcorrente: "",
                codigoCral: "",
                precoCral: "",
                comentario: ""
            }
        ]);
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

        // Validar tabela (em "sem comprovante" sempre valida a tabela)
        if (!(isDocumentOnlyMode && tipoDocumento !== "sem_comprovante")) {
            const incompleteRows = rows.filter((row) => !isRowComplete(row));
            if (incompleteRows.length > 0) {
                newErrors.missingFields =
                    "Todos os campos da tabela devem estar preenchidos.";
            }
        }

        // Validar arquivo PDF (não é obrigatório no modo "sem comprovante")
        if (tipoDocumento !== "sem_comprovante") {
            if (!pdfFile) {
                newErrors.missingPdf = "O arquivo PDF é obrigatório.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const { ok } = await submitForm({
            isDocumentOnlyMode,
            tipoDocumento,
            rows,
            pdfFile,
            consultoraNome,
            consultoraRegiao
        });

        try {
            if (ok) {
                showToast("Formulário enviado com sucesso!", "success");

                // Reset do formulário
                setRows([
                    {
                        id: "1",
                        qtd: 0,
                        codigoConcorrente: "",
                        precoConcorrente: "",
                        codigoCral: "",
                        precoCral: "",
                        comentario: ""
                    }
                ]);
                setPdfFile(null);
                setErrors({});
                setTipoDocumento("nota_fiscal");
                setConsultoraNome("");
                setConsultoraRegiao("");
            } else {
                showToast("Erro no envio", "error");
            }
        } catch (error) {
            showToast("Erro ao enviar formulário. Tente novamente.", "error");
            console.error("Erro no envio:", error);
        }
    };

    const showTable = !(
        isDocumentOnlyMode && tipoDocumento !== "sem_comprovante"
    );

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
                                onClick={() => {
                                    if (tipoDocumento === "sem_comprovante")
                                        return;
                                    setIsDocumentOnlyMode(!isDocumentOnlyMode);
                                }}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                    isDocumentOnlyMode
                                        ? "bg-blue-600"
                                        : "bg-slate-600"
                                }`}
                                disabled={tipoDocumento === "sem_comprovante"}
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

                    {/* Dados da consultora */}
                    <div className="mb-8 border-t border-slate-700 pt-8">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Dados da consultora
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 relative">
                                <label className="block text-slate-300 text-sm mb-1">
                                    Nome da consultora
                                </label>
                                <TextInput
                                    type="text"
                                    value={consultoraNome}
                                    onChange={(e) => {
                                        setConsultoraNome(e.target.value);
                                        setShowConsultoraSuggestions(true);
                                    }}
                                    onFocus={() => {
                                        if (consultoraNome.trim())
                                            setShowConsultoraSuggestions(true);
                                    }}
                                    onBlur={() => {
                                        setTimeout(
                                            () =>
                                                setShowConsultoraSuggestions(
                                                    false
                                                ),
                                            150
                                        );
                                    }}
                                    placeholder="Digite o nome da consultora"
                                />
                                {showConsultoraSuggestions &&
                                    filteredConsultoras.length > 0 && (
                                        <SuggestionsList
                                            items={filteredConsultoras}
                                            onSelect={(nome) => {
                                                setConsultoraNome(nome);
                                                setShowConsultoraSuggestions(
                                                    false
                                                );
                                            }}
                                        />
                                    )}
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">
                                    Região de venda
                                </label>
                                <Select
                                    value={consultoraRegiao}
                                    onChange={(e) =>
                                        setConsultoraRegiao(e.target.value)
                                    }
                                >
                                    <option value="">Selecione a região</option>
                                    {REGIOES.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Tabela */}
                    {showTable && (
                        <div className="mb-8 border-t border-slate-700 pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Dados dos produtos do concorrente
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleClearRows}
                                        className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all transform hover:scale-105"
                                        title="Limpar todas as linhas"
                                    >
                                        <RotateCcw size={16} />
                                        <span>Limpar linhas</span>
                                    </button>
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
                                        <span>Adicionar linha</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-700">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-800/60">
                                        <tr>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                #
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Código Concorrente
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Qtd.
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Preço Concorrente
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Código CRAL
                                            </th>
                                            <th className="text-left p-4 text-blue-400 font-semibold">
                                                Preço CRAL
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
                                                isSemComprovante={
                                                    tipoDocumento ===
                                                    "sem_comprovante"
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

                    {/* Toggle Nota Fiscal / Sem comprovante */}
                    <div className="mb-6 flex justify-center border-t border-slate-700 pt-8">
                        <div className="bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 flex items-center space-x-3">
                            <span
                                className={`font-medium text-sm transition-colors ${
                                    tipoDocumento === "nota_fiscal"
                                        ? "text-blue-400"
                                        : "text-slate-400"
                                }`}
                            >
                                Nota Fiscal
                            </span>
                            <ToggleSwitch
                                isOn={tipoDocumento === "sem_comprovante"}
                                size="sm"
                                onClick={() =>
                                    setTipoDocumento(
                                        tipoDocumento === "nota_fiscal"
                                            ? "sem_comprovante"
                                            : "nota_fiscal"
                                    )
                                }
                            />
                            <span
                                className={`font-medium text-sm transition-colors ${
                                    tipoDocumento === "sem_comprovante"
                                        ? "text-blue-400"
                                        : "text-slate-400"
                                }`}
                            >
                                Sem comprovante
                            </span>
                        </div>
                    </div>

                    {/* Upload de Arquivo */}
                    {tipoDocumento !== "sem_comprovante" && (
                        <div className="mb-8 pt-2">
                            <FileUpload
                                file={pdfFile}
                                onFileSelect={setPdfFile}
                                error={errors.missingPdf}
                            />
                        </div>
                    )}

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
