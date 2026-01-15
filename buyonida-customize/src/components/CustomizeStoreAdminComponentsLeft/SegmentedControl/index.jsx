import "./index.scss";

function SegmentedControl({ options, value, onChange }) {
    const activeIndex = options.findIndex(o => o.value === value);

    return (
        <section id="segmentedControl">
            <div
                className="segmentIndicator"
                style={{
                    width: `calc((100% - 8px) / ${options.length})`,
                    transform: `translateX(${activeIndex * 100}%)`,
                }}
            />
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    className={`segmentItem ${value === opt.value ? "active" : ""}`}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </section>
    );
}

export default SegmentedControl;
