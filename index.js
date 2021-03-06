var toc = require('markdown-toc');
var slug = require('github-slugid');
var eol = require('os').EOL;
var translit = require('translit')({
  'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g', 'Д': 'D', 'д': 'd',
  'Е': 'E', 'е': 'e', 'Ё': 'E', 'ё': 'e', 'Ж': 'Zh', 'ж': 'zh', 'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i',
  'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k', 'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n',
  'О': 'O', 'о': 'o', 'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
  'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts', 'Ч': 'Ch',
  'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'Ь': '', 'ь': '', 'Ы': 'Y', 'ы': 'y',
  'Ъ': '', 'ъ': '', 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu', 'Я': 'Ya', 'я': 'ya'
});

module.exports = {
  book: {
    assets: './assets',
    css: [
      "etoc-plus.css"
    ],
    js: [
      "etoc-plus.js"
    ]
  },
  hooks: {
    "page:before": function (page) {
      if (this.output.name != 'website') return page;
      var _notoc = this.config.get('pluginsConfig.etoc-plus.notoc') || false;
      var _translit = this.config.get('pluginsConfig.etoc-plus.translit') || false;
      var _existstoc = /^\s*<!-- toc -->\s*$/im.test(page.content);
      var _existsnotoc = /^\s*<!-- notoc -->\s*$/im.test(page.content);
      if (_existsnotoc) return page;
      if (_notoc && (!_existstoc)) return page;

      if(_translit) {
        page.content = page.content.replace(/(#{1,6}\s(.*?[^\}|\r\n]))$/mg, function(str, p1, p2, offset, s) {
             if(p2) return p1+' {#'+slug(translit(p2))+'}';
             return s;
        });
      }

      var _mindepth = this.config.get('pluginsConfig.etoc-plus.mindepth') || 3;
      var _maxdepth = this.config.get('pluginsConfig.etoc-plus.maxdepth') || 4;
      if (_mindepth > _maxdepth) {
        console.error("!!!mindepth should be no more than maxdepth");
        return page;
      }
      var re = new RegExp('^#{' + _mindepth + '}[^#]', 'm');
      if (!re.test(page.content)) return page;

      var _header = this.config.get('pluginsConfig.etoc-plus.header') || 1;
      var headerReg = new RegExp('(^#{' + _header + '}[^#].*)', 'm');
      if (!(_notoc || _existstoc)) {
        // insert <!-- toc --> after the header _header element
        page.content = page.content.replace(headerReg, '$1' + eol + '<!-- toc -->' + eol);
      }

      // markdown-toc do not pass options to generate,
      // we should escape <!-- toc --> not beginning with whitespace
      page.content = page.content.replace(/^(\S.*)<!-- toc -->(.*)$/m, '$1<!-- rawtoc -->$2');

      page.content = toc.insert(page.content, {
        slugify: function (str) {
        var rexp = new RegExp('^.*\{\#(.*)\}$', 'm');
        str = str.replace(rexp, '$1');
        if(_translit) str = translit(str);
        return slug(str);
        },
        maxdepth: _maxdepth
      });

      // replace anchors from toc
      page.content = page.content.replace(/\s\{(.*)\}\]/mg, ']');
      if(_translit) page.content = page.content.replace(/\s\{(.*)\}/mg, translit('$&'));
      page.content = page.content.replace('<!-- rawtoc -->', '<!-- toc -->');
      return page;
    },

    "page": function (page) {
      // add toc id and class
      page.content = page.content.replace('<!-- toc -->', '<!-- toc --><div id="toc" class="toc">' + eol);
      page.content = page.content.replace('<!-- tocstop -->', eol + '</div><!-- tocstop -->');
      return page;
    }
  }
};
