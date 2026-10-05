# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> visual regression — skeuomorphic >> calendar (skeuomorphic)
- Location: packages\react\tests\visual.spec.ts:70:7

# Error details

```
Error: expect(locator).toHaveScreenshot(expected) failed

Locator: locator('article').first()
  4833 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: calendar-skeuomorphic.png

Call log:
  - Expect "toHaveScreenshot(calendar-skeuomorphic.png)" locator('article').first() with timeout 30000ms
    - verifying given screenshot expectation
  - waiting for locator('article').first()
    - locator resolved to <article class="docs-page">…</article>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - 4833 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - waiting for locator('article').first()
    - locator resolved to <article class="docs-page">…</article>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - captured a stable screenshot
  - 4833 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - navigation "Sidebar" [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]:
            - generic [ref=e9]: Getting Started
            - button "Introduction" [ref=e10]
            - button "Installation" [ref=e11]
          - generic [ref=e12]:
            - generic [ref=e13]: Theming
            - button "Theming" [ref=e14]
            - button "Presets" [ref=e15]
            - button "Theme Builder" [ref=e16]
          - generic [ref=e17]:
            - generic [ref=e18]: Components
            - button "Button" [ref=e19]
            - button "Card" [ref=e20]
            - button "Input" [ref=e21]
            - button "Dialog" [ref=e22]
            - button "Loader" [ref=e23]
            - button "Stat Card" [ref=e24]
            - button "Charts" [ref=e25]
            - button "Select" [ref=e26]
            - button "Combobox" [ref=e27]
            - button "Tabs" [ref=e28]
            - button "Tooltip" [ref=e29]
            - button "Popover" [ref=e30]
            - button "Toast" [ref=e31]
            - button "Checkbox" [ref=e32]
            - button "Radio Group" [ref=e33]
            - button "Switch" [ref=e34]
            - button "Textarea" [ref=e35]
            - button "Slider" [ref=e36]
            - button "Color Picker" [ref=e37]
            - button "Form Field" [ref=e38]
            - button "Avatar" [ref=e39]
            - button "Badge" [ref=e40]
            - button "Separator" [ref=e41]
            - button "Accordion" [ref=e42]
            - button "Collapsible" [ref=e43]
            - button "Calendar" [ref=e44]
            - button "DatePicker" [ref=e45]
            - button "DateRangePicker" [ref=e46]
            - button "TimePicker" [ref=e47]
            - button "TimeRangePicker" [ref=e48]
            - button "Dropdown Menu" [ref=e49]
            - button "Alert" [ref=e50]
            - button "Alert Dialog" [ref=e51]
            - button "Progress" [ref=e52]
            - button "Sheet" [ref=e53]
            - button "Drawer" [ref=e54]
            - button "Modal" [ref=e55]
            - button "Tag Input" [ref=e56]
            - button "Scroll Area" [ref=e57]
            - button "File Upload" [ref=e58]
            - button "Breadcrumb" [ref=e59]
            - button "Tree View" [ref=e60]
            - button "Timeline" [ref=e61]
            - button "Pagination" [ref=e62]
            - button "App Shell" [ref=e63]
            - button "Data Table" [ref=e64]
            - button "Chart Card" [ref=e65]
            - button "Form Builder" [ref=e66]
            - button "Command Palette" [ref=e67]
            - button "Notification Center" [ref=e68]
            - button "Wizard" [ref=e69]
          - generic [ref=e70]:
            - generic [ref=e71]: Blocks
            - button "Dashboard" [ref=e72]
            - button "Auth" [ref=e73]
            - button "Settings" [ref=e74]
            - button "Pricing" [ref=e75]
    - generic [ref=e76]:
      - banner [ref=e77]:
        - link "srui Supercomponent React UI" [ref=e78] [cursor=pointer]:
          - /url: /
          - generic [ref=e79]: srui
          - generic [ref=e80]: Supercomponent React UI
        - generic [ref=e82]:
          - textbox "Search docs" [ref=e84]:
            - /placeholder: Search docs…
          - generic [ref=e85]:
            - group "Visual preset" [ref=e86]:
              - button "flat" [pressed] [ref=e87]
              - button "glass" [ref=e88]
              - button "neumorphic" [ref=e89]
              - button "skeuomorphic" [ref=e90]
            - group "Color scheme" [ref=e91]:
              - button "Light" [ref=e92]
              - button "Dark" [ref=e93]
              - button "System" [pressed] [ref=e94]
          - button "GitHub repository" [ref=e95]
      - main [ref=e96]:
        - article [ref=e97]:
          - heading "Calendar" [level=1] [ref=e98]
          - paragraph [ref=e99]: Month-grid calendar engine with full keyboard control — the core behind every srui date picker.
          - paragraph [ref=e100]:
            - code [ref=e101]: Calendar
            - text: "is the inline month grid: day/week arrows, Home/End week jumps, PageUp/PageDown month navigation, and"
            - code [ref=e102]: aria-current
            - text: today marking. Values are plain
            - code [ref=e103]: YYYY-MM-DD
            - text: strings — no Date objects, no date library.
          - heading "Installation" [level=2] [ref=e104]
          - code [ref=e106]: "import { Calendar } from \"@iammikz/srui\";"
          - heading "Usage" [level=2] [ref=e107]
          - generic [ref=e108]:
            - generic [ref=e111]:
              - generic [ref=e112]:
                - button "Previous month" [ref=e113]
                - generic [ref=e116]: October 2026
                - button "Next month" [ref=e117]
              - grid "Due date" [ref=e120]:
                - row [ref=e121]:
                  - columnheader "Su" [ref=e122]
                  - columnheader "Mo" [ref=e123]
                  - columnheader "Tu" [ref=e124]
                  - columnheader "We" [ref=e125]
                  - columnheader "Th" [ref=e126]
                  - columnheader "Fr" [ref=e127]
                  - columnheader "Sa" [ref=e128]
                - row [ref=e129]:
                  - gridcell [disabled] [ref=e130]
                  - gridcell [disabled] [ref=e131]
                  - gridcell [disabled] [ref=e132]
                  - gridcell [disabled] [ref=e133]
                  - gridcell [ref=e134]:
                    - button "1" [ref=e135]
                  - gridcell [ref=e136]:
                    - button "2" [ref=e137]
                  - gridcell [ref=e138]:
                    - button "3" [ref=e139]
                - row [ref=e140]:
                  - gridcell [ref=e141]:
                    - button "4" [ref=e142]
                  - gridcell [selected] [ref=e143]:
                    - button "5" [ref=e144]
                  - gridcell [ref=e145]:
                    - button "6" [ref=e146]
                  - gridcell [ref=e147]:
                    - button "7" [ref=e148]
                  - gridcell [ref=e149]:
                    - button "8" [ref=e150]
                  - gridcell [ref=e151]:
                    - button "9" [ref=e152]
                  - gridcell [ref=e153]:
                    - button "10" [ref=e154]
                - row [ref=e155]:
                  - gridcell [ref=e156]:
                    - button "11" [ref=e157]
                  - gridcell [ref=e158]:
                    - button "12" [ref=e159]
                  - gridcell [ref=e160]:
                    - button "13" [ref=e161]
                  - gridcell [ref=e162]:
                    - button "14" [ref=e163]
                  - gridcell [ref=e164]:
                    - button "15" [ref=e165]
                  - gridcell [ref=e166]:
                    - button "16" [ref=e167]
                  - gridcell [ref=e168]:
                    - button "17" [ref=e169]
                - row [ref=e170]:
                  - gridcell [ref=e171]:
                    - button "18" [ref=e172]
                  - gridcell [ref=e173]:
                    - button "19" [ref=e174]
                  - gridcell [ref=e175]:
                    - button "20" [ref=e176]
                  - gridcell [ref=e177]:
                    - button "21" [ref=e178]
                  - gridcell [ref=e179]:
                    - button "22" [ref=e180]
                  - gridcell [ref=e181]:
                    - button "23" [ref=e182]
                  - gridcell [ref=e183]:
                    - button "24" [ref=e184]
                - row [ref=e185]:
                  - gridcell [ref=e186]:
                    - button "25" [ref=e187]
                  - gridcell [ref=e188]:
                    - button "26" [ref=e189]
                  - gridcell [ref=e190]:
                    - button "27" [ref=e191]
                  - gridcell [ref=e192]:
                    - button "28" [ref=e193]
                  - gridcell [ref=e194]:
                    - button "29" [ref=e195]
                  - gridcell [ref=e196]:
                    - button "30" [ref=e197]
                  - gridcell [ref=e198]:
                    - button "31" [ref=e199]
                - row [ref=e200]:
                  - gridcell [disabled] [ref=e201]
                  - gridcell [disabled] [ref=e202]
                  - gridcell [disabled] [ref=e203]
                  - gridcell [disabled] [ref=e204]
                  - gridcell [disabled] [ref=e205]
                  - gridcell [disabled] [ref=e206]
                  - gridcell [disabled] [ref=e207]
              - button "Today" [ref=e209]
            - button "View code" [ref=e211]
          - heading "Props" [level=2] [ref=e212]
          - table [ref=e213]:
            - rowgroup [ref=e214]:
              - row [ref=e215]:
                - columnheader "Prop" [ref=e216]
                - columnheader "Type" [ref=e217]
                - columnheader "Default" [ref=e218]
                - columnheader "Description" [ref=e219]
            - rowgroup [ref=e220]:
              - row [ref=e221]:
                - cell [ref=e222]:
                  - code [ref=e223]: value
                - cell [ref=e224]:
                  - code [ref=e225]: string
                  - text: (
                  - code [ref=e226]: YYYY-MM-DD
                  - text: )
                - cell "—" [ref=e227]
                - cell "Selected day (controlled)" [ref=e228]
              - row [ref=e229]:
                - cell [ref=e230]:
                  - code [ref=e231]: defaultValue
                - cell [ref=e232]:
                  - code [ref=e233]: string
                - cell "—" [ref=e234]
                - cell "Initial selected day" [ref=e235]
              - row [ref=e236]:
                - cell [ref=e237]:
                  - code [ref=e238]: onSelect
                - cell [ref=e239]:
                  - code [ref=e240]: "(date: string) => void"
                - cell "—" [ref=e241]
                - cell "Fires on day pick" [ref=e242]
              - row [ref=e243]:
                - cell [ref=e244]:
                  - code [ref=e245]: month
                - cell [ref=e246]:
                  - code [ref=e247]: string
                  - text: (
                  - code [ref=e248]: YYYY-MM
                  - text: )
                - cell "selection or today" [ref=e249]
                - cell "Viewed month (controlled)" [ref=e250]
              - row [ref=e251]:
                - cell [ref=e252]:
                  - code [ref=e253]: defaultMonth
                - cell [ref=e254]:
                  - code [ref=e255]: string
                - cell "—" [ref=e256]
                - cell "Initial viewed month" [ref=e257]
              - row [ref=e258]:
                - cell [ref=e259]:
                  - code [ref=e260]: onMonthChange
                - cell [ref=e261]:
                  - code [ref=e262]: "(month: string) => void"
                - cell "—" [ref=e263]
                - cell "Fires on header navigation" [ref=e264]
              - row [ref=e265]:
                - cell [ref=e266]:
                  - code [ref=e267]: min
                  - text: /
                  - code [ref=e268]: max
                - cell [ref=e269]:
                  - code [ref=e270]: string
                - cell "—" [ref=e271]
                - cell "Selectable day bounds" [ref=e272]
              - row [ref=e273]:
                - cell [ref=e274]:
                  - code [ref=e275]: disabledDates
                - cell [ref=e276]:
                  - code [ref=e277]: "(date: string) => boolean"
                - cell "—" [ref=e278]
                - cell "Arbitrary day disabling (holidays, closed days)" [ref=e279]
              - row [ref=e280]:
                - cell [ref=e281]:
                  - code [ref=e282]: weekStartsOn
                - cell [ref=e283]:
                  - code [ref=e284]: 0 | 1
                - cell [ref=e285]:
                  - code [ref=e286]: "0"
                - cell "Sunday-first (default) or Monday-first" [ref=e287]
              - row [ref=e288]:
                - cell [ref=e289]:
                  - code [ref=e290]: showToday
                - cell [ref=e291]:
                  - code [ref=e292]: boolean
                - cell [ref=e293]:
                  - code [ref=e294]: "true"
                - cell "Today shortcut under the grid" [ref=e295]
              - row [ref=e296]:
                - cell [ref=e297]:
                  - code [ref=e298]: selectedRange
                - cell [ref=e299]:
                  - code [ref=e300]: "{ from?, to?, hover? }"
                - cell "—" [ref=e301]
                - cell [ref=e302]:
                  - text: Range overlay (driven by
                  - code [ref=e303]: DateRangePicker
                  - text: )
          - heading "Examples" [level=2] [ref=e304]
          - heading "Bounded + Monday-first" [level=3] [ref=e305]
          - generic [ref=e306]:
            - generic [ref=e309]:
              - generic [ref=e310]:
                - button "Previous month" [disabled]
                - generic [ref=e311]: October 2026
                - button "Next month" [ref=e312]
              - grid "Bounded calendar" [ref=e315]:
                - row [ref=e316]:
                  - columnheader "Mo" [ref=e317]
                  - columnheader "Tu" [ref=e318]
                  - columnheader "We" [ref=e319]
                  - columnheader "Th" [ref=e320]
                  - columnheader "Fr" [ref=e321]
                  - columnheader "Sa" [ref=e322]
                  - columnheader "Su" [ref=e323]
                - row [ref=e324]:
                  - gridcell [disabled] [ref=e325]
                  - gridcell [disabled] [ref=e326]
                  - gridcell [disabled] [ref=e327]
                  - gridcell "1" [ref=e328]:
                    - button "1" [disabled]
                  - gridcell "2" [ref=e329]:
                    - button "2" [disabled]
                  - gridcell "3" [ref=e330]:
                    - button "3" [disabled]
                  - gridcell "4" [ref=e331]:
                    - button "4" [disabled]
                - row [ref=e332]:
                  - gridcell [ref=e333]:
                    - button "5" [ref=e334]
                  - gridcell [ref=e335]:
                    - button "6" [ref=e336]
                  - gridcell [ref=e337]:
                    - button "7" [ref=e338]
                  - gridcell [selected] [ref=e339]:
                    - button "8" [ref=e340]
                  - gridcell [ref=e341]:
                    - button "9" [ref=e342]
                  - gridcell [ref=e343]:
                    - button "10" [ref=e344]
                  - gridcell [ref=e345]:
                    - button "11" [ref=e346]
                - row [ref=e347]:
                  - gridcell [ref=e348]:
                    - button "12" [ref=e349]
                  - gridcell [ref=e350]:
                    - button "13" [ref=e351]
                  - gridcell [ref=e352]:
                    - button "14" [ref=e353]
                  - gridcell [ref=e354]:
                    - button "15" [ref=e355]
                  - gridcell [ref=e356]:
                    - button "16" [ref=e357]
                  - gridcell [ref=e358]:
                    - button "17" [ref=e359]
                  - gridcell [ref=e360]:
                    - button "18" [ref=e361]
                - row [ref=e362]:
                  - gridcell [ref=e363]:
                    - button "19" [ref=e364]
                  - gridcell [ref=e365]:
                    - button "20" [ref=e366]
                  - gridcell [ref=e367]:
                    - button "21" [ref=e368]
                  - gridcell [ref=e369]:
                    - button "22" [ref=e370]
                  - gridcell [ref=e371]:
                    - button "23" [ref=e372]
                  - gridcell [ref=e373]:
                    - button "24" [ref=e374]
                  - gridcell [ref=e375]:
                    - button "25" [ref=e376]
                - row [ref=e377]:
                  - gridcell [ref=e378]:
                    - button "26" [ref=e379]
                  - gridcell [ref=e380]:
                    - button "27" [ref=e381]
                  - gridcell [ref=e382]:
                    - button "28" [ref=e383]
                  - gridcell [ref=e384]:
                    - button "29" [ref=e385]
                  - gridcell [ref=e386]:
                    - button "30" [ref=e387]
                  - gridcell [ref=e388]:
                    - button "31" [ref=e389]
                  - gridcell [disabled] [ref=e390]
                - row [ref=e391]:
                  - gridcell [disabled] [ref=e392]
                  - gridcell [disabled] [ref=e393]
                  - gridcell [disabled] [ref=e394]
                  - gridcell [disabled] [ref=e395]
                  - gridcell [disabled] [ref=e396]
                  - gridcell [disabled] [ref=e397]
                  - gridcell [disabled] [ref=e398]
              - button "Today" [ref=e400]
            - button "View code" [ref=e402]
          - heading "Accessibility" [level=2] [ref=e403]
          - list [ref=e404]:
            - listitem [ref=e405]:
              - code [ref=e406]: role="grid"
              - text: /
              - code [ref=e407]: row
              - text: /
              - code [ref=e408]: gridcell
              - text: with
              - code [ref=e409]: aria-selected
              - text: ","
              - code [ref=e410]: aria-current="date"
              - text: for today,
              - code [ref=e411]: aria-disabled
              - text: for unreachable days.
            - listitem [ref=e412]:
              - text: "Keyboard: arrows move by day/week; Home/End jump to week edges; PageUp/PageDown change months; Enter/Space select."
              - code [ref=e413]: min
              - text: /
              - code [ref=e414]: max
              - text: clamp keyboard focus too.
            - listitem [ref=e415]:
              - text: The month label is
              - code [ref=e416]: aria-live="polite"
              - text: ", so month navigation is announced."
            - listitem [ref=e417]: The grid always renders 6 rows; out-of-month cells are blank.
          - heading "Composition" [level=2] [ref=e418]
          - paragraph [ref=e419]:
            - code [ref=e420]: Calendar
            - text: is the engine inside
            - code [ref=e421]: DatePicker
            - text: and
            - code [ref=e422]: DateRangePicker
            - text: ; use it bare for inline/always-visible date UIs. Date arithmetic helpers (
            - code [ref=e423]: addDays
            - text: ","
            - code [ref=e424]: addMonths
            - text: ","
            - code [ref=e425]: todayKey
            - text: ", …) are exported from the package root."
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * Implementation plan §7.1 — screenshot every component in apps/docs's live
  5   |  * previews, once per preset (4 screenshots per component minimum). The docs
  6   |  * site is driven per-preset by setting the persisted srui-style before
  7   |  * navigation (same mechanism the top-nav switcher uses). CI fails on any
  8   |  * pixel diff above 0.1% (maxDiffPixelRatio) against the committed baselines
  9   |  * in tests/visual.spec.ts-snapshots/.
  10  |  */
  11  | const PRESETS = ["flat", "glass", "neumorphic", "skeuomorphic"] as const;
  12  | 
  13  | const PAGES: Record<string, string> = {
  14  |   button: "/components/button/",
  15  |   card: "/components/card/",
  16  |   input: "/components/input/",
  17  |   dialog: "/components/dialog/",
  18  |   loader: "/components/loader/",
  19  |   "stat-card": "/components/stat-card/",
  20  |   charts: "/components/charts/",
  21  |   select: "/components/select/",
  22  |   combobox: "/components/combobox/",
  23  |   tabs: "/components/tabs/",
  24  |   tooltip: "/components/tooltip/",
  25  |   popover: "/components/popover/",
  26  |   toast: "/components/toast/",
  27  |   checkbox: "/components/checkbox/",
  28  |   "radio-group": "/components/radio-group/",
  29  |   switch: "/components/switch/",
  30  |   textarea: "/components/textarea/",
  31  |   "form-field": "/components/form-field/",
  32  |   avatar: "/components/avatar/",
  33  |   badge: "/components/badge/",
  34  |   separator: "/components/separator/",
  35  |   accordion: "/components/accordion/",
  36  |   collapsible: "/components/collapsible/",
  37  |   "app-shell": "/components/app-shell/",
  38  |   "data-table": "/components/data-table/",
  39  |   "chart-card": "/components/chart-card/",
  40  |   "form-builder": "/components/form-builder/",
  41  |   "command-palette": "/components/command-palette/",
  42  |   "notification-center": "/components/notification-center/",
  43  |   wizard: "/components/wizard/",
  44  |   calendar: "/components/calendar/",
  45  |   "date-picker": "/components/date-picker/",
  46  |   "date-range-picker": "/components/date-range-picker/",
  47  |   "time-picker": "/components/time-picker/",
  48  |   "time-range-picker": "/components/time-range-picker/",
  49  |   "dropdown-menu": "/components/dropdown-menu/",
  50  |   alert: "/components/alert/",
  51  |   progress: "/components/progress/",
  52  |   sheet: "/components/sheet/",
  53  |   drawer: "/components/drawer/",
  54  |   modal: "/components/modal/",
  55  |   "tag-input": "/components/tag-input/",
  56  |   "scroll-area": "/components/scroll-area/",
  57  |   "file-upload": "/components/file-upload/",
  58  |   breadcrumb: "/components/breadcrumb/",
  59  |   "tree-view": "/components/tree-view/",
  60  |   timeline: "/components/timeline/",
  61  |   "alert-dialog": "/components/alert-dialog/",
  62  |   pagination: "/components/pagination/",
  63  |   slider: "/components/slider/",
  64  |   "color-picker": "/components/color-picker/",
  65  | };
  66  | 
  67  | for (const preset of PRESETS) {
  68  |   test.describe(`visual regression — ${preset}`, () => {
  69  |     for (const [name, path] of Object.entries(PAGES)) {
  70  |       test(`${name} (${preset})`, async ({ page }) => {
  71  |         // Screenshot the prerendered artifact: block script requests so no
  72  |         // hydration runs during the stability check (the SSG HTML is
  73  |         // complete; the inline no-flash script still applies the preset
  74  |         // pre-paint). Interaction coverage lives in the a11y suite.
  75  |         await page.route("**/*", (route) =>
  76  |           route.request().resourceType() === "script"
  77  |             ? route.abort()
  78  |             : route.continue(),
  79  |         );
  80  |         // Drive the docs site the same way the switcher does: persisted
  81  |         // style + light scheme, applied pre-paint by the no-flash script.
  82  |         await page.addInitScript(
  83  |           ([style]) => {
  84  |             localStorage.setItem("srui-style", style);
  85  |             localStorage.setItem("srui-scheme", "light");
  86  |           },
  87  |           [preset],
  88  |         );
  89  |         await page.goto(path);
  90  |         await page.waitForLoadState("domcontentloaded");
  91  |         // Wait for fonts + the first live preview to settle.
  92  |         await page.evaluate(() => document.fonts.ready);
  93  |         const article = page.locator("article").first();
  94  |         await article.waitFor();
  95  |         await page.waitForTimeout(1200);
  96  | 
> 97  |         await expect(article).toHaveScreenshot(`${name}-${preset}.png`, {
      |                               ^ Error: expect(locator).toHaveScreenshot(expected) failed
  98  |           maxDiffPixelRatio: 0.001,
  99  |           // Element screenshots capture the whole element already; fullPage
  100 |           // triggers a viewport resize that fights AppShell's re-renders
  101 |           // during the stability check.
  102 |           // Freeze CSS animations/transitions at their end state (charts,
  103 |           // count-ups, entrance effects) for deterministic baselines.
  104 |           animations: "disabled",
  105 |           caret: "hide",
  106 |           // Full-page shots of the AppShell-framed pages are heavier than
  107 |           // the default 5s expect budget allows for the stability passes.
  108 |           timeout: 30_000,
  109 |         });
  110 |       });
  111 |     }
  112 |   });
  113 | }
  114 | 
```