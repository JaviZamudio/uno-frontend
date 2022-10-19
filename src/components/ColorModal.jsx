function ColorModal({ onClick, compRef }) {
    return <div className="color-Modal" ref={compRef} style={{ display: "none" }}>
        <div className="colors">
            <button className="color-red" onClick={() => onClick("red")}>RED</button>
            <button className="color-blue" onClick={() => onClick("blue")}>BLUE</button>
            <button className="color-green" onClick={() => onClick("green")}>GREEN</button>
            <button className="color-yellow" onClick={() => onClick("yellow")}>YELLOW</button>
        </div>
    </div>;
}

export default ColorModal;