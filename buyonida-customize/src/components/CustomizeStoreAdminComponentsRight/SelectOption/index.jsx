import "./index.scss";
import arrow from "/src/assets/icons/arrow.svg";

function SelectOption({ name, props }) {
    return (
        <section id="selectOption">
            <label id="selectOptionName">{name}</label>

            <div className="selectWrapper">
                <select id="selectNative">
                    {props.map((item, index) => (
                        <option key={index} value={item}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                    ))}
                </select>

                <img src={arrow} className="customArrow" alt="arrow" />
            </div>
        </section>
    );
}

export default SelectOption;
