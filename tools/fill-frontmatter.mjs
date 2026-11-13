// 构建前运行（只在 CI 的临时检出目录里改文件，不会改到你本地的笔记）：
// 给 _posts 里没写全文件头的文章补上默认值，这样在 Obsidian 里可以只写正文。
//   title    ← 文件名
//   date     ← 该文件首次提交的时间
//   abbrlink ← 由文件名算出的固定短链接（文件名不变，链接就不变）
//   toc      ← true
//   首段之后自动加 <!-- more -->，首页只显示摘要
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execFileSync } from "node:child_process"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const POSTS = path.join(ROOT, process.argv[2] ?? "content/_posts")

const pad = (n) => String(n).padStart(2, "0")
const fmt = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

function firstCommitDate(file) {
  try {
    const out = execFileSync("git", ["log", "--follow", "--diff-filter=A", "--format=%aI", "--", file], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim().split("\n").filter(Boolean)
    if (out.length) return new Date(out[out.length - 1])
  } catch {}
  return fs.statSync(file).mtime
}

const split = (text) => {
  const m = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  return m ? { fm: m[1], body: text.slice(m[0].length) } : { fm: "", body: text.replace(/^﻿/, "") }
}
const has = (fm, key) => new RegExp(`^${key}\\s*:`, "m").test(fm)

const files = fs.readdirSync(POSTS, { recursive: true })
  .map((f) => path.join(POSTS, f))
  .filter((f) => f.endsWith(".md") && fs.statSync(f).isFile())
  .sort()

const parsed = files.map((file) => ({ file, ...split(fs.readFileSync(file, "utf8")) }))
const used = new Set(parsed.map((p) => p.fm.match(/^abbrlink\s*:\s*['"]?([\w-]+)/m)?.[1]).filter(Boolean))

let changed = 0
for (const p of parsed) {
  const name = path.basename(p.file, ".md")
  const extra = []
  if (!has(p.fm, "title")) extra.push(`title: ${JSON.stringify(name)}`)
  if (!has(p.fm, "date")) extra.push(`date: ${fmt(firstCommitDate(p.file))}`)
  // 已有 abbrlink 的是旧文章或已经处理过的文章，其余字段保持原样
  const isNew = !has(p.fm, "abbrlink")
  let body = p.body
  if (isNew) {
    const hash = crypto.createHash("sha1").update(name).digest("hex")
    let len = 4
    while (used.has(hash.slice(0, len))) len++
    used.add(hash.slice(0, len))
    extra.push(`abbrlink: ${hash.slice(0, len)}`)
    if (!has(p.fm, "toc")) extra.push("toc: true")
    if (!/<!--\s*more\s*-->/.test(body)) {
      const parts = body.replace(/^\s+/, "").split(/\r?\n\s*\r?\n/)
      if (parts.length > 2) body = [parts[0], "<!-- more -->", ...parts.slice(1)].join("\n\n")
    }
  }
  if (!extra.length && body === p.body) continue
  const fm = [p.fm.trim(), ...extra].filter(Boolean).join("\n")
  fs.writeFileSync(p.file, `---\n${fm}\n---\n\n${body}`)
  changed++
  console.log(`filled: ${path.relative(ROOT, p.file)}${extra.length ? "  +" + extra.map((e) => e.split(":")[0]).join(",") : ""}`)
}
console.log(`${files.length} posts checked, ${changed} filled`)
