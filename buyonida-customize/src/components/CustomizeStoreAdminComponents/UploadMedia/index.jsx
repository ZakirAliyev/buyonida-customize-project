import "./index.scss";
import { useRef, useState } from "react";
import cloud from "/src/assets/icons/cloud.svg";
import bin from "/src/assets/icons/bin.svg";

function UploadMedia() {
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleBrowse = () => {
        inputRef.current?.click();
    };

    const handleFile = (selected) => {
        if (!selected || !selected.type.startsWith("image/")) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleFileChange = (e) => {
        handleFile(e.target.files[0]);
    };

    /* 🗑 DELETE */
    const handleDelete = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        inputRef.current.value = "";
    };

    /* 🖱 DRAG EVENTS */
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const shortenFileName = (name) => {
        const ext = name.slice(name.lastIndexOf("."));
        const base = name.slice(0, name.lastIndexOf("."));
        if (base.length <= 35) return name;
        return `${base.slice(0, 7)}...${base.slice(-3)}${ext}`;
    };

    return (
        <section id="uploadMedia">
            <section id="uploadMediaName">Image</section>

            <section
                id="uploadMediaWrapper"
                className={isDragging ? "dragging" : ""}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!preview ? (
                    <div className="uploadBox" onClick={handleBrowse}>
                        <img src={cloud} className="icon" />
                        <p className="title">Upload your image</p>

                        <div className="orWrapper">
                            <div className="divider"></div>
                            <span className="or">or</span>
                            <div className="divider"></div>
                        </div>

                        <button type="button" className="browseBtn">
                            Browse files
                        </button>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <div className="selectedImageBox" onClick={handleBrowse}>
                        <img src={preview} className="image" />

                        <div className="fileName">
                            {shortenFileName(file.name)}
                        </div>

                        <div className="overlay">
                            <span>Change</span>
                        </div>

                        <img
                            src={bin}
                            className="deleteIcon"
                            alt="Delete"
                            onClick={handleDelete}
                        />

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </div>
                )}
            </section>
        </section>
    );
}

export default UploadMedia;
