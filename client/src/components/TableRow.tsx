import { Trash2 } from "lucide-react";
import React from "react";
import { TableRow as TableRowType } from "../types/FormTypes";

interface TableRowProps {
    row: TableRowType;
    index: number;
    onUpdateRow: (
        id: string,
        field: keyof Omit<TableRowType, "id">,
        value: string
    ) => void;
    onDeleteRow: (id: string) => void;
    isDeleteDisabled: boolean;
    isSemComprovante?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
    row,
    index,
    onUpdateRow,
    onDeleteRow,
    isDeleteDisabled,
    isSemComprovante = false
}) => {
    const formatValor = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        const numberValue = parseInt(cleanValue || "0") / 100;
        return numberValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    const handlePrecoConcorrenteChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const formattedValor = formatValor(e.target.value);
        onUpdateRow(row.id, "precoConcorrente", formattedValor);
    };

    const handlePrecoCralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValor = formatValor(e.target.value);
        onUpdateRow(row.id, "precoCral", formattedValor);
    };

    return (
        <>
            <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                <td className="p-3">
                    <span className="text-blue-400 font-medium">
                        {index + 1}
                    </span>
                </td>
                <td className="p-3">
                    <input
                        type="text"
                        value={row.codigoConcorrente}
                        onChange={(e) =>
                            onUpdateRow(
                                row.id,
                                "codigoConcorrente",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Digite o código do concorrente"
                    />
                </td>

                {/* Novo campo Qtd */}
                <td className="p-3">
                    <input
                        type="number"
                        min={1}
                        value={row.qtd || ""}
                        onChange={(e) =>
                            onUpdateRow(row.id, "qtd", e.target.value)
                        }
                        className="w-24 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Qtd"
                    />
                </td>

                <td className="p-3">
                    <input
                        type="text"
                        value={row.precoConcorrente}
                        onChange={handlePrecoConcorrenteChange}
                        maxLength={14}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="R$ 0,00"
                    />
                </td>
                <td className="p-3">
                    <input
                        type="text"
                        value={row.codigoCral}
                        onChange={(e) =>
                            onUpdateRow(row.id, "codigoCral", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Código do CRAL"
                    />
                </td>
                <td className="p-3">
                    <input
                        type="text"
                        value={row.precoCral}
                        onChange={handlePrecoCralChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="R$ 0,00"
                    />
                </td>
                <td className="p-3">
                    <input
                        type="text"
                        value={row.comentario}
                        onChange={(e) =>
                            onUpdateRow(row.id, "comentario", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Comentário opcional"
                    />
                </td>

                <td className="p-3">
                    <button
                        type="button"
                        onClick={() => onDeleteRow(row.id)}
                        disabled={isDeleteDisabled}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remover linha"
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
            </tr>

            {isSemComprovante && (
                <tr className="border-b border-slate-700">
                    <td className="p-3 bg-slate-800/40" colSpan={7}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-slate-300 text-sm mb-1">
                                    Nome do concorrente
                                </label>
                                <input
                                    type="text"
                                    value={row.nomeConcorrente || ""}
                                    onChange={(e) =>
                                        onUpdateRow(
                                            row.id,
                                            "nomeConcorrente",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Digite o nome do concorrente"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">
                                    GrupoID do cliente
                                </label>
                                <input
                                    type="text"
                                    value={row.grupoIdCliente || ""}
                                    onChange={(e) =>
                                        onUpdateRow(
                                            row.id,
                                            "grupoIdCliente",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Digite o GrupoID do cliente"
                                />
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
