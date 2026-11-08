# -*- coding: utf-8 -*-
"""扫描技能包 A 形态，生成 catalog.json（供工作台使用）+ 控制台统计。"""
import json, os, re, sys

ROOT = r"C:\Users\you\deepseek\lawyer-skillpkg\律师AI技能包-v1.1"
A = os.path.join(ROOT, "A-技能格式")

def parse_front(text):
    if not text.startswith("---"):
        return {}
    m = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.S)
    if not m:
        return {}
    body = m.group(1)
    out, key, buf = {}, None, []
    for line in body.splitlines():
        if re.match(r"^[A-Za-z_][\w-]*\s*:", line):
            if key:
                out[key] = "\n".join(buf).strip()
            key, _, v = line.partition(":")
            key, buf = key.strip(), [v.strip()]
        elif key:
            buf.append(line.strip())
    if key:
        out[key] = "\n".join(buf).strip()
    for k, v in out.items():
        if len(v) > 1 and v[0] == v[-1] and v[0] in "'\"":
            out[k] = v[1:-1]
    return out

CJK = re.compile(r"[\u4e00-\u9fff]")
items = []
for cat in sorted(os.listdir(A)):
    catdir = os.path.join(A, cat)
    if not os.path.isdir(catdir):
        continue
    for sk in sorted(os.listdir(catdir)):
        skdir = os.path.join(catdir, sk)
        f = os.path.join(skdir, "SKILL.md")
        if not os.path.isfile(f):
            continue
        text = open(f, encoding="utf-8").read()
        fm = parse_front(text)
        files, nref, nsc, ntp, size = [], 0, 0, 0, len(text)
        for dp, _, fns in os.walk(skdir):
            for fn in fns:
                p = os.path.join(dp, fn)
                rel = os.path.relpath(p, skdir)
                files.append(rel)
                top = rel.split(os.sep)[0]
                if top == "references": nref += 1
                elif top == "scripts": nsc += 1
                elif top in ("templates", "template"): ntp += 1
                try: size += os.path.getsize(p)
                except OSError: pass
        desc = fm.get("description", "")
        items.append({
            "id": sk,
            "name": fm.get("name", sk),
            "category": cat,
            "categoryShort": re.sub(r"^\d+-", "", cat),
            "description": desc,
            "lang": "zh" if CJK.search(desc) else "en",
            "path": os.path.relpath(skdir, ROOT),
            "fileCount": len(files),
            "hasScripts": nsc > 0,
            "hasTemplates": ntp > 0,
            "hasReferences": nref > 0,
            "totalBytes": size,
            "hasScriptVendor": any(x.lower().endswith((".py", ".js", ".mjs")) for x in files),
        })

out = {"source": "律师AI技能包-v1.1", "count": len(items), "items": items}
dst = os.path.join(os.path.dirname(A), "catalog.json")
json.dump(out, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

from collections import Counter, defaultdict
c = Counter(i["category"] for i in items)
lang = Counter(i["lang"] for i in items)
print("total:", len(items), "| lang:", dict(lang), "| with scripts:", sum(i["hasScripts"] for i in items))
print("total files:", sum(i["fileCount"] for i in items), "| total MB:", round(sum(i["totalBytes"] for i in items)/1e6, 2))
print()
for cat, n in sorted(c.items()):
    sub = [i for i in items if i["category"] == cat]
    z = sum(1 for i in sub if i["lang"] == "zh")
    print(f"{cat:28s} {n:3d}  (zh {z})")
print("\nwrote", dst)
