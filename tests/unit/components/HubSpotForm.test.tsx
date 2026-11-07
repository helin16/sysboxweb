import { render } from "@testing-library/react";
import HubSpotForm from "@/components/HubSpotForm";

const SCRIPT_SRC = "https://js.hsforms.net/forms/v2.js";

type CreateOptions = {
  portalId: string;
  formId: string;
  target: string;
  onFormReady: (form: unknown) => void;
};

/** A stand-in for HubSpot's script: records calls and builds a basic form. */
const installFakeHubSpot = () => {
  const create = jest.fn((opts: CreateOptions) => {
    const target = document.querySelector(opts.target)!;
    target.innerHTML = `
      <form class="hs-form">
        <div class="hs_firstname"><label for="f1"><span>First name</span></label><input id="f1" name="firstname"></div>
        <div class="hs_email"><label for="e1"><span>Email</span></label><input id="e1" name="email"></div>
        <div class="hs_message"><textarea id="m1" name="message"></textarea></div>
        <input type="submit" value="Submit">
      </form>`;
  });
  // @ts-ignore
  window.hbspt = { forms: { create } };
  return create;
};

afterEach(() => {
  // @ts-ignore
  delete window.hbspt;
  document.head.querySelectorAll("#sysbox-hs-form-style, link[href*='Inter']").forEach((n) => n.remove());
  document.body.querySelectorAll(`script[src="${SCRIPT_SRC}"]`).forEach((n) => n.remove());
});

const lastOptions = (create: jest.Mock): CreateOptions => create.mock.calls.at(-1)[0];

describe("HubSpotForm", () => {
  it("loads HubSpot's script once and builds the form when it arrives", () => {
    const { container } = render(<HubSpotForm formId="form-123" />);
    const scripts = document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`);
    expect(scripts).toHaveLength(1);
    expect(container.querySelector("#hbform")).toBeInTheDocument();

    const create = installFakeHubSpot();
    scripts[0].dispatchEvent(new Event("load"));
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ portalId: "14545640", formId: "form-123", target: "#hbform" })
    );
  });

  it("reuses a script tag that is already on the page", () => {
    const existing = document.createElement("script");
    existing.src = SCRIPT_SRC;
    document.body.appendChild(existing);
    render(<HubSpotForm formId="form-123" />);
    expect(document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`)).toHaveLength(1);
  });

  it("does nothing if the script loads but HubSpot isn't available", () => {
    render(<HubSpotForm formId="form-123" />);
    const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;
    expect(() => script.dispatchEvent(new Event("load"))).not.toThrow();
  });

  it("stops listening for the script when removed from the page", () => {
    const { unmount } = render(<HubSpotForm formId="form-123" />);
    unmount();
    const create = installFakeHubSpot();
    document.querySelector(`script[src="${SCRIPT_SRC}"]`)!.dispatchEvent(new Event("load"));
    expect(create).not.toHaveBeenCalled();
  });

  it("builds the form straight away if HubSpot is already loaded", () => {
    const create = installFakeHubSpot();
    render(<HubSpotForm formId="form-123" />);
    expect(create).toHaveBeenCalledTimes(1);
    expect(document.querySelector(`script[src="${SCRIPT_SRC}"]`)).toBeNull();
  });

  it("clears any old form before building a new one", () => {
    const create = installFakeHubSpot();
    const { container } = render(<HubSpotForm formId="form-123" />);
    container.querySelector("#hbform")!.insertAdjacentHTML("beforeend", "<p>stale</p>");
    // Re-render with a new form id triggers a rebuild.
    render(<HubSpotForm formId="form-456" />, { container });
    expect(create).toHaveBeenCalledTimes(2);
    expect(container).not.toHaveTextContent("stale");
  });
});

describe("HubSpotForm styling once the form is ready", () => {
  const readyForm = () => {
    const create = installFakeHubSpot();
    const { container } = render(<HubSpotForm formId="form-123" />);
    const form = container.querySelector("form") as HTMLFormElement;
    return { onFormReady: lastOptions(create).onFormReady, form };
  };

  it("relabels the fields and the submit button", () => {
    const { onFormReady, form } = readyForm();
    onFormReady(form);
    expect(form.querySelector("label[for=f1] span")).toHaveTextContent("Full Name");
    expect(form.querySelector('[name="firstname"]')).toHaveAttribute("placeholder", "Your full name");
    expect(form.querySelector('[name="email"]')).toHaveAttribute("placeholder", "name@example.com");
    expect(form.querySelector('[name="message"]')).toHaveAttribute("placeholder", "Add message...");
    expect(form.querySelector('input[type="submit"]')).toHaveValue("Get in touch");
  });

  it("injects the site's form styles once, including hiding HubSpot's promo link", () => {
    const { onFormReady, form } = readyForm();
    onFormReady(form);
    onFormReady(form);
    const styles = document.querySelectorAll("#sysbox-hs-form-style");
    expect(styles).toHaveLength(1);
    expect(styles[0].textContent).toContain(".hs-form__virality-link { display: none !important; }");
    expect(document.querySelectorAll("link[href*='family=Inter']")).toHaveLength(1);
  });

  it("accepts the jQuery-wrapped form HubSpot passes when jQuery is present", () => {
    const { onFormReady, form } = readyForm();
    onFormReady([form]);
    expect(form.querySelector('input[type="submit"]')).toHaveValue("Get in touch");
  });

  it("ignores a missing form and missing fields", () => {
    const { onFormReady, form } = readyForm();
    expect(() => onFormReady(undefined)).not.toThrow();
    expect(() => onFormReady([])).not.toThrow();
    form.querySelector('[name="email"]')!.remove();
    form.querySelector('input[type="submit"]')!.remove();
    expect(() => onFormReady(form)).not.toThrow();
    // The message field has no label; its placeholder is still set.
    expect(form.querySelector('[name="message"]')).toHaveAttribute("placeholder", "Add message...");
  });
});
