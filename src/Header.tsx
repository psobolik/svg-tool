import SymbolSet from "./SymbolSet.ts";
import React from "react";

interface HeaderProps {
    selectedSymbolSet?: SymbolSet;
    setSelectedSymbolSet: (symbolSet: SymbolSet) => void;
    filter: string;
    setFilter: (filter: string) => void;
    stroke: boolean;
    setStroke: (state: boolean) => void;
    fill: boolean;
    setFill: (state: boolean) => void;
}

const Header: React.FunctionComponent<HeaderProps> = (props) => {
    const handleSelectSymbolSet = (select: HTMLSelectElement) => {
        // The select element's value is the url of the selected option, but we need to
        // find the option to get the display value as well.
        const option = select.querySelector(`option[value='${select.value}']`) as HTMLOptionElement;
        const symbolSet = new SymbolSet(option.text, option.value);
        props.setSelectedSymbolSet(symbolSet);
    }

    const onFilterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code == "Escape") props.setFilter("");
    }

    return <header>
        <div id="header">
            <span className="heading">SVG Symbol Subset Tool</span>
            <label htmlFor="filter-input">Filter:&ensp;</label>
            <input id="filter-input" type="text" placeholder="Filter"
                   value={props.filter}
                   onChange={e => props.setFilter(e.target.value)}
                   onKeyDown={e => onFilterKey(e)}
            />
        </div>
        <div id="controls">
            <div>
                <label htmlFor="symbol-set-list">Symbol Set:&ensp;</label>
                <select id="symbol-set-list"
                        value={props.selectedSymbolSet?.url}
                        onChange={event => {
                            handleSelectSymbolSet(event.target as HTMLSelectElement)
                        }}>
                    {SymbolSet.symbolSets?.map((symbolSet, key) => {
                        return <option key={key} value={symbolSet.url}> {symbolSet.display} </option>
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="stroke">Stroke </label>
                <input type="checkbox" id="stroke" checked={props.stroke}
                       onChange={e => props.setStroke(e.target.checked)}
                />
                &emsp;
                <label htmlFor="fill">Fill </label>
                <input type="checkbox" id="fill" checked={props.fill}
                       onChange={e => props.setFill(e.target.checked)}/>
            </div>
        </div>
    </header>
}
export default Header;
