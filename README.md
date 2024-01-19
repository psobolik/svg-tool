# SVG Symbol Subset Tool (svg-tool)
Copyright (c) 2024 Paul Sobolik

----
Use this web app to select subsets of SVG symbols from Bootstrap and/or Font Awesome sets
and save them into a separate file. Actually, it copies the subset to the clipboard, which 
you have to paste into a new file. 

The app displays only one of the installed SVG symbol sets at a time. You can change the 
current symbol set with the drop down. You click a symbol to add it to the selected list and 
click a symbol in the selected list to remove it. You can select symbols from different sets.
You can enter text into the filter text box to filter the list of symbols by their name.

Although this app is processed by Vite, the symbol sets are stored in the `public` folder, 
so they aren't altered when the app is built. The app reads the list of symbol sets and their 
locations from `symbol-sets.json` which is also in the public folder. The idea is that you 
could modify the list of symbol sets without needing to rebuild the program. 