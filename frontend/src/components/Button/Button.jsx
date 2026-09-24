import "./Button.css";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    loading = false,
    className = ""
}) => {

    return (
        <button
            type={type}
            className={`custom-btn ${variant} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
        >

            {loading ? "Loading..." : children}

        </button>
    );
};

export default Button;