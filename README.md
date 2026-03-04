| Language |
|----------|
| [**English**](README.md) |
| [**Русский**](README.ru.md) |


[![npm version](https://badge.fury.io/js/nodebb-plugin-upload-plus.svg?nocache=1)](https://badge.fury.io/js/nodebb-plugin-upload-plus)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-upload-plus.svg)](nodebb-plugin-upload-plus)

# 📁 Upload Plus — Advanced Upload Plugin for NodeBB

**Upload Plus** supercharges NodeBB’s file uploader:



- Stores files in **scalable sub-folders** (hash or date) so you never hit a single-directory bottleneck.  
- Optionally **auto-converts images to WebP**, shrinking size without quality loss.  
- Fully translated into **English and Russian**.

---

## 🚀 Quick Start

```bash
cd /path/to/nodebb
npm install nodebb-plugin-upload-plus
```

Activate in ACP → Plugins → Upload Plus.

---

## ⚙️ Settings

Visit ACP → Plugins → Upload Plus

| Option | Values | Default |
|---|---|---|
| **Path strategy** | `hash` – sub-folders by file-name hash<br>`date` – YYYY/MM/DD | `hash` |
| **Directory depth** | `2` or `3` levels (hash only) | `2` |
| **Convert images to WebP** | on / off | `off` |

---

## 📂 Storage Layout

| Strategy | example |
|---|---|
| **none** | `uploads/files/filename.ext` | 
| **hash 2** | `uploads/files/a1/b2/filename.ext` |
| **hash 3** | `uploads/files/a1/b2/c3/filename.ext` | 
| **date** | `uploads/files/2024/09/02/filename.ext` |

SHA-256 of the file name → first 2 or 3 chars become folder names.

---

## 🖼️ WebP Conversion

- Runs **only on images**.  
- Produces `filename.webp` next to the original.  
- Returns the **WebP URL** to the client.  
- Quality set to 83 %.

---

## 🌐 Languages

Bundled translations:

- English (en-GB)  
- Russian (ru)

ACP language is taken from NodeBB’s locale.

---

## 🛠️ Development / Fork

```bash
git clone https://github.com/mysteren/nodebb-plugin-upload-plus.git
cd nodebb-plugin-upload-plus
npm install
npm link          # inside NodeBB folder
```

---

## 📄 License

MIT © 2025 Upload Plus Contributors
