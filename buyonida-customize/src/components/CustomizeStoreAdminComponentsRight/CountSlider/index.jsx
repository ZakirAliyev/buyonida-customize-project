import "./index.scss";

function CountSlider({ name, value, min, max, onChange, type = "none" }) {
    const percentage = ((value - min) / (max - min)) * 100;

    const getSuffix = () => {
        if (type === "px") return "px";
        if (type === "percentage") return "%";
        return "";
    };

    return (
        <section id="countSlider">
            <label id="countSliderName">{name}</label>

            <div className="sliderWrapper">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        background: `linear-gradient(
                            to right,
                            #32A6F9 0%,
                            #32A6F9 ${percentage}%,
                            #D3EAFB ${percentage}%,
                            #D3EAFB 100%
                        )`
                    }}
                />

                <div className="valueBox">
                    {value}
                    {type !== "none" && <span>{getSuffix()}</span>}
                </div>
            </div>
        </section>
    );
}

export default CountSlider;
