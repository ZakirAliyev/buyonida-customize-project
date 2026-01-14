import "./index.scss";
import {useRef, useState} from "react";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
    toolbar: [
        [{header: [1, 2, 3, 4, 5, 6, false]}],
        ["bold", "italic", "underline"],
        [{list: "ordered"}, {list: "bullet"}],
        ["link"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "link",
];

function TextEditor() {
    const quillRef = useRef(null);
    const [content, setContent] = useState("");

    const handleChange = (html, delta, source) => {
        if (source === "user") {
            setContent(html);
        }
    };

    return (
        <section id={"textEditor"}>
            <ReactQuillNew
                ref={quillRef}
                theme="snow"
                modules={modules}
                formats={formats}
                value={content}
                onChange={handleChange}
                placeholder="New arrivals"
            />
        </section>
    );
}

export default TextEditor;
