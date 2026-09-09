"""Rebuild static previews without executing notebooks.
Install dependencies: python -m pip install nbconvert
Run from any directory: python scripts/build_notebook_previews.py
"""
from pathlib import Path
from html import escape
from urllib.parse import quote
import nbformat
from nbconvert import HTMLExporter

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets' / 'previews'
DEST.mkdir(parents=True, exist_ok=True)
exporter = HTMLExporter(template_name='lab')
exporter.sanitize_html = True
exporter.exclude_input_prompt = True
exporter.exclude_output_prompt = True
for source in sorted((ROOT / 'assets' / 'notebooks').glob('*.ipynb')):
    notebook = nbformat.read(source, as_version=4)
    # Static previews never execute cells or embedded output JavaScript/widgets.
    for cell in notebook.cells:
        for output in cell.get('outputs', []):
            data = output.get('data', {})
            data.pop('application/javascript', None)
            data.pop('application/vnd.jupyter.widget-view+json', None)
    notebook.metadata.pop('widgets', None)
    title = source.stem.replace('_', ' ')
    body, _ = exporter.from_notebook_node(notebook, resources={'metadata': {'name': title}})
    banner = f'''<nav class="portfolio-bar" aria-label="Notebook navigation">
<a href="../../index.html#projects">← All projects</a>
<strong>{escape(title)}</strong>
<a href="../notebooks/{quote(source.name)}" download>Download notebook ↓</a>
<span>Read-only preview · Code and saved outputs. Download to run locally.</span>
</nav>'''
    css = '''<style>
.portfolio-bar { display:flex; flex-wrap:wrap; align-items:center; gap:16px; padding:20px; background:#101419; color:#f1f4f7; font:16px/1.5 system-ui,sans-serif; }
.portfolio-bar a { color:#8cf2c6; text-decoration:underline; }
.portfolio-bar span { flex-basis:100%; font-size:14px; color:#bac3cd; }
body { margin:0; } .jp-Notebook { max-width:1200px; margin:auto; }
</style>'''
    body = body.replace('</head>', css + '</head>')
    start = body.index('>', body.index('<body')) + 1
    body = body[:start] + banner + body[start:]
    target = DEST / (source.stem + '.html')
    target.write_text(body, encoding='utf-8')
    print(f'{target.relative_to(ROOT)} ({target.stat().st_size:,} bytes)')
