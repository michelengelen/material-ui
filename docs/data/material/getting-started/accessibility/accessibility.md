# Accessibility conformance report

<p class="description">How Material UI components conform to WCAG 2.2 Level A and AA, reported in VPAT terms for procurement and accessibility review.</p>

:::warning
**Draft — partial coverage.** This report covers the 12 components assessed so far, not the whole library. It has not been reviewed by an external auditor, and no assistive-technology testing has been performed yet. See [Scope and limitations](#scope-and-limitations) before relying on it for a procurement decision.
:::

## About this report

This is a Voluntary Product Accessibility Template (VPAT®) style report: it states, criterion by criterion, how far Material UI meets the [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) at Levels A and AA, using the conformance vocabulary defined by the [Information Technology Industry Council](https://www.itic.org/policy/accessibility/vpat).

It is generated from the per-component conformance reports kept next to the source code, at `packages/mui-material/src/<Component>/accessibility.md`. Each of those rates its component against every applicable success criterion, records the reasoning, and gives the manual steps needed to re-verify the result. Nothing in this page is asserted without a corresponding component report behind it.

### Product information

| Field             | Value                                                                                                                           |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| Product           | Material UI (`@mui/material`)                                                                                                   |
| Product type      | React component library (software)                                                                                              |
| Version assessed  | See the [releases page](https://github.com/mui/material-ui/releases) for the current version; results track the `master` branch |
| Vendor            | MUI                                                                                                                             |
| Standards applied | WCAG 2.2 Level A and AA                                                                                                         |
| Report type       | Self-assessment, published as source-controlled documentation                                                                   |

### Evaluation methods

Conformance was determined by combining three methods, recorded per criterion in the component reports:

- **⚙️ Automated.** [axe-core](https://github.com/dequelabs/axe-core) runs against the documentation demos inside the Playwright visual-regression suite, plus deterministic unit tests for behaviors axe cannot see (keyboard operation, focus order, pointer cancellation, accessible naming). Results are committed to the repository as `docs/data/material/components/<slug>/<slug>.a11y.json` and checked in CI, so a regression fails the build.
- **🔁 Hybrid.** Automation catches regressions but human judgement is still needed to confirm the result.
- **🔍 Manual.** Source review and human judgement. Each such criterion carries written test steps and an explicit pass condition so the assessment can be reproduced.

:::warning
**No assistive-technology testing has been performed.** Results are based on source review, automated checks, and manual keyboard testing. Screen-reader passes (NVDA, JAWS, VoiceOver) are planned but not yet done, so no claim is made about behavior in specific assistive technologies.
:::

## How to read the ratings

### Conformance

| Symbol | Term               | Meaning                                         |
| :----- | :----------------- | :---------------------------------------------- |
| ✅     | Supports           | Met, with no known defects.                     |
| ⚠️     | Partially Supports | Some functionality does not meet the criterion. |
| ❌     | Does Not Support   | Most functionality does not meet the criterion. |
| ➖     | Not Applicable     | The criterion does not apply to this component. |

A criterion is **flagged** (🚩) when its rating was assessed from the source but is not yet confirmed by a test or a recorded review. **The flag is about strength of evidence, not about conformance** — a flagged ✅ is not a suspected defect, it is a result that has not yet been independently re-verified.

### Who is responsible

A component library is not an application, and this distinction matters more here than in a typical VPAT. Many success criteria cannot be met by a component alone — they depend on the page it is placed in, the content passed to it, and the theme applied to it. Each criterion is therefore also marked with where responsibility sits:

| Symbol | Term      | Meaning                                                     |
| :----- | :-------- | :---------------------------------------------------------- |
| ●      | Component | Material UI satisfies it on its own.                        |
| ◐      | Shared    | Satisfied when the component is used as documented.         |
| ○      | Author    | Depends on your implementation and the surrounding content. |

:::info
An application built with Material UI is not automatically accessible. Material UI supplies accessible building blocks; meeting WCAG for a finished product remains the responsibility of the team building it. The per-component reports state exactly which criteria fall to you.
:::

## Summary

Across the 12 components assessed, against WCAG 2.2 Levels A and AA:

| Result                | Criteria ratings |
| :-------------------- | :--------------- |
| ✅ Supports           | 206              |
| ⚠️ Partially Supports | 24               |
| ❌ Does Not Support   | 0                |
| ➖ Not Applicable     | 387              |

**No component records a ❌ Does Not Support rating for any Level A or AA criterion.**

Rolled up to the library level — where a criterion takes the worst rating any assessed component receives — 32 success criteria are exercised by at least one component:

| Result                | Success criteria |
| :-------------------- | :--------------- |
| ✅ Supports           | 25               |
| ⚠️ Partially Supports | 7                |
| ❌ Does Not Support   | 0                |

The remaining Level A and AA criteria are Not Applicable to every component assessed so far. They apply at the page or application level — for example [1.2.x Time-based Media](https://www.w3.org/WAI/WCAG22/Understanding/), [2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks), [3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page) — and are the responsibility of the application.

### Per-component results

| Component         | ✅ Supports | ⚠️ Partially Supports | ❌ Does Not Support | ➖ Not Applicable |
| :---------------- | :---------- | :-------------------- | :------------------ | :---------------- |
| Accordion         | 19          | 0                     | 0                   | 31                |
| AccordionSummary  | 23          | 1                     | 0                   | 31                |
| Avatar            | 9           | 2                     | 0                   | 44                |
| Button            | 23          | 4                     | 0                   | 28                |
| Checkbox          | 22          | 3                     | 0                   | 30                |
| LinearProgress    | 8           | 3                     | 0                   | 44                |
| Radio             | 23          | 2                     | 0                   | 30                |
| RadioGroup        | 7           | 0                     | 0                   | 30                |
| Switch            | 23          | 2                     | 0                   | 30                |
| TextField         | 25          | 3                     | 0                   | 27                |
| ToggleButton      | 20          | 4                     | 0                   | 31                |
| ToggleButtonGroup | 4           | 0                     | 0                   | 31                |

Container components (Accordion, RadioGroup, ToggleButtonGroup) defer item-level criteria to the component they contain, so their totals are smaller by design.

## WCAG 2.2 report

### Table 1: Success criteria, Level A

| Criterion                              | Conformance              | Remarks                                                                                                                                                                                                                            |
| :------------------------------------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content                 | ✅ Supports              | Decorative icons are hidden from assistive technology; components that need a name accept one.                                                                                                                                     |
| 1.3.1 Info and Relationships           | ✅ Supports              | Native semantics and ARIA relationships are set by the components.                                                                                                                                                                 |
| 1.3.2 Meaningful Sequence              | 🚩 ✅ Supports           | Slots render in DOM order. Reading order across several controls is set by your layout.                                                                                                                                            |
| 1.3.3 Sensory Characteristics          | 🚩 ✅ Supports           | Components can be identified by name. Instructions in your content must not rely on shape, color, or position alone.                                                                                                               |
| 1.4.1 Use of Color                     | 🚩 ⚠️ Partially Supports | Toggle Button: for the color variants, selected and unselected labels are near-identical in grayscale, so the pressed state is conveyed largely by hue.                                                                            |
| 2.1.1 Keyboard                         | ✅ Supports              | All interactive components are operable by keyboard; verified by automated tests.                                                                                                                                                  |
| 2.1.2 No Keyboard Trap                 | ✅ Supports              | Focus can always enter and leave; verified by automated tests.                                                                                                                                                                     |
| 2.2.2 Pause, Stop, Hide                | 🚩 ⚠️ Partially Supports | LinearProgress: the `indeterminate`, `query`, and `buffer` variants animate indefinitely with no built-in pause, stop, or hide control.                                                                                            |
| 2.3.1 Three Flashes or Below Threshold | 🚩 ✅ Supports           | No component flashes more than three times per second.                                                                                                                                                                             |
| 2.4.3 Focus Order                      | ✅ Supports              | Components are a single tab stop in DOM order, with no positive `tabIndex`; disabled controls leave the tab order.                                                                                                                 |
| 2.4.4 Link Purpose (In Context)        | ✅ Supports              | Link text and accessible names are author-supplied and exposed unchanged.                                                                                                                                                          |
| 2.5.2 Pointer Cancellation             | 🚩 ✅ Supports           | Activation happens on release over the target; releasing away cancels it.                                                                                                                                                          |
| 2.5.3 Label in Name                    | 🚩 ✅ Supports           | The accessible name includes the visible label text.                                                                                                                                                                               |
| 3.2.1 On Focus                         | ✅ Supports              | Moving focus to a component does not activate it or change context.                                                                                                                                                                |
| 3.2.2 On Input                         | ✅ Supports              | Changing a value does not automatically change context.                                                                                                                                                                            |
| 3.3.1 Error Identification             | ✅ Supports              | TextField's `error` state is exposed programmatically and associated with the field.                                                                                                                                               |
| 3.3.2 Labels or Instructions           | 🚩 ✅ Supports           | Labeling APIs are provided and documented; supplying the text is the author's job.                                                                                                                                                 |
| 4.1.2 Name, Role, Value                | ⚠️ Partially Supports    | Checkbox: the `indeterminate` state sets `aria-checked="mixed"` on a native checkbox whose `checked` property is `false`, which ARIA in HTML disallows. Setting the native `indeterminate` property instead is the conforming fix. |

### Table 2: Success criteria, Level AA

| Criterion                           | Conformance              | Remarks                                                                                                                                                                                                                                                                                                                                                                                           |
| :---------------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.3.5 Identify Input Purpose        | ✅ Supports              | `autocomplete` and related attributes pass through to the native input.                                                                                                                                                                                                                                                                                                                           |
| 1.4.3 Contrast (Minimum)            | 🚩 ⚠️ Partially Supports | Default-theme shortfalls: `info` and `warning` contained Buttons; Avatar's default white-on-`grey[400]` (~1.9:1); TextField's placeholder (~2.55:1) and some focused labels; selected Toggle Button labels.                                                                                                                                                                                       |
| 1.4.4 Resize Text                   | 🚩 ✅ Supports           | Typography is set in `rem`/`em` and scales with zoom. A fixed-pixel container in your layout could still clip.                                                                                                                                                                                                                                                                                    |
| 1.4.5 Images of Text                | ✅ Supports              | Labels are real text.                                                                                                                                                                                                                                                                                                                                                                             |
| 1.4.10 Reflow                       | 🚩 ✅ Supports           | Components reflow and labels wrap; horizontal overflow at 320px comes from the surrounding layout.                                                                                                                                                                                                                                                                                                |
| 1.4.11 Non-text Contrast            | 🚩 ⚠️ Partially Supports | The most widespread gap. The default keyboard focus indicator is the ripple, and `disableRipple`/`disableFocusRipple` removes it entirely. Several default boundaries also fall below 3:1 — TextField's `outlined` resting border (~1.74:1), AccordionSummary's focus tint (~1.3:1), Switch's light-mode thumb and track (~1.8–2.7:1), LinearProgress's fill-versus-track (~2.7:1 for `primary`). |
| 1.4.12 Text Spacing                 | 🚩 ✅ Supports           | Content stays visible under the WCAG text-spacing overrides; covered by a dedicated regression test.                                                                                                                                                                                                                                                                                              |
| 2.4.6 Headings and Labels           | 🚩 ✅ Supports           | Components expose the labels they are given; wording is the author's responsibility.                                                                                                                                                                                                                                                                                                              |
| 2.4.7 Focus Visible                 | 🚩 ⚠️ Partially Supports | Button, Checkbox, Radio, Switch, Toggle Button: `disableRipple`/`disableFocusRipple` removes the only keyboard focus indicator unless you style `.Mui-focusVisible` yourself. Toggle Button has no fallback indicator at all.                                                                                                                                                                     |
| 2.4.11 Focus Not Obscured (Minimum) | 🚩 ✅ Supports           | Components never obscure themselves; sticky headers and overlays in your layout can.                                                                                                                                                                                                                                                                                                              |
| 2.5.8 Target Size (Minimum)         | ✅ Supports              | Default sizes meet the 24×24 CSS-pixel minimum; verified by axe.                                                                                                                                                                                                                                                                                                                                  |
| 3.2.4 Consistent Identification     | 🚩 ✅ Supports           | One stable accessible name per set of props. Cross-page consistency is the author's responsibility.                                                                                                                                                                                                                                                                                               |
| 3.3.3 Error Suggestion              | ✅ Supports              | Helper text is associated with the field; the suggestion text is author-supplied.                                                                                                                                                                                                                                                                                                                 |
| 4.1.3 Status Messages               | 🚩 ⚠️ Partially Supports | No live regions are added automatically: Button's `loading` state, TextField's dynamically shown error, and LinearProgress value changes may go unannounced. Add an `aria-live` region in your application.                                                                                                                                                                                       |

## Known gaps and how to work around them

Four issues account for almost every ⚠️ rating. Three are properties of the **default theme** rather than of the components' structure, which means a theme can resolve them today.

### 1. The focus indicator is the ripple

Affects **1.4.11** and **2.4.7** on Button, Checkbox, Radio, Switch, and Toggle Button. Setting `disableRipple` or `disableFocusRipple` — including globally via `MuiButtonBase` default props — removes the only visible keyboard focus indicator.

**Workaround.** If you disable the ripple, restore an indicator in your theme:

```js
const theme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '2px solid currentColor',
            outlineOffset: 2,
          },
        },
      },
    },
  },
});
```

### 2. Some default palette colors fall short of contrast minimums

Affects **1.4.3** and **1.4.11**. The shortfalls are listed in Table 1 and Table 2 above and, per component, in the linked reports.

**Workaround.** Override the affected palette entries, or avoid the affected variants for text-bearing UI. Contrast is a theme decision, so a compliant palette resolves this without changing component code.

### 3. Dynamic state changes are not announced

Affects **4.1.3** on Button, LinearProgress, and TextField.

**Workaround.** Render your own `aria-live` region alongside the component when a state change needs announcing — for example a polite live region reporting upload progress next to a `LinearProgress`.

### 4. Indefinite animation cannot be paused

Affects **2.2.2** on LinearProgress's `indeterminate`, `query`, and `buffer` variants.

**Workaround.** Only show an indeterminate progress bar while an operation is genuinely in flight, and remove it when the operation finishes. Material UI also honours `prefers-reduced-motion`.

### One genuine defect

Checkbox's `indeterminate` state (**4.1.2**) is a real bug rather than a theme or integration issue, and is tracked for a fix.

## Scope and limitations

:::warning
Read this section before citing the report.
:::

- **Component coverage is partial.** 12 components are assessed. Widely used components including Select, Autocomplete, Dialog, Menu, Table, Tabs, Slider, Tooltip, Snackbar, and Drawer are **not yet assessed**, and this report says nothing about them. Components onboard incrementally.
- **No assistive-technology testing.** No screen-reader passes have been performed. Criteria that depend on how a specific assistive technology behaves are assessed from the exposed accessibility tree, not from observed behavior.
- **Level AAA is out of scope**, as it is for a standard VPAT.
- **Components are rated in isolation.** Each is assessed as rendered with default props and the default theme. Customization, composition, and your surrounding page can change the result — which is what the ● / ◐ / ○ responsibility marks are for.
- **Evidence strength varies.** 75 of the 230 criterion ratings are flagged as assessed-from-source but not yet re-verified by a test or recorded review.
- **This is a self-assessment.** It has not been audited by an independent third party.
- **Section 508 and EN 301 549 chapters are not yet included.** The WCAG tables above supply the substance those chapters incorporate by reference, but the chapter-by-chapter mapping — including Functional Performance Criteria, software requirements, and support-documentation requirements — has not been written.

## Per-component reports

Full reasoning, responsibility marks, and reproducible manual test steps live with the source:

- [Reports index](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/accessibility.md)
- [Accordion](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Accordion/accessibility.md) · [AccordionSummary](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/AccordionSummary/accessibility.md)
- [Avatar](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Avatar/accessibility.md)
- [Button](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Button/accessibility.md)
- [Checkbox](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Checkbox/accessibility.md)
- [LinearProgress](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/LinearProgress/accessibility.md)
- [Radio](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Radio/accessibility.md) · [RadioGroup](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/RadioGroup/accessibility.md)
- [Switch](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Switch/accessibility.md)
- [TextField](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/TextField/accessibility.md)
- [ToggleButton](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ToggleButton/accessibility.md) · [ToggleButtonGroup](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ToggleButtonGroup/accessibility.md)

## Feedback

Accessibility defects are treated as bugs. Report them on [GitHub](https://github.com/mui/material-ui/issues/new/choose) with the component, the success criterion, and steps to reproduce.
