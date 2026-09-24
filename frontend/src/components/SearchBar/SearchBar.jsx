import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({
    onSearch,
    placeholder = "Search recipes..."
}) => {

    const [searchValue, setSearchValue] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        onSearch(searchValue.trim());

    };

    return (
        <form
            className="search-form"
            onSubmit={handleSubmit}
        >

            <div className="search-wrapper">

                <span className="search-icon">
                    🔍
                </span>

                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={placeholder}
                />

                <button type="submit">
                    Search
                </button>

            </div>

        </form>
    );
};

export default SearchBar;