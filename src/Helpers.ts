// Only execute a function some time after the last request
export const debounce = (timerId: number, fn: () => void, waitMillis: number): number => {
    clearTimeout(timerId);
    return setTimeout(() => {
        fn.apply(null)
    }, waitMillis);
}

// Function to download data to a file
// https://stackoverflow.com/a/30832210/20771004, with some tweaks
export function download(data: BlobPart[], filename: string, type: string) {
    const a = document.createElement("a");
    const file = new Blob(data, {type: type});
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
