import './index.scss'
import linkIcon from "/src/assets/icons/link.svg";

function TextEditor({
                       name,
                       disabled = false
                   }) {

    return (
        <section id="textEditor" className={disabled ? "disabled" : ""}>
            <section id="textEditorName">
                {name}

                {isLink && (
                    <div
                        className="iconSet"
                        onClick={handleLinkClick}
                        style={{
                            cursor: value ? "pointer" : "not-allowed",
                            opacity: value ? 1 : 0.4
                        }}
                    >
                        <img src={linkIcon} alt="Link" className="icon" />
                    </div>
                )}
            </section>
        </section>
    );
}

export default TextEditor;
