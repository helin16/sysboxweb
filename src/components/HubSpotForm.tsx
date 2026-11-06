import { useEffect } from "react";

const HUBSPOT_SCRIPT_SRC = "https://js.hsforms.net/forms/v2.js";
const STYLE_ID = "sysbox-hs-form-style";

/*
 * HubSpot renders the form inside a same-origin iframe, so the site's own
 * styles don't reach it. These rules are injected into that iframe once the
 * form is ready.
 */
const FONT = `'Inter', ui-sans-serif, system-ui, sans-serif`;
const FORM_CSS = `
  body { margin: 0; font-family: ${FONT}; -webkit-font-smoothing: antialiased; }
  /* Padding keeps focus glows and the button shadow inside the iframe. */
  form.hs-form {
    display: flex; flex-direction: column; gap: 22px;
    box-sizing: border-box; width: 100%; max-width: none;
    padding: 6px 6px 24px;
  }
  .hs-form-field { margin: 0 !important; }
  .hs_firstname { order: 1; }
  .hs_email { order: 2; }
  .hs_message { order: 3; }
  .hs_recaptcha { order: 4; }
  .hs_error_rollup { order: 5; }
  .hs_submit { order: 6; }

  .hs-form-field > label, .hs-form-field > label span {
    font-family: ${FONT} !important;
  }
  .hs-form-field > label {
    display: block; margin: 0 0 8px; color: #0f172a;
    font-size: 14px; font-weight: 600; line-height: 1.3;
  }
  .hs-form-required { color: #dc2626; margin-left: 2px; }
  .hs-form-field .input { margin: 0 !important; }

  .hs-input {
    box-sizing: border-box; width: 100% !important; height: auto !important;
    padding: 12px 14px !important;
    border: 1px solid #cbd5e1 !important; border-radius: 8px !important;
    background: #fff !important; color: #0f172a !important; box-shadow: none !important;
    font-family: inherit !important; font-size: 16px !important; line-height: 1.5 !important;
    transition: border-color .2s, box-shadow .2s;
  }
  .hs-input::placeholder { color: #94a3b8; opacity: 1; }
  .hs-input:hover { border-color: #94a3b8 !important; }
  .hs-input:focus {
    outline: none; border-color: #2563eb !important;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, .15) !important;
  }
  textarea.hs-input { min-height: 150px; resize: vertical; }
  .hs-input.invalid.error { border-color: #dc2626 !important; }

  .hs-error-msgs { list-style: none; margin: 6px 0 0; padding: 0; }
  .hs-error-msg, .hs-main-font-element {
    color: #dc2626; font-size: 13px;
    font-family: ${FONT} !important;
  }

  .hs_submit .actions { margin: 0; padding: 0; }
  .hs-button {
    -webkit-appearance: none; appearance: none; cursor: pointer; width: 100%;
    padding: 14px 24px !important; border: 0 !important; border-radius: 8px !important;
    background: #2563eb !important; color: #fff !important;
    font-family: inherit !important; font-size: 16px !important; font-weight: 600 !important;
    box-shadow: 0 6px 16px rgba(37, 99, 235, .3) !important;
    transition: background-color .2s, transform .2s;
  }
  .hs-button:hover { background: #1d4ed8 !important; transform: translateY(-1px); }
  .hs-button:focus-visible { outline: 3px solid #93c5fd; outline-offset: 3px; }

  .hs-form__virality-link { display: none !important; }
  .submitted-message { color: #0f172a; font-size: 18px; line-height: 1.6; }
`;

/** Label and placeholder text shown for each HubSpot field. */
const FIELD_TEXT: Record<string, { label: string; placeholder: string }> = {
  firstname: { label: "Full Name", placeholder: "Your full name" },
  email: { label: "Email", placeholder: "name@example.com" },
  message: { label: "Tell us a little more", placeholder: "Add message..." },
};
const SUBMIT_TEXT = "Get in touch";

const customiseForm = ($form: any) => {
  // HubSpot passes a jQuery object when jQuery is on the page, else the form.
  const form: HTMLFormElement | undefined = $form?.nodeName ? $form : $form?.[0];
  if (!form) return;
  const doc = form.ownerDocument;

  if (!doc.getElementById(STYLE_ID)) {
    const font = doc.createElement("link");
    font.rel = "stylesheet";
    font.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
    doc.head.appendChild(font);
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = FORM_CSS;
    doc.head.appendChild(style);
  }

  Object.entries(FIELD_TEXT).forEach(([name, text]) => {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${name}"]`
    );
    if (!input) return;
    input.placeholder = text.placeholder;
    const labelText = form.querySelector(`label[for="${input.id}"] span`);
    if (labelText) labelText.textContent = text.label;
  });

  const submit = form.querySelector<HTMLInputElement>('input[type="submit"]');
  if (submit) submit.value = SUBMIT_TEXT;
};

type iHubSpotForm = {
  formId: string;
};
const HubSpotForm = ({ formId }: iHubSpotForm) => {
  const formHtmlId = `hbform`;
  useEffect(() => {
    const createForm = () => {
      // @ts-ignore
      if (window.hbspt) {
        const target = document.getElementById(formHtmlId);
        if (target) target.innerHTML = "";
        // @ts-ignore
        window.hbspt.forms.create({
          portalId: "14545640",
          formId,
          target: `#${formHtmlId}`,
          onFormReady: customiseForm,
        });
      }
    };

    // Script already loaded (e.g. arriving here via in-app navigation).
    // @ts-ignore
    if (window.hbspt) {
      createForm();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${HUBSPOT_SCRIPT_SRC}"]`
    );
    if (!script) {
      script = document.createElement("script");
      script.src = HUBSPOT_SCRIPT_SRC;
      document.body.appendChild(script);
    }
    script.addEventListener("load", createForm);
    return () => script?.removeEventListener("load", createForm);
  }, [formId, formHtmlId]);

  return <div id={formHtmlId}></div>;
};

export default HubSpotForm;
