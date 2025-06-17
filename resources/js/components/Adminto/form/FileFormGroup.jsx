import React, { useEffect, useRef, useState } from "react";

const FileFormGroup = ({
    id,
    col = "col-12",
    label,
    eRef,
    required = false,
    accept = "*",
    onChange = () => {},
    onError = "/api/cover/thumbnail/null",
}) => {
    const [fileName, setFileName] = useState("");
    const [filePreview, setFilePreview] = useState("");
    const fileInputRef = useRef();
    const previewRef = useRef();

    // Configura la referencia externa
    useEffect(() => {
        if (eRef) {
            eRef.current = {
                getFile: () => fileInputRef.current.files[0],
                setFileSrc: (src) => {
                    setFilePreview(src);
                    setFileName(src.split('/').pop());
                },
            };
        }
    }, [eRef]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            
            // Mostrar previsualización solo para imágenes
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setFilePreview(url);
            } else {
                setFilePreview("");
            }
            
            onChange(e);
        }
    };

    const getFileIcon = (filename) => {
        if (!filename) return "fa-file";
        
        const extension = filename.split('.').pop().toLowerCase();
        
        switch(extension) {
            case 'pdf':
                return "fa-file-pdf";
            case 'doc':
            case 'docx':
                return "fa-file-word";
            case 'xls':
            case 'xlsx':
                return "fa-file-excel";
            case 'ppt':
            case 'pptx':
                return "fa-file-powerpoint";
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'svg':
                return "fa-file-image";
            default:
                return "fa-file";
        }
    };

    return (
        <div className={`form-group ${col} mb-1`}>
            <label htmlFor={id} className="mb-1">
                {label} {required && <b className="text-danger">*</b>}
            </label>

            {filePreview ? (
                <div className="mb-2">
                    <img
                        ref={previewRef}
                        src={filePreview}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "150px",
                            borderRadius: "4px",
                            display: "block",
                        }}
                        onError={(e) => {
                            e.target.src = onError;
                        }}
                        alt="Preview"
                    />
                    <small className="text-muted">{fileName}</small>
                </div>
            ) : fileName ? (
                <div className="mb-2">
                    <i className={`fas ${getFileIcon(fileName)} me-2`}></i>
                    <span>{fileName}</span>
                </div>
            ) : null}

            <input
                id={id}
                type="file"
                ref={fileInputRef}
                accept={accept}
                onChange={handleFileChange}
                className="form-control mt-2"
            />
            <small className="text-muted">Formatos aceptados: {accept.replace(/\./g, "").replace(/,/g, ", ")}</small>
        </div>
    );
};

export default FileFormGroup;