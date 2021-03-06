# gitbook-plugin-etoc-plus

[![npm](https://img.shields.io/npm/v/gitbook-plugin-etoc-plus.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-etoc-plus) [![npm](https://img.shields.io/npm/dm/gitbook-plugin-etoc-plus.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-etoc-plus) [![npm](https://img.shields.io/npm/dt/gitbook-plugin-etoc-plus.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-etoc-plus)

This plugin will add table of content (toc) to the page automatically.
When you build the book, it will insert a table of content automatically or to place where you insert `<!-- toc -->`. Sometimes you may want to disable toc on some page, just add `<!-- notoc -->` on the the markdown page.
## Features
- Supported custom anchors in headings. Example: ### TitleH3 {#title-example}
- Option «Auto translit» for anchors in headings (cyrrillic to latin)
- Work good with dark and light default gitbook themes.

## Example

```
# Heading 1
<!-- toc -->

## Heading 2.1
Some text

## Heading 2.2 {#any-anchor-name}
Some text
```

## Sample
![Capturef5193.png](http://static1.keep4u.ru/2017/06/19/Capturef5193.png)

## Config
Add `etoc-plus` in `book.json` is enough for most users.

```
{
  "plugin": ["etoc-plus"]
}
```

It will add toc automatically if the markdown page has `###` header3 (mindepth required to generate toc), and the maxdepth of toc is `####` header4 by default. You can also change the default parameter such as:
```
{
  "plugins": [
    "etoc-plus"
  ],
  "pluginsConfig": {
    "etoc-plus": {
      "mindepth": 3,
      "maxdepth": 4,
      "notoc": false,
      "header": 1,
      "translit": false
    }
  }
}
```

The configuration json schema is shown as following:
```
"gitbook": {
    "properties": {
        "mindepth": {
          "type": "number",
          "description": "minimal heading level required to generate toc",
          "default": 3
        },
        "maxdepth": {
          "type": "number",
          "description": "maximal heading level to generate toc",
          "default": 4
        },
        "notoc": {
          "type": "boolean",
          "description": "whether to generate toc automatically",
          "default": false
        },
        "header": {
          "type": "number",
          "description": "insert TOC after header",
          "default": 1
        },
        "translit": {
          "type": "boolean",
          "description": "auto translit cyrillic #anchors in headings to latin",
          "default": false
        },
    }
}
```

## LICENSE

MIT
