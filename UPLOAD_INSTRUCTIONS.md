# Add Basket Lab to your GitHub website

1. Extract basket-lab-github.zip.
2. Open https://github.com/federicosanchini/federicosanchini.github.io
3. At the repository root choose Add file > Upload files.
4. Drag BOTH the basket-lab folder and projects.js into the upload area. Upload the extracted files, not the ZIP. The folder belongs alongside your existing index.html.
5. Commit the upload to the branch your GitHub Pages site publishes from (normally main).
6. Wait for the GitHub Pages deployment to finish under Actions.
7. Open https://federicosanchini.github.io/basket-lab/

The updated projects.js preserves all projects in the publicly retrieved current file and adds Basket Lab as the first Quant project. Your existing app.js already renders the Live demo action from its demo field, so no changes to app.js or your homepage are needed. If you edited projects.js after this package was created, merge the new first entry into your newer file instead of replacing it.

The new card has a Live demo link; its details modal has Launch demo and Source code links. The app has a Back to portfolio link. If your browser shows the old project list after a successful deployment, reload without cache or use a private window.

## Upload layout

projects.js              (updated project list)
basket-lab/index.html    (the app page)
basket-lab/styles.css
basket-lab/app.js
basket-lab/engine.js
basket-lab/worker.js

Keep the five app files together in basket-lab. Existing root index.html, styles.css and app.js remain in place. No Streamlit server or extra dependencies are required: calculations run in each visitor's browser. This app does not depend on the earlier private hosted version.

## Validation

The pricing engine is unchanged from the numerically verified hosted app. Only module extensions/imports and the return-to-portfolio link were adapted. Module syntax, relative asset references and project list preservation were checked. Browser interaction testing was not performed.
