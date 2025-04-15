import './css/app.css';

import React from "react";
import Header from "./Header";
import MainPanel from "./MainPanel.tsx";
import Footer from "./Footer";
import SymbolSet from "./SymbolSet";

const App: React.FunctionComponent = () => {
    const [filter, setFilter] = React.useState<string>("");
    const [selectedSymbolSet, setSelectedSymbolSet] = React.useState<SymbolSet | undefined>();
    const [stroke, setStroke] = React.useState<boolean>(false);
    const [fill, setFill] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (SymbolSet.symbolSets?.length) setSelectedSymbolSet(SymbolSet.symbolSets[0]);
    }, [SymbolSet.symbolSets])

    return (<>
        <div id="container">
            <Header filter={filter}
                    setFilter={setFilter}
                    stroke={stroke}
                    setStroke={setStroke}
                    fill={fill}
                    setFill={setFill}
                    selectedSymbolSet={selectedSymbolSet}
                    setSelectedSymbolSet={setSelectedSymbolSet}/>
            <MainPanel selectedSymbolSet={selectedSymbolSet} stroke={stroke} fill={fill} filter={filter}/>
            <Footer/>
        </div>
    </>)
}
export default App;