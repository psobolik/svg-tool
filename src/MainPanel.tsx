import IconList from "./IconList.tsx";
import React from "react";
import SymbolSet from "./SymbolSet.ts";
import SvgLoader from "./SvgLoader.ts";
import {debounce, download} from "./Helpers.ts";

interface MainPanelProps {
    filter: string;
    stroke: boolean;
    fill: boolean;
    selectedSymbolSet?: SymbolSet;
}

const MainPanel: React.FunctionComponent<MainPanelProps> = (props) => {
    const [availableSymbols, setAvailableSymbols] = React.useState<SVGSymbolElement[]>([]);
    const [selectedSymbols, setSelectedSymbols] = React.useState<SVGSymbolElement[]>([]);

    React.useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    })
    React.useEffect(() => {
        handleResize()
    },[availableSymbols, selectedSymbols, props.filter])
    React.useEffect(() => {
        loadSymbolSet()
    }, [props.selectedSymbolSet])
    React.useEffect(() => {
        applyFilter()
    }, [availableSymbols, props.filter])

    // This is a little rough, but it seems acceptable
    let _debounceTimerId = NaN;
    const handleResize = () => {
        _debounceTimerId = debounce(_debounceTimerId, () => {
            const root = document.getElementsByTagName("html")[0];
            const header = document.getElementsByTagName("header")[0];
            const footer = document.getElementsByTagName("footer")[0];

            // Calculate the space available for the <main> element (more or less)
            const mainHeight = root.clientHeight - header.offsetHeight - footer.offsetHeight - 75;

            // Set the <main> element's height
            const main = document.getElementsByTagName("main")[0];
            main.style.height = mainHeight + "px";

            // Set the symbol container's height what's available in the <main> element, but no less than 200px
            const selectContainer = document.getElementById("select-container")!;
            const divHeight = Math.floor(Math.max(200, mainHeight - selectContainer.clientHeight));
            const symbolContainer = document.getElementById("symbol-container")!;
            symbolContainer.style.height = divHeight + "px";
        }, 100);
    }

    const anySelected = () => selectedSymbols.length > 0;

    const loadSymbolSet = () => {
        if (!props.selectedSymbolSet) return;

        SvgLoader.load(props.selectedSymbolSet.url)
            .then(async svgDoc => {
                const symbols = [...svgDoc.querySelectorAll('symbol')]
                    .sort((lhs, rhs) => {
                        return lhs.id.localeCompare(rhs.id);
                    })
                setAvailableSymbols(symbols);
            })
    }

    const selectSymbolId = (symbolId: string) => {
        // Only select the symbol if it isn't already selected
        // (that is, not if another symbol with the same ID is selected)
        if (selectedSymbols.find(symbol => symbol.dataset.symbolId === symbolId)) return;

        const symbolContainer = document.getElementById("symbol-container");
        let symbol = symbolContainer?.querySelector(`svg[data-symbol-id="${symbolId}"]`) as SVGSymbolElement;
        symbol.id = symbolId;
        setSelectedSymbols([...selectedSymbols, symbol]);
    }

    const unselectSymbolId = (symbolId: string) => {
        const filtered = selectedSymbols.filter(symbol => symbol.id !== symbolId);
        setSelectedSymbols(filtered);
    }

    const applyFilter = () => {
        const re = new RegExp(`^.*${props.filter}.*$`);
        const symbolContainer = document.getElementById('symbol-container') as HTMLDivElement;
        [...symbolContainer.children].map(child => {
            const element = child as HTMLElement;
            element.style.display = re.test(element.dataset['symbolId']!) ? '' : 'none';
        })
    }

    const handleSave = () => {
        const getSaveDocument = () => {
            const svgNamespaceUri = 'http://www.w3.org/2000/svg';

            // Create an XML document with an svg root node
            const doc = document.implementation.createDocument(svgNamespaceUri, "svg", null);
            doc.insertBefore(doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8" standalone="no"'), doc.firstChild);

            // Append a copy of each selected symbol
            selectedSymbols.map(symbol => {
                const symbolElement = doc.documentElement.appendChild(doc.createElementNS(svgNamespaceUri, 'symbol'));
                symbolElement.id = symbol.id;
                const viewBox = symbol.getAttribute("viewBox");
                if (viewBox) symbolElement.setAttribute("viewBox", viewBox);
                symbolElement.append(...symbol.cloneNode(true).childNodes)
            })
            return doc;
        }
        if (!anySelected()) return;

        const xmlDocument = getSaveDocument();
        const xmlSerializer = new XMLSerializer();
        const svgString = xmlSerializer.serializeToString(xmlDocument);
        download([svgString], "symbols.svg", "image/svg+xml");
    }
    return <main>
        <div id="select-container" className={anySelected() ? "visible" : "invisible"}>
            <div className="label-container">
                <label htmlFor="save-button">Selected</label>
                <button id="save-button" title={"Download selected"} onClick={handleSave}>
                    <svg>
                        <path
                            d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                        <path
                            d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                    </svg>
                </button>
            </div>
            <IconList container_id="select-icon-container"
                      stroke={props.stroke}
                      fill={props.fill}
                      items={selectedSymbols}
                      selectSymbol={unselectSymbolId}
            />
        </div>
        <IconList container_id="symbol-container"
                  stroke={props.stroke}
                  fill={props.fill}
                  items={availableSymbols}
                  selectSymbol={selectSymbolId}
        />
    </main>

}
export default MainPanel;