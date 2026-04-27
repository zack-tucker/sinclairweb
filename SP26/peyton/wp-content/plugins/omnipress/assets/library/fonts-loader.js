class CustomFontFace {
    constructor(t) {
        (this.fontsList = this.fetchData(t)),
            (this.isAlreadyLoaded = !1),
            (this.isIframe = !1),
            (this.usedFontsList = []);
    }

    async fetchData(t) {
        const { wp = {} } = window || {};

        const s = await wp.apiFetch({
            path: t,
            method: 'GET',
        });
        this.fontsList = s;
    }

    listFontFamilies() {
        const t = [...document.fonts.values()];
        const s = t.map((t) => t.family);
        return [...new Set(s)];
    }

    async loadGoogleFonts(t, s = 'normal', i = '400') {
        if (
            t &&
            (this.usedFontsList.push({
                name: t,
                style: s,
                weight: i,
            }),
            Object.keys(this.fontsList).length === 0 &&
                (this.fontsList = this.fetchData('omnipress/v1/fonts')),
            this.fontsList)
        ) {
            const e = `url(${this.fontsList[t].files[s || 'normal']?.[i || '400'] || this.fontsList[t].files.normal?.['400']})`;
            const o = document.querySelector('iframe');
            if (
                (o
                    ? ((this.isIframe = !0),
                      (this.isAlreadyLoaded = o.contentWindow.document.fonts.check(
                          `10px ${t + i}`
                      )))
                    : ((this.isIframe = !1),
                      (this.isAlreadyLoaded = document.fonts.check(`10px ${t + i}`))),
                !this.isAlreadyLoaded)
            ) {
                if (this.isIframe) {
                    const a = new FontFace(t, e);
                    const { document: n } = o.contentWindow;
                    n.fonts.add(a), await a.load();
                } else if (!this.isIframe) {
                    const f = new FontFace(t + (i || '400'), e);
                    document.fonts.add(f), await f.load();
                }
            }
        }
    }
}
const customFonts = new CustomFontFace('/omnipress/v1/fonts');
