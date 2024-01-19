import './css/main.css'

import SvgLoader from './svg-loader'
import {SymbolSet} from './symbol-sets.ts'

window.addEventListener('DOMContentLoaded', async () => {
    const notifyContainer = document.getElementById('notify-container');
    notifyContainer?.addEventListener('animationend', _evt => {
        notifyContainer.classList.remove('notify-animate');
    });
    document.querySelector(".footer")?.classList.add("in-view");
    (document.getElementById('copy-button') as Element)
        .addEventListener('click', handleCopy);
    const filterEl = document.getElementById('filter-input') as HTMLInputElement;
    filterEl.value = '';
    filterEl.addEventListener('keyup', handleFilterInput);
    document.addEventListener('keypress', (event => {
        if (document.activeElement != filterEl) {
            filterEl.focus();
            filterEl.value += event.key
        }
    }))
    document.addEventListener('keyup', (event => {
        if (document.activeElement != filterEl && event.code == "Escape") {
            const e = new KeyboardEvent('keyup', { code: event.code, key: event.key, altKey: event.altKey });
            filterEl.dispatchEvent(e);
        }
    }))

    setSelectContainerVisibility();
    await setupFileSelect();
})

async function setupFileSelect() {
    const select = document.getElementById('file-select') as HTMLSelectElement;
    select.addEventListener('change', event => {
        loadSymbols((event.target as HTMLSelectElement).value)
    })
    await fetch(`${import.meta.env.BASE_URL}/symbol-sets.json`)
      .then(result => result.json())
      .then(symbolSets => {
          (symbolSets as Array<SymbolSet>).forEach((symbolSet: { file: string; display: string; }) => {
              const option = select.appendChild(document.createElement('option'))
              option.value = `${import.meta.env.BASE_URL}/${symbolSet.file}`
              option.text = symbolSet.display
          });
          loadSymbols(select.value)
      })
}

function loadSymbols(svgFile: string) {
    const container = (document.getElementById('symbol-container') as Element);
    while (container.hasChildNodes())
        container.removeChild(container.lastElementChild as Element);

    SvgLoader.load(svgFile)
        .then(svgDoc => {
            [...svgDoc.querySelectorAll('symbol')]
                .sort((lhs, rhs) => {
                    return lhs.id.localeCompare(rhs.id);
                })
                .forEach(symbol =>
                    container.appendChild(createIconContainer(symbol))
                        .addEventListener('click', evt => {
                            selectSymbol(evt.target as HTMLElement);
                        })
                )
            applyFilter();
        })
}

function createIconContainer(symbol: SVGSymbolElement) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    iconContainer.dataset['symbolId'] = symbol.id;

    const svgContainer = iconContainer.appendChild(document.createElement('div'));
    svgContainer.classList.add('svg-container');

    const svgElement = svgContainer.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    copyAttribute('viewBox', symbol, svgElement);

    const symbolClone = symbol?.cloneNode(true)!;
    svgElement.append(...symbolClone.childNodes);

    const label = iconContainer.appendChild(document.createElement('label'));
    label.setAttribute('for', symbol.id);
    label.innerText = symbol.id;

    return iconContainer;
}

function selectSymbol(element: HTMLElement) {
    const iconContainer = findIconContainer(element)!;
    const symbolId = (iconContainer as HTMLElement).dataset['symbolId']!;

    const selected = getSelectedSymbolIds();
    if (!selected.includes(symbolId)) {
        const container = (document.getElementById('select-icon-container') as Element);
        element = container.appendChild(iconContainer.cloneNode(true)) as HTMLElement;
        element.addEventListener('click', evt => {
            unselectSymbol(evt.target as HTMLElement)
        })
    }
    setSelectContainerVisibility();
}

function unselectSymbol(el: HTMLElement) {
    const iconContainer = findIconContainer(el);
    if (iconContainer == null) return;

    const container = (document.getElementById('select-icon-container') as Element);
    container.removeChild(iconContainer);
    setSelectContainerVisibility();
}

function handleFilterInput(event: KeyboardEvent) {
    if (event.code == "Escape")
        (document.getElementById('filter-input') as HTMLInputElement).value = '';
    applyFilter();
}

function applyFilter() {
    const input = document.getElementById('filter-input') as HTMLInputElement;
    const re = new RegExp(`^.*${input.value}.*$`);
    const container = (document.getElementById('symbol-container') as Element);
    [...container.children].map(child => {
        const element = child as HTMLElement;
        element.style.display = re.test(element.dataset['symbolId']!) ? '' : 'none';
    })
}

function handleCopy() {
    const selectIconContainer = document.getElementById('select-icon-container')!;
    if (selectIconContainer.childNodes.length <= 0) return;

    const xmlDocument = document.implementation.createDocument("", "", null);
    xmlDocument.insertBefore(xmlDocument.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8" standalone="no"'), xmlDocument.firstChild);

    const svgElement = xmlDocument.appendChild(xmlDocument.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    svgElement.setAttribute('viewBox', `0 0 16 16`); // This is arbitrary.

    selectIconContainer.childNodes.forEach(childNode => {
        const iconContainer = childNode as HTMLDivElement;
        const id = iconContainer.dataset['symbolId']!;
        const svg = iconContainer.firstChild?.firstChild!.cloneNode(true)!;

        const symbolElement = svgElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'symbol'));
        symbolElement.setAttribute('id', id);
        copyAttributes(svg as Element, symbolElement);
        symbolElement.append(...svg.childNodes)
    })

    const xmlSerializer = new XMLSerializer();
    navigator.clipboard.writeText(xmlSerializer.serializeToString(xmlDocument))
        .then(() => {
            (document.getElementById('notify-container') as Element)
                .classList.add('notify-animate');
        })
}

function getSelectedSymbolIds() {
    const container = (document.getElementById('select-icon-container') as Element);
    return [...container.children].map(child => (child as HTMLElement).dataset['symbolId']);
}

function setSelectContainerVisibility() {
    const container = (document.getElementById('select-container') as HTMLElement);
    if (getSelectedSymbolIds().length) {
        container.style.visibility = 'visible';
        container.style.height = 'auto';
    } else {
        container.style.visibility = 'hidden';
        container.style.height = '0';
    }
}

function findIconContainer(el: HTMLElement): Element | null {
    return el?.closest('.icon-container');
}

function copyAttribute(name: string, from: Element, to: Element) {
    const value = from.getAttribute(name);
    if (value)
        to.setAttribute(name, value);
}

function copyAttributes(from: Element, to: Element) {
    [...from.attributes].forEach(attribute => {
        to.setAttribute(attribute.name, attribute.value);
    });
}