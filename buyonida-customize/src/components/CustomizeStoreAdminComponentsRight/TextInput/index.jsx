import "./index.scss";
import linkIcon from "/src/assets/icons/link.svg";
import tagIcon from "/src/assets/icons/tag.svg";
import closeCircle from "/src/assets/icons/closeCircle.svg";
import collection from "/src/assets/icons/collection.svg";
import products from "/src/assets/icons/products.svg";
import pages from "/src/assets/icons/pages.svg";
import blogs from "/src/assets/icons/blogs.svg";
import policies from "/src/assets/icons/policies.svg";
import { useEffect, useMemo, useRef, useState } from "react";

function isValidUrl(value) {
    if (!value) return false;
    const trimmed = value.trim();
    if (!trimmed.includes(".")) return false;

    try {
        const url = new URL(
            trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
        );
        return /\.[a-z]{2,}$/i.test(url.hostname);
    } catch {
        return false;
    }
}

function TextInput({
                       name,
                       isIcon = false,
                       isDropdown = false,
                       disabled = false,
                   }) {
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const wrapperRef = useRef(null);

    const dropdownItems = [
        { id: "collection", label: "Collection", icon: collection },
        { id: "products", label: "Products", icon: products },
        { id: "pages", label: "Pages", icon: pages },
        { id: "blogs", label: "Blogs", icon: blogs },
        { id: "blog-post", label: "Blog post", icon: blogs },
        { id: "policies", label: "Policies", icon: policies },
    ];

    const isLink = useMemo(() => isValidUrl(value), [value]);

    useEffect(() => {
        const handleOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const customTypedItem =
        open && value && !selectedItem
            ? {
                id: "__custom__",
                label: value,
                icon: tagIcon,
            }
            : null;

    return (
        <section
            id="textInput"
            ref={wrapperRef}
            className={disabled ? "disabled" : ""}
        >
            <section id="textInputName">
                {name}

                {isLink && (
                    <div className="iconSet">
                        <img src={linkIcon} alt="Link" />
                    </div>
                )}
            </section>

            <div className="inputWrapper">
                <input
                    type="text"
                    className="textInput"
                    placeholder="Enter text"
                    value={selectedItem ? selectedItem.label : value}
                    disabled={disabled}
                    onClick={() => {
                        if (isDropdown && !disabled) {
                            setOpen(true);
                        }
                    }}
                    onChange={(e) => {
                        if (selectedItem) {
                            setSelectedItem(null);
                            setValue(e.target.value);
                            return;
                        }
                        setValue(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (selectedItem && e.key === "Backspace") {
                            e.preventDefault();
                            setSelectedItem(null);
                            setValue("");
                            return;
                        }

                        if (
                            e.key === "Enter" &&
                            customTypedItem &&
                            isDropdown
                        ) {
                            e.preventDefault();
                            setSelectedItem(customTypedItem);
                            setOpen(false);
                        }
                    }}
                    style={{
                        paddingLeft: isIcon ? "36px" : "12px",
                        paddingRight: value || selectedItem ? "36px" : "12px",
                    }}
                />

                {isIcon && (
                    <img
                        src={isLink ? linkIcon : tagIcon}
                        alt="Icon"
                        className="tag"
                    />
                )}

                {(value || selectedItem) && (
                    <img
                        src={closeCircle}
                        alt="Clear"
                        className="closeCircle"
                        onClick={() => {
                            setValue("");
                            setSelectedItem(null);
                        }}
                    />
                )}

                {isDropdown && open && (
                    <div className="inputPopover">
                        {customTypedItem ? (
                            <div
                                className="dropdownItem selected"
                                onClick={() => {
                                    setSelectedItem(customTypedItem);
                                    setOpen(false);
                                }}
                            >
                                <img
                                    src={customTypedItem.icon}
                                    className="icon"
                                    alt="Icon"
                                />
                                {customTypedItem.label}
                            </div>
                        ) : (
                            dropdownItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`dropdownItem ${
                                        selectedItem?.id === item.id
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setOpen(false);
                                    }}
                                >
                                    <img
                                        src={item.icon}
                                        className="icon"
                                        alt="Icon"
                                    />
                                    {item.label}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default TextInput;
