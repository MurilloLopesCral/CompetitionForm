import React, { useState } from "react";
import printToPdf from "../../assets/printToPdf.png";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string; // conteúdo no formato markdown-like
}

export const InfoModal: React.FC<InfoModalProps> = ({
    isOpen,
    onClose,
    content
}) => {
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    if (!isOpen) return null;

    const renderLine = (line: string, index: number) => {
        if (line.startsWith("#### ")) {
            return (
                <h4
                    key={index}
                    className="text-md font-semibold text-slate-300 mt-3 mb-1"
                >
                    {line.replace("#### ", "")}
                </h4>
            );
        }
        if (line.startsWith("### ")) {
            return (
                <h3
                    key={index}
                    className="text-lg font-semibold text-white mt-4 mb-2"
                >
                    {line.replace("### ", "")}
                </h3>
            );
        }
        if (line.startsWith("## ")) {
            return (
                <h2
                    key={index}
                    className="text-xl font-bold text-white mt-6 mb-3"
                >
                    {line.replace("## ", "")}
                </h2>
            );
        }
        if (line.startsWith("# ")) {
            return (
                <h1
                    key={index}
                    className="text-2xl font-bold text-white mt-8 mb-4"
                >
                    {line.replace("# ", "")}
                </h1>
            );
        }
        if (line.trim() === "(IMAGEM AQUI)") {
            return (
                <img
                    key={index}
                    src={printToPdf}
                    alt="Explicação"
                    onClick={() => setZoomImage(printToPdf)}
                    className="mx-auto my-6 rounded-lg shadow-lg border border-slate-700 max-h-64 object-contain cursor-pointer hover:scale-105 transition-transform"
                />
            );
        }
        return (
            <p
                key={index}
                className="text-slate-200 text-sm leading-relaxed mb-2"
            >
                {line}
            </p>
        );
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {content.split("\n").map((line, i) => renderLine(line, i))}

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Zoom da Imagem */}
            {zoomImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]"
                    onClick={() => setZoomImage(null)}
                >
                    <img
                        src={zoomImage}
                        alt="Zoom"
                        className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
                    />
                </div>
            )}
        </>
    );
};
